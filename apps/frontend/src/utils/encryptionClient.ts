interface EncryptedData {
  data: string;
  timestamp: number;
  keyId: string;
}

interface CryptoSession {
  aesKey: CryptoKey;
  keyId: string;
  clientToken: string;
}

export class EncryptionClient {
  private static session: CryptoSession | null = null;
  private static readonly API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  private static sessionTimer: NodeJS.Timeout | null = null;

  /**
   * 初始化加密客戶端
   */
  static async initialize(): Promise<void> {
    console.log('🔐 Initializing encryption client...');
    
    try {
      await this.establishSession();
      
      // 設置定期會話更新（每5分鐘）
      this.sessionTimer = setInterval(async () => {
        try {
          await this.establishSession();
        } catch (error) {
          console.error('Failed to refresh encryption session:', error);
        }
      }, 5 * 60 * 1000);
      
      console.log('✓ Encryption client initialized successfully');
    } catch (error) {
      console.error('✗ Failed to initialize encryption client:', error);
      throw error;
    }
  }

  /**
   * 建立加密會話
   */
  private static async establishSession(): Promise<void> {
    const maxRetries = 3;
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Establishing encryption session (attempt ${attempt}/${maxRetries})...`);
        
        // 獲取服務器公鑰
        const publicKeyResponse = await fetch(`${this.API_BASE}/api/crypto/public-key`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!publicKeyResponse.ok) {
          throw new Error(`Failed to get public key: HTTP ${publicKeyResponse.status}`);
        }
        
        const { publicKey, keyId } = await publicKeyResponse.json();
        
        if (!publicKey || !keyId) {
          throw new Error('Invalid public key response');
        }
        
        // 生成AES密鑰
        const aesKey = await window.crypto.subtle.generateKey(
          { name: 'AES-CBC', length: 256 },
          true,
          ['encrypt', 'decrypt']
        );
        
        // 導入RSA公鑰
        const rsaPublicKey = await window.crypto.subtle.importKey(
          'spki',
          this.pemToArrayBuffer(publicKey),
          { name: 'RSA-OAEP', hash: 'SHA-256' },
          false,
          ['encrypt']
        );
        
        // 導出AES密鑰並用RSA加密
        const aesKeyBuffer = await window.crypto.subtle.exportKey('raw', aesKey);
        const encryptedAESKey = await window.crypto.subtle.encrypt(
          { name: 'RSA-OAEP' },
          rsaPublicKey,
          aesKeyBuffer
        );
        
        const encryptedAESKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedAESKey)));
        
        // 建立會話
        const sessionResponse = await fetch(`${this.API_BASE}/api/crypto/establish-session`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            encryptedAESKey: encryptedAESKeyBase64,
            keyId
          })
        });
        
        if (!sessionResponse.ok) {
          throw new Error(`Failed to establish session: HTTP ${sessionResponse.status}`);
        }
        
        const { success, sessionId } = await sessionResponse.json();
        if (!success) {
          throw new Error('Session establishment failed');
        }
        
        // 生成客戶端令牌
        const clientToken = await this.generateClientToken();
        
        this.session = {
          aesKey,
          keyId,
          clientToken
        };
        
        console.log(`✓ Encryption session established: ${keyId}`);
        return; // 成功，退出重試循環
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`✗ Session establishment attempt ${attempt} failed:`, lastError.message);
        
        if (attempt < maxRetries) {
          // 等待一段時間後重試
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    // 所有重試都失敗了
    throw lastError || new Error('Failed to establish encryption session after all retries');
  }

  /**
   * 生成客戶端令牌
   */
  private static async generateClientToken(): Promise<string> {
    const tokenData = {
      timestamp: Date.now(),
      random: Math.random().toString(36),
      userAgent: navigator.userAgent.substring(0, 50)
    };
    
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(tokenData));
    
    // 使用WebCrypto API生成簽名
    const key = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode('frontend-client-secret'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await window.crypto.subtle.sign('HMAC', key, data);
    const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
    
    return btoa(JSON.stringify({
      ...tokenData,
      signature: signatureBase64
    }));
  }

  /**
   * 加密數據
   */
  static async encryptData(data: any): Promise<EncryptedData> {
    if (!this.session) {
      await this.establishSession();
    }
    
    if (!this.session) {
      throw new Error('No encryption session available');
    }
    
    try {
      const jsonString = JSON.stringify(data);
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(jsonString);
      
      // 生成隨機IV
      const iv = window.crypto.getRandomValues(new Uint8Array(16));
      
      // 加密數據
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-CBC', iv },
        this.session.aesKey,
        dataBuffer
      );
      
      // 組合IV和加密數據
      const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encryptedBuffer), iv.length);
      
      const encryptedBase64 = btoa(String.fromCharCode(...combined));
      
      return {
        data: encryptedBase64,
        timestamp: Date.now(),
        keyId: this.session.keyId
      };
    } catch (error) {
      console.error('Data encryption failed:', error);
      throw error;
    }
  }

  /**
   * 解密數據
   */
  static async decryptData(encryptedData: EncryptedData): Promise<any> {
    if (!this.session || this.session.keyId !== encryptedData.keyId) {
      await this.establishSession();
    }
    
    if (!this.session) {
      throw new Error('No encryption session available');
    }
    
    try {
      // 解碼base64數據
      const combined = Uint8Array.from(atob(encryptedData.data), c => c.charCodeAt(0));
      
      // 分離IV和加密數據
      const iv = combined.slice(0, 16);
      const encryptedBuffer = combined.slice(16);
      
      // 解密數據
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-CBC', iv },
        this.session.aesKey,
        encryptedBuffer
      );
      
      const decoder = new TextDecoder();
      const jsonString = decoder.decode(decryptedBuffer);
      
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Data decryption failed:', error);
      throw error;
    }
  }

  /**
   * 發送加密請求
   */
  static async request(url: string, options: RequestInit = {}): Promise<Response> {
    if (!this.session) {
      await this.establishSession();
    }
    
    if (!this.session) {
      throw new Error('No encryption session available');
    }
    
    const fullUrl = url.startsWith('http') ? url : `${this.API_BASE}${url}`;
    
    // 設置客戶端令牌
    const headers = {
      'Content-Type': 'application/json',
      'X-Client-Token': this.session.clientToken,
      ...options.headers
    };
    
    // 如果有請求體，加密它
    if (options.body && options.method !== 'GET') {
      try {
        const bodyData = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
        const encryptedBody = await this.encryptData(bodyData);
        options.body = JSON.stringify(encryptedBody);
      } catch (error) {
        console.error('Request body encryption failed:', error);
        throw error;
      }
    }
    
    const response = await fetch(fullUrl, {
      ...options,
      headers
    });
    
    // 如果響應是加密的，解密它
    if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
      const originalJson = response.json;
      (response as any).json = async () => {
        const data = await originalJson.call(response);
        
        // 檢查是否是加密響應
        if (data.data && data.timestamp && data.keyId) {
          try {
            return await this.decryptData(data);
          } catch {
            // 如果解密失敗，返回原始數據
            return data;
          }
        }
        
        return data;
      };
    }
    
    return response;
  }

  /**
   * PEM轉ArrayBuffer
   */
  private static pemToArrayBuffer(pem: string): ArrayBuffer {
    const b64Lines = pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
    const b64 = b64Lines.replace(/\n/g, '');
    const binaryString = atob(b64);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes.buffer;
  }

  /**
   * 清理資源
   */
  static cleanup(): void {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
      this.sessionTimer = null;
    }
    
    this.session = null;
    console.log('🔐 Encryption client cleaned up');
  }
}