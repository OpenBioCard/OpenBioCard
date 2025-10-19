import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface SecurityAuditLog {
  timestamp: string;
  event: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip?: string;
  userAgent?: string;
  userId?: string;
  details: any;
  hash: string;
}

export class SecurityAuditor {
  private static readonly AUDIT_DIR = path.join(__dirname, '../../audit');
  private static readonly MAX_LOG_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly MAX_LOG_FILES = 5;

  static {
    this.ensureAuditDir();
  }

  private static ensureAuditDir(): void {
    try {
      if (!fs.existsSync(this.AUDIT_DIR)) {
        fs.mkdirSync(this.AUDIT_DIR, { recursive: true, mode: 0o700 });
      }
    } catch (error) {
      console.error('Failed to create audit directory:', error);
    }
  }

  static logSecurityEvent(
    event: string,
    severity: SecurityAuditLog['severity'],
    details: any,
    req?: any
  ): void {
    try {
      const auditEntry: SecurityAuditLog = {
        timestamp: new Date().toISOString(),
        event,
        severity,
        ip: req?.ip,
        userAgent: req?.get?.('User-Agent'),
        userId: req?.user?.id,
        details,
        hash: ''
      };

      // 生成日誌條目的哈希值以防篡改
      const entryString = JSON.stringify(auditEntry);
      auditEntry.hash = crypto.createHash('sha256').update(entryString).digest('hex');

      this.writeAuditLog(auditEntry);

      // 嚴重事件立即報警
      if (severity === 'critical') {
        this.alertCriticalEvent(auditEntry);
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  private static writeAuditLog(entry: SecurityAuditLog): void {
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.AUDIT_DIR, `security-${today}.log`);

    try {
      // 檢查文件大小並輪轉日誌
      if (fs.existsSync(logFile)) {
        const stats = fs.statSync(logFile);
        if (stats.size > this.MAX_LOG_SIZE) {
          this.rotateLogFile(logFile);
        }
      }

      // 寫入日誌
      const logLine = JSON.stringify(entry) + '\n';
      fs.appendFileSync(logFile, logLine, { mode: 0o600 });
    } catch (error) {
      console.error('Failed to write audit log:', error);
    }
  }

  private static rotateLogFile(logFile: string): void {
    const base = logFile.replace('.log', '');
    
    // 移動現有檔案
    for (let i = this.MAX_LOG_FILES - 1; i >= 1; i--) {
      const oldFile = `${base}.${i}.log`;
      const newFile = `${base}.${i + 1}.log`;
      
      if (fs.existsSync(oldFile)) {
        if (i === this.MAX_LOG_FILES - 1) {
          fs.unlinkSync(oldFile); // 刪除最舊的檔案
        } else {
          fs.renameSync(oldFile, newFile);
        }
      }
    }
    
    // 重命名當前檔案
    fs.renameSync(logFile, `${base}.1.log`);
  }

  private static alertCriticalEvent(entry: SecurityAuditLog): void {
    console.error(`🚨 CRITICAL SECURITY ALERT 🚨`);
    console.error(`Event: ${entry.event}`);
    console.error(`Time: ${entry.timestamp}`);
    console.error(`IP: ${entry.ip || 'Unknown'}`);
    console.error(`Details:`, entry.details);
    console.error(`Hash: ${entry.hash}`);
    
    // 在生產環境中，這裡應該發送到監控系統、Slack、Email等
    // 例如: notificationService.sendCriticalAlert(entry);
  }

  static getRecentSecurityEvents(hours: number = 24): SecurityAuditLog[] {
    const events: SecurityAuditLog[] = [];
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    try {
      const files = fs.readdirSync(this.AUDIT_DIR)
        .filter(file => file.startsWith('security-') && file.endsWith('.log'))
        .sort()
        .reverse();

      for (const file of files) {
        const filePath = path.join(this.AUDIT_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.trim().split('\n').filter(line => line);

        for (const line of lines) {
          try {
            const event: SecurityAuditLog = JSON.parse(line);
            if (new Date(event.timestamp) >= cutoffTime) {
              events.push(event);
            }
          } catch (parseError) {
            console.warn('Failed to parse audit log line:', parseError);
          }
        }
      }
    } catch (error) {
      console.error('Failed to read security events:', error);
    }

    return events.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  static detectAnomalies(): { 
    suspiciousIPs: string[];
    unusualPatterns: string[];
    recommendations: string[];
  } {
    const events = this.getRecentSecurityEvents(24);
    const suspiciousIPs: Set<string> = new Set();
    const unusualPatterns: Set<string> = new Set();
    const recommendations: Set<string> = new Set();

    // 分析IP地址模式
    const ipEvents = new Map<string, number>();
    const ipFailures = new Map<string, number>();

    events.forEach(event => {
      if (event.ip) {
        ipEvents.set(event.ip, (ipEvents.get(event.ip) || 0) + 1);
        
        if (event.severity === 'high' || event.severity === 'critical') {
          ipFailures.set(event.ip, (ipFailures.get(event.ip) || 0) + 1);
        }
      }
    });

    // 檢測可疑IP
    ipEvents.forEach((count, ip) => {
      const failures = ipFailures.get(ip) || 0;
      
      if (count > 100) { // 24小時內超過100次請求
        suspiciousIPs.add(ip);
        unusualPatterns.add(`High request volume from ${ip}: ${count} requests`);
      }
      
      if (failures > 10) { // 24小時內超過10次失敗
        suspiciousIPs.add(ip);
        unusualPatterns.add(`High failure rate from ${ip}: ${failures} failures`);
      }
    });

    // 生成建議
    if (suspiciousIPs.size > 0) {
      recommendations.add('Consider implementing IP-based rate limiting');
      recommendations.add('Review and potentially block suspicious IP addresses');
    }

    const criticalEvents = events.filter(e => e.severity === 'critical');
    if (criticalEvents.length > 0) {
      recommendations.add('Investigate critical security events immediately');
    }

    return {
      suspiciousIPs: Array.from(suspiciousIPs),
      unusualPatterns: Array.from(unusualPatterns),
      recommendations: Array.from(recommendations)
    };
  }

  static verifyLogIntegrity(): { valid: boolean; tamperedEntries: number } {
    let tamperedEntries = 0;
    const events = this.getRecentSecurityEvents(24 * 7); // 檢查一週的日誌

    events.forEach(event => {
      const { hash, ...eventWithoutHash } = event;
      const expectedHash = crypto.createHash('sha256')
        .update(JSON.stringify(eventWithoutHash))
        .digest('hex');
      
      if (hash !== expectedHash) {
        tamperedEntries++;
        console.error(`🚨 TAMPERED LOG ENTRY DETECTED:`, {
          timestamp: event.timestamp,
          event: event.event,
          expectedHash,
          actualHash: hash
        });
      }
    });

    return {
      valid: tamperedEntries === 0,
      tamperedEntries
    };
  }
}