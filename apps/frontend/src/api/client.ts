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
    }
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Login failed');
    }
    
    this.setToken(result.token);
    return result;
  }

  async getUsers(): Promise<{ users: User[] }> {
    const response = await fetch(`${API_BASE}/api/admin/users`, {
      headers: this.getHeaders(),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch users');
    }
    
    return result;
  }

  async createUser(data: CreateUserRequest): Promise<{ success: boolean; user: User }> {
    const response = await fetch(`${API_BASE}/api/admin/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to create user');
    }
    
    return result;
  }

  async getSystemStatus(): Promise<SystemStatus> {
    const response = await fetch(`${API_BASE}/api/admin/status`, {
      headers: this.getHeaders(),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch system status');
    }
    
    return result;
  }
}

export const apiClient = new ApiClient();