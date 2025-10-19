export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export interface User {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  role: 'admin' | 'user';
}

export interface SystemStatus {
  config: {
    isInitialized: boolean;
    language: string | null;
    createdAt: string | null;
  };
  users: {
    total: number;
    byRole: Record<string, number>;
  };
  system: {
    version: string;
    platform: string;
    arch: string;
    nodeVersion: string;
    uptime: number;
    memoryUsage: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
    };
    cpuCount: number;
    totalMemory: number;
    freeMemory: number;
    hostname: string;
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // 每次都從 localStorage 獲取最新的 token
    const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : this.token;
    
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }
    
    return headers;
  }

  private async handleResponse(response: Response) {
    const result = await response.json();
    
    // 如果收到401錯誤，清除token並重新加載頁面
    if (response.status === 401) {
      this.clearToken();
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
      throw new Error(result.error || 'Authentication failed');
    }
    
    // 如果收到500錯誤，根據錯誤代碼進行不同處理
    if (response.status === 500) {
      const errorCode = result.code;
      
      switch (errorCode) {
        case 'SYSTEM_NOT_INITIALIZED':
          // 系統未初始化，重定向到初始化頁面
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
          break;
        case 'AUTH_REQUIRED':
        case 'AUTH_INVALID':
        case 'USER_NOT_FOUND':
        case 'USER_DATA_MISMATCH':
          // 認證相關錯誤，清除token並重新加載
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
          break;
        default:
          // 其他500錯誤，正常拋出
          break;
      }
      
      throw new Error(result.error || `Server error: ${response.status}`);
    }
    
    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }
    
    return result;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    const result = await this.handleResponse(response);
    this.setToken(result.token);
    return result;
  }

  async getUsers(): Promise<{ users: User[] }> {
    const response = await fetch(`${API_BASE}/api/admin/users`, {
      headers: this.getHeaders(),
    });
    
    return await this.handleResponse(response);
  }

  async createUser(data: CreateUserRequest): Promise<{ success: boolean; user: User }> {
    const response = await fetch(`${API_BASE}/api/admin/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    return await this.handleResponse(response);
  }

  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    return await this.handleResponse(response);
  }

  async getSystemStatus(): Promise<SystemStatus> {
    const response = await fetch(`${API_BASE}/api/admin/status`, {
      headers: this.getHeaders(),
    });
    
    return await this.handleResponse(response);
  }
}

export const apiClient = new ApiClient();