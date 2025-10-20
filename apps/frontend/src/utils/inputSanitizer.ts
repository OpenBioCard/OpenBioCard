import DOMPurify from 'isomorphic-dompurify';

export class InputSanitizer {
  /**
   * 清理HTML內容，防止XSS攻擊
   */
  static sanitizeHTML(dirty: string): string {
    if (typeof dirty !== 'string') {
      return '';
    }
    
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span'],
      ALLOWED_ATTR: ['class'],
      KEEP_CONTENT: true,
      ALLOW_DATA_ATTR: false
    });
  }

  /**
   * 清理用戶輸入，移除潛在危險字符
   */
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }
    
    return input
      .replace(/[<>\"']/g, '') // 移除HTML特殊字符
      .replace(/javascript:/gi, '') // 移除javascript協議
      .replace(/on\w+=/gi, '') // 移除事件處理器
      .replace(/data:/gi, '') // 移除data協議
      .replace(/vbscript:/gi, '') // 移除vbscript
      .trim();
  }

  /**
   * 驗證並清理用戶名
   */
  static sanitizeUsername(username: string): string {
    if (typeof username !== 'string') {
      return '';
    }
    
    return username
      .replace(/[^a-zA-Z0-9_\-]/g, '') // 只允許字母數字下劃線連字符
      .substring(0, 32) // 限制長度
      .toLowerCase();
  }

  /**
   * 實時驗證用戶名格式
   */
  static validateUsername(username: string): { isValid: boolean; message: string } {
    if (typeof username !== 'string') {
      return { isValid: false, message: '用戶名必須是字符串' };
    }
    
    if (username.length < 3) {
      return { isValid: false, message: '用戶名至少需要3個字符' };
    }
    
    if (username.length > 32) {
      return { isValid: false, message: '用戶名不能超過32個字符' };
    }
    
    // 檢查是否只包含允許的字符
    if (!/^[a-zA-Z0-9_\-]+$/.test(username)) {
      return { isValid: false, message: '用戶名只能包含字母、數字、下劃線和連字符' };
    }
    
    // 檢查是否以字母開頭
    if (!/^[a-zA-Z]/.test(username)) {
      return { isValid: false, message: '用戶名必須以字母開頭' };
    }
    
    // 檢查是否包含連續的特殊字符
    if (/[-_]{2,}/.test(username)) {
      return { isValid: false, message: '用戶名不能包含連續的連字符或下劃線' };
    }
    
    return { isValid: true, message: '用戶名格式正確' };
  }

  /**
   * 驗證並清理密碼（不修改內容，只驗證）
   */
  static validatePassword(password: string): { isValid: boolean; message: string; strength?: string } {
    if (typeof password !== 'string') {
      return { isValid: false, message: '密碼必須是字符串' };
    }
    
    if (password.length < 8) {
      return { isValid: false, message: '密碼至少需要8個字符' };
    }
    
    if (password.length > 128) {
      return { isValid: false, message: '密碼不能超過128個字符' };
    }
    
    // 檢查是否包含危險模式
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ];
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(password)) {
        return { isValid: false, message: '密碼包含非法字符' };
      }
    }

    // 密碼強度檢查
    let strength = 0;
    let strengthMessage = '';
    
    // 檢查包含數字
    if (/\d/.test(password)) {
      strength += 1;
    }
    
    // 檢查包含小寫字母
    if (/[a-z]/.test(password)) {
      strength += 1;
    }
    
    // 檢查包含大寫字母
    if (/[A-Z]/.test(password)) {
      strength += 1;
    }
    
    // 檢查包含特殊字符
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      strength += 1;
    }
    
    // 檢查長度獎勵
    if (password.length >= 12) {
      strength += 1;
    }
    
    // 檢查是否包含常見弱密碼模式
    const weakPatterns = [
      /^[a-z]+$/,           // 純小寫
      /^[A-Z]+$/,           // 純大寫
      /^\d+$/,              // 純數字
      /^(.)\1{2,}$/,        // 重複字符
      /^(123|abc|qwe)/i,    // 連續字符
      /^(password|admin|user|test)/i  // 常見詞彙
    ];
    
    for (const pattern of weakPatterns) {
      if (pattern.test(password)) {
        return { isValid: false, message: '密碼過於簡單，請使用更複雜的密碼' };
      }
    }
    
    // 設定強度等級
    if (strength >= 4) {
      strengthMessage = '強';
    } else if (strength >= 3) {
      strengthMessage = '中';
    } else if (strength >= 2) {
      strengthMessage = '弱';
      return { isValid: false, message: '密碼強度太弱，請包含更多字符類型（大寫、小寫、數字、特殊字符）', strength: strengthMessage };
    } else {
      strengthMessage = '很弱';
      return { isValid: false, message: '密碼強度很弱，請包含多種字符類型', strength: strengthMessage };
    }
    
    return { isValid: true, message: '密碼格式正確', strength: strengthMessage };
  }

  /**
   * 清理JSON數據
   */
  static sanitizeJSON(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }
    
    if (typeof data === 'string') {
      return this.sanitizeInput(data);
    }
    
    if (typeof data === 'number' || typeof data === 'boolean') {
      return data;
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeJSON(item));
    }
    
    if (typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        const cleanKey = this.sanitizeInput(key);
        if (cleanKey && cleanKey.length > 0) {
          sanitized[cleanKey] = this.sanitizeJSON(value);
        }
      }
      return sanitized;
    }
    
    return data;
  }

  /**
   * 驗證URL安全性
   */
  static validateURL(url: string): { isValid: boolean; message: string } {
    if (typeof url !== 'string') {
      return { isValid: false, message: 'URL must be a string' };
    }
    
    try {
      const parsedURL = new URL(url);
      
      // 只允許HTTP/HTTPS協議
      if (!['http:', 'https:'].includes(parsedURL.protocol)) {
        return { isValid: false, message: 'Only HTTP/HTTPS protocols allowed' };
      }
      
      // 檢查主機名
      if (parsedURL.hostname === 'localhost' || parsedURL.hostname === '127.0.0.1') {
        // 只允許前端訪問同源localhost
        const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
          return { isValid: false, message: 'Localhost access not allowed' };
        }
      }
      
      return { isValid: true, message: 'Valid URL' };
    } catch (error) {
      return { isValid: false, message: 'Invalid URL format' };
    }
  }

  /**
   * 清理文件名
   */
  static sanitizeFilename(filename: string): string {
    if (typeof filename !== 'string') {
      return '';
    }
    
    return filename
      .replace(/[^a-zA-Z0-9._\-]/g, '') // 只允許字母數字點下劃線連字符
      .replace(/\.{2,}/g, '.') // 防止路徑遍歷
      .replace(/^\.+/, '') // 移除開頭的點
      .substring(0, 255); // 限制長度
  }

  /**
   * 檢測SQL注入模式
   */
  static detectSQLInjection(input: string): boolean {
    if (typeof input !== 'string') {
      return false;
    }
    
    const sqlPatterns = [
      /(\b(select|insert|update|delete|drop|create|alter|exec|execute|union|script)\b)/i,
      /(--|#|\/\*|\*\/)/,
      /(\bor\b|\band\b).*?[=<>]/i,
      /['"]\s*;\s*(select|insert|update|delete|drop)/i,
      /\b(char|ascii|concat|length|substr)\s*\(/i
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * 檢測NoSQL注入模式
   */
  static detectNoSQLInjection(input: any): boolean {
    if (typeof input !== 'object' || input === null) {
      return false;
    }
    
    const dangerousKeys = ['$where', '$ne', '$gt', '$lt', '$regex', '$exists', '$in', '$nin'];
    
    function checkObject(obj: any): boolean {
      if (typeof obj !== 'object' || obj === null) {
        return false;
      }
      
      for (const key of Object.keys(obj)) {
        if (dangerousKeys.includes(key)) {
          return true;
        }
        
        if (typeof obj[key] === 'object' && checkObject(obj[key])) {
          return true;
        }
      }
      
      return false;
    }
    
    return checkObject(input);
  }
}