export interface InitStatusResponse {
  isInitialized: boolean;
  language: string | null;
}

export interface SetupRequest {
  language: string;
  username: string;
  password: string;
}

export interface SetupResponse {
  success: boolean;
  message: string;
  language: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const initAPI = {
  checkStatus: async (): Promise<InitStatusResponse> => {
    const response = await fetch(`${API_BASE}/api/init/status`);
    if (!response.ok) {
      throw new Error('Failed to check initialization status');
    }
    return response.json();
  },

  setup: async (data: SetupRequest): Promise<SetupResponse> => {
    const response = await fetch(`${API_BASE}/api/init/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Setup failed');
    }
    
    return result;
  }
};