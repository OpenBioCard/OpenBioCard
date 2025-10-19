export class IntegrityProtector {
  private static readonly SECRET_KEY = 'frontend-integrity-key';
  
  /**
   * 計算數據完整性哈希
   */
  static async calculateHash(data: any): Promise<string> {
    const jsonString = JSON.stringify(data, Object.keys(data).sort());
    const encoder = new TextEncoder();
    
    // 使用Web Crypto API
    const key = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(this.SECRET_KEY),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await window.crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(jsonString)
    );
    
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * 驗證數據完整性
   */
  static async verifyIntegrity(data: any, expectedHash: string): Promise<boolean> {
    const actualHash = await this.calculateHash(data);
    return actualHash === expectedHash;
  }

  /**
   * 保護localStorage數據
   */
  static secureStorage = {
    async set(key: string, value: any): Promise<void> {
      if (typeof window === 'undefined') return;
      
      const data = {
        value,
        timestamp: Date.now(),
        hash: ''
      };
      
      data.hash = await IntegrityProtector.calculateHash({ value, timestamp: data.timestamp });
      
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    },

    async get(key: string): Promise<any | null> {
      if (typeof window === 'undefined') return null;
      
      try {
        const stored = localStorage.getItem(key);
        if (!stored) return null;
        
        const data = JSON.parse(stored);
        
        // 驗證完整性
        const expectedHash = await IntegrityProtector.calculateHash({ 
          value: data.value, 
          timestamp: data.timestamp 
        });
        
        if (data.hash !== expectedHash) {
          console.warn(`Data integrity check failed for key: ${key}`);
          localStorage.removeItem(key);
          return null;
        }
        
        // 檢查過期時間（24小時）
        if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
          localStorage.removeItem(key);
          return null;
        }
        
        return data.value;
      } catch (error) {
        console.error('Failed to read from localStorage:', error);
        localStorage.removeItem(key);
        return null;
      }
    },

    remove(key: string): void {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    }
  };

  /**
   * 檢測開發者工具
   */
  static detectDevTools(): boolean {
    if (typeof window === 'undefined') return false;
    
    const threshold = 160;
    
    return (
      window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold
    );
  }

  /**
   * 防止右鍵菜單和快捷鍵
   */
  static preventInspection(): void {
    if (typeof window === 'undefined') return;
    
    // 防止右鍵菜單
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });

    // 防止開發者工具快捷鍵
    document.addEventListener('keydown', (e) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J
      if (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (查看源碼)
      if (e.ctrlKey && e.key === 'U') {
        e.preventDefault();
        return false;
      }
    });
  }

  /**
   * 檢測控制台使用
   */
  static detectConsoleUsage(): void {
    if (typeof window === 'undefined') return;
    
    const devtools = {
      open: false,
      orientation: null as string | null
    };

    const threshold = 160;

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          console.clear();
          console.warn('🚨 Developer tools detected! This action has been logged.');
          
          // 發送警報到後端
          if (typeof fetch !== 'undefined') {
            fetch('/api/security/devtools-detected', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
              })
            }).catch(() => {
              // 靜默處理錯誤
            });
          }
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }

  /**
   * 反調試保護
   */
  static antiDebugging(): void {
    if (typeof window === 'undefined') return;
    
    // 檢測調試器
    let startTime = performance.now();
    debugger;
    let endTime = performance.now();
    
    if (endTime - startTime > 100) {
      console.clear();
      window.location.reload();
      return;
    }

    // 定期檢查
    setInterval(() => {
      startTime = performance.now();
      debugger;
      endTime = performance.now();
      
      if (endTime - startTime > 100) {
        console.clear();
        window.location.reload();
      }
    }, 1000);
  }

  /**
   * 代碼混淆檢測
   */
  static async detectCodeTampering(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    // 檢查關鍵函數是否被修改
    const originalFetch = window.fetch.toString();
    const originalXMLHttpRequest = window.XMLHttpRequest.toString();
    
    // 使用Web Crypto API計算哈希
    const encoder = new TextEncoder();
    
    const fetchHash = await window.crypto.subtle.digest('SHA-256', encoder.encode(originalFetch));
    const xhrHash = await window.crypto.subtle.digest('SHA-256', encoder.encode(originalXMLHttpRequest));
    
    const fetchHashHex = Array.from(new Uint8Array(fetchHash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    const xhrHashHex = Array.from(new Uint8Array(xhrHash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // 在生產環境中，這些哈希值應該是硬編碼的
    const expectedFetchHash = fetchHashHex; // 實際應用中需要預設值
    const expectedXHRHash = xhrHashHex; // 實際應用中需要預設值
    
    return (
      fetchHashHex !== expectedFetchHash ||
      xhrHashHex !== expectedXHRHash
    );
  }

  /**
   * 內容安全策略違規處理
   */
  static handleCSPViolation(): void {
    if (typeof window === 'undefined') return;
    
    document.addEventListener('securitypolicyviolation', (e) => {
      console.error('CSP Violation:', {
        violatedDirective: e.violatedDirective,
        blockedURI: e.blockedURI,
        documentURI: e.documentURI,
        originalPolicy: e.originalPolicy
      });
      
      // 發送違規報告到後端
      if (typeof fetch !== 'undefined') {
        fetch('/api/security/csp-violation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            violatedDirective: e.violatedDirective,
            blockedURI: e.blockedURI,
            documentURI: e.documentURI,
            timestamp: new Date().toISOString()
          })
        }).catch(() => {
          // 靜默處理錯誤
        });
      }
    });
  }

  /**
   * 初始化所有保護措施
   */
  static async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    // 在生產環境中啟用保護
    if (process.env.NODE_ENV === 'production') {
      this.preventInspection();
      this.detectConsoleUsage();
      this.antiDebugging();
    }
    
    this.handleCSPViolation();
    
    // 檢測代碼篡改
    if (await this.detectCodeTampering()) {
      console.warn('Code tampering detected!');
    }
  }
}