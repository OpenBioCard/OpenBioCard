import { Request, Response, NextFunction } from 'express';
import { SecurityAuditor } from '../utils/securityAuditor';

export interface SecurityMetrics {
  totalRequests: number;
  failedRequests: number;
  blockedRequests: number;
  suspiciousActivity: number;
  encryptedRequests: number;
  averageResponseTime: number;
  topUserAgents: { [key: string]: number };
  topIPs: { [key: string]: number };
  errorsByType: { [key: string]: number };
}

export class SecurityMonitor {
  private static metrics: SecurityMetrics = {
    totalRequests: 0,
    failedRequests: 0,
    blockedRequests: 0,
    suspiciousActivity: 0,
    encryptedRequests: 0,
    averageResponseTime: 0,
    topUserAgents: {},
    topIPs: {},
    errorsByType: {}
  };

  private static responseTimes: number[] = [];
  private static readonly MAX_RESPONSE_TIMES = 1000;

  static middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      
      // 增加總請求數
      this.metrics.totalRequests++;
      
      // 記錄IP
      const clientIP = req.ip || 'unknown';
      this.metrics.topIPs[clientIP] = (this.metrics.topIPs[clientIP] || 0) + 1;
      
      // 記錄User-Agent
      const userAgent = req.get('User-Agent') || 'unknown';
      this.metrics.topUserAgents[userAgent] = (this.metrics.topUserAgents[userAgent] || 0) + 1;
      
      // 檢查是否為加密請求
      if (req.header('X-Client-Token')) {
        this.metrics.encryptedRequests++;
      }
      
      // 監聽響應結束
      res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        
        // 記錄響應時間
        this.responseTimes.push(responseTime);
        if (this.responseTimes.length > this.MAX_RESPONSE_TIMES) {
          this.responseTimes.shift();
        }
        
        // 計算平均響應時間
        this.metrics.averageResponseTime = 
          this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
        
        // 記錄失敗請求
        if (res.statusCode >= 400) {
          this.metrics.failedRequests++;
          
          const errorType = this.getErrorType(res.statusCode);
          this.metrics.errorsByType[errorType] = (this.metrics.errorsByType[errorType] || 0) + 1;
          
          // 記錄安全事件
          if (res.statusCode === 403 || res.statusCode === 401) {
            this.metrics.blockedRequests++;
            SecurityAuditor.logSecurityEvent(
              'ACCESS_DENIED',
              'medium',
              {
                statusCode: res.statusCode,
                path: req.path,
                method: req.method,
                responseTime
              },
              req
            );
          }
        }
        
        // 檢測異常慢的請求
        if (responseTime > 5000) {
          this.metrics.suspiciousActivity++;
          SecurityAuditor.logSecurityEvent(
            'SLOW_REQUEST',
            'low',
            {
              responseTime,
              path: req.path,
              method: req.method
            },
            req
          );
        }
      });
      
      next();
    };
  }

  private static getErrorType(statusCode: number): string {
    if (statusCode >= 400 && statusCode < 500) {
      return 'client_error';
    } else if (statusCode >= 500) {
      return 'server_error';
    }
    return 'unknown_error';
  }

  static getMetrics(): SecurityMetrics {
    return { ...this.metrics };
  }

  static getSecurityReport(): {
    metrics: SecurityMetrics;
    anomalies: ReturnType<typeof SecurityAuditor.detectAnomalies>;
    integrity: ReturnType<typeof SecurityAuditor.verifyLogIntegrity>;
    recommendations: string[];
  } {
    const anomalies = SecurityAuditor.detectAnomalies();
    const integrity = SecurityAuditor.verifyLogIntegrity();
    const recommendations: string[] = [];

    // 分析指標並生成建議
    const failureRate = this.metrics.failedRequests / this.metrics.totalRequests;
    if (failureRate > 0.1) { // 超過10%失敗率
      recommendations.push('High failure rate detected - investigate error patterns');
    }

    const blockRate = this.metrics.blockedRequests / this.metrics.totalRequests;
    if (blockRate > 0.05) { // 超過5%阻止率
      recommendations.push('High block rate - potential attack in progress');
    }

    if (this.metrics.averageResponseTime > 1000) {
      recommendations.push('High average response time - check server performance');
    }

    const encryptionRate = this.metrics.encryptedRequests / this.metrics.totalRequests;
    if (encryptionRate < 0.8) { // 少於80%加密
      recommendations.push('Low encryption rate - ensure all clients use E2E encryption');
    }

    // 檢查異常User-Agent
    const suspiciousUserAgents = Object.entries(this.metrics.topUserAgents)
      .filter(([ua, count]) => {
        const suspicious = /bot|crawler|spider|scraper|curl|wget|python|script/i.test(ua);
        return suspicious && count > 10;
      });

    if (suspiciousUserAgents.length > 0) {
      recommendations.push('Suspicious User-Agents detected - review request patterns');
    }

    return {
      metrics: this.getMetrics(),
      anomalies,
      integrity,
      recommendations: [...recommendations, ...anomalies.recommendations]
    };
  }

  static resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      failedRequests: 0,
      blockedRequests: 0,
      suspiciousActivity: 0,
      encryptedRequests: 0,
      averageResponseTime: 0,
      topUserAgents: {},
      topIPs: {},
      errorsByType: {}
    };
    this.responseTimes = [];
  }

  static alertThresholds = {
    criticalFailureRate: 0.2, // 20%
    criticalBlockRate: 0.1,   // 10%
    criticalResponseTime: 5000, // 5秒
    criticalSuspiciousActivity: 100 // 每小時100次
  };

  static checkAlerts(): string[] {
    const alerts: string[] = [];
    const metrics = this.getMetrics();

    const failureRate = metrics.failedRequests / metrics.totalRequests;
    if (failureRate > this.alertThresholds.criticalFailureRate) {
      alerts.push(`CRITICAL: Failure rate ${(failureRate * 100).toFixed(1)}% exceeds threshold`);
    }

    const blockRate = metrics.blockedRequests / metrics.totalRequests;
    if (blockRate > this.alertThresholds.criticalBlockRate) {
      alerts.push(`CRITICAL: Block rate ${(blockRate * 100).toFixed(1)}% exceeds threshold`);
    }

    if (metrics.averageResponseTime > this.alertThresholds.criticalResponseTime) {
      alerts.push(`CRITICAL: Average response time ${metrics.averageResponseTime}ms exceeds threshold`);
    }

    if (metrics.suspiciousActivity > this.alertThresholds.criticalSuspiciousActivity) {
      alerts.push(`CRITICAL: Suspicious activity count ${metrics.suspiciousActivity} exceeds threshold`);
    }

    return alerts;
  }
}