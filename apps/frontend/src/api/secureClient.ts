import { EncryptionClient } from '../utils/encryptionClient';
import { useEncryption } from '../contexts/EncryptionContext';
import { InputSanitizer } from '../utils/inputSanitizer';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class SecureApiClient {
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    useEncryption: (url: string, options?: RequestInit) => Promise<Response>
  ): Promise<T> {
    try {
      // 清理和驗證端點
      const cleanEndpoint = InputSanitizer.sanitizeInput(endpoint);
      if (cleanEndpoint !== endpoint) {
        throw new Error('Invalid endpoint detected');
      }

      // 驗證URL
      const fullUrl = `${this.baseURL}${endpoint}`;
      const urlValidation = InputSanitizer.validateURL(fullUrl);
      if (!urlValidation.isValid) {
        throw new Error(urlValidation.message);
      }

      // 清理請求體
      if (options.body && typeof options.body === 'string') {
        try {
          const bodyData = JSON.parse(options.body);
          const sanitizedData = InputSanitizer.sanitizeJSON(bodyData);
          
          // 檢測注入攻擊
          const bodyString = JSON.stringify(sanitizedData);
          if (InputSanitizer.detectSQLInjection(bodyString)) {
            throw new Error('Potential SQL injection detected');
          }
          
          if (InputSanitizer.detectNoSQLInjection(sanitizedData)) {
            throw new Error('Potential NoSQL injection detected');
          }
          
          options.body = JSON.stringify(sanitizedData);
        } catch (parseError) {
          throw new Error('Invalid request body format');
        }
      }

      // 設置安全頭
      const secureHeaders = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        ...options.headers
      };

      const response = await EncryptionClient.request(endpoint, {
        ...options,
        headers: secureHeaders
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: 'Request failed', 
          status: response.status 
        }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // 驗證響應數據
      if (typeof data === 'object' && data !== null) {
        const sanitizedResponse = InputSanitizer.sanitizeJSON(data);
        return sanitizedResponse;
      }
      
      return data;
    } catch (error) {
      console.error(`API request failed [${endpoint}]:`, error);
      throw error;
    }
  }

  // 創建帶加密的API客戶端
  static createWithEncryption() {
    return {
      async login(credentials: { username: string; password: string }) {
        const { request } = await import('../contexts/EncryptionContext').then(m => ({ request: null }));
        // 這裡需要使用hook，所以我們需要不同的方法
        throw new Error('Use useSecureApiClient hook instead');
      }
    };
  }
}

// Hook for secure API client
export function useSecureApiClient() {
  const { request } = useEncryption();

  const makeSecureRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    // 清理和驗證端點
    const cleanEndpoint = InputSanitizer.sanitizeInput(endpoint);
    if (cleanEndpoint !== endpoint) {
      throw new Error('Invalid endpoint detected');
    }

    // 清理請求體
    if (options.body && typeof options.body === 'string') {
      try {
        const bodyData = JSON.parse(options.body);
        const sanitizedData = InputSanitizer.sanitizeJSON(bodyData);
        
        // 檢測注入攻擊
        const bodyString = JSON.stringify(sanitizedData);
        if (InputSanitizer.detectSQLInjection(bodyString)) {
          throw new Error('Potential SQL injection detected');
        }
        
        if (InputSanitizer.detectNoSQLInjection(sanitizedData)) {
          throw new Error('Potential NoSQL injection detected');
        }
        
        options.body = JSON.stringify(sanitizedData);
      } catch (parseError) {
        throw new Error('Invalid request body format');
      }
    }

    // 設置安全頭
    const secureHeaders = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      ...options.headers
    };

    try {
      const response = await request(endpoint, {
        ...options,
        headers: secureHeaders
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: 'Request failed', 
          status: response.status 
        }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // 驗證響應數據
      if (typeof data === 'object' && data !== null) {
        return InputSanitizer.sanitizeJSON(data);
      }
      
      return data;
    } catch (error) {
      console.error(`Secure API request failed [${endpoint}]:`, error);
      throw error;
    }
  };

  return {
    async login(credentials: { username: string; password: string }): Promise<ApiResponse<{ user: any; token: string }>> {
      // 驗證憑證
      const passwordValidation = InputSanitizer.validatePassword(credentials.password);
      
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.message);
      }

      // 對於登錄，我們使用直接的 fetch 而不是加密請求
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: 'Request failed', 
          status: response.status 
        }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // 驗證響應數據
      if (typeof data === 'object' && data !== null) {
        return InputSanitizer.sanitizeJSON(data);
      }
      
      return data;
    },

    async getUsers(): Promise<ApiResponse<any[]>> {
      return makeSecureRequest('/api/admin/users');
    },

    async createUser(userData: any): Promise<ApiResponse> {
      return makeSecureRequest('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    },

    async deleteUser(userId: string): Promise<ApiResponse> {
      const cleanUserId = InputSanitizer.sanitizeInput(userId);
      return makeSecureRequest(`/api/admin/users/${cleanUserId}`, {
        method: 'DELETE'
      });
    },

    async getSecurityMetrics(): Promise<ApiResponse> {
      return makeSecureRequest('/api/security/metrics');
    },

    async getSecurityEvents(hours: number = 24): Promise<ApiResponse> {
      return makeSecureRequest(`/api/security/events?hours=${hours}`);
    }
  };
}

export default SecureApiClient;