import crypto from 'crypto';

export interface CryptoKeyPair {
  publicKey: string;
  privateKey: string;
}

export interface EncryptedData {
  data: string;
  timestamp: number;
  keyId: string;
}

export class E2ECrypto {
  private static keyPairs: Map<string, { keys: CryptoKeyPair; timestamp: number; aesKey?: Buffer }> = new Map();
  private static readonly KEY_ROTATION_INTERVAL = 5 * 60 * 1000; // 5分鐘
  private static readonly AES_KEY_SIZE = 32; // 256位
  private static readonly RSA_KEY_SIZE = 2048;
  private static keyRotationTimer: NodeJS.Timeout | null = null;
  
  // 靜態客戶端密鑰，初始化時生成一次
  private static clientSecret: string | null = null;

  /**
   * 獲取或生成客戶端密鑰
   */
  private static getClientSecret(): string {
    if (!this.clientSecret) {
      this.clientSecret = process.env.CLIENT_SECRET || 
        process.env.VERCEL_ENV ? 
          `vercel-client-${Date.now().toString(36)}` : 
          `default-client-${Date.now().toString(36)}`;
    }
    return this.clientSecret;
  }

  /**
   * 生成RSA密鑰對
   */
  static generateRSAKeyPair(): CryptoKeyPair {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: this.RSA_KEY_SIZE,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    return { publicKey, privateKey };
  }

  /**
   * 生成AES密鑰
   */
  static generateAESKey(): Buffer {
    return crypto.randomBytes(this.AES_KEY_SIZE);
  }

  /**
   * 使用RSA公鑰加密AES密鑰
   */
  static encryptAESKey(aesKey: Buffer, publicKey: string): string {
    return crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      aesKey
    ).toString('base64');
  }

  /**
   * 使用RSA私鑰解密AES密鑰
   */
  static decryptAESKey(encryptedAESKey: string, privateKey: string): Buffer {
    return crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      Buffer.from(encryptedAESKey, 'base64')
    );
  }

  /**
   * 使用AES加密數據
   */
  static encryptData(data: string, aesKey: Buffer): EncryptedData {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-cbc', aesKey);
    cipher.setAutoPadding(true);
    
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    const result = iv.toString('base64') + ':' + encrypted;
    
    return {
      data: result,
      timestamp: Date.now(),
      keyId: this.getCurrentKeyId()
    };
  }

  /**
   * 使用AES解密數據
   */
  static decryptData(encryptedData: EncryptedData, aesKey: Buffer): string {
    const [ivBase64, encrypted] = encryptedData.data.split(':');
    const iv = Buffer.from(ivBase64, 'base64');
    
    const decipher = crypto.createDecipher('aes-256-cbc', aesKey);
    decipher.setAutoPadding(true);
    
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * 初始化密鑰管理系統
   */
  static initializeKeyRotation(): void {
    console.log('🔐 Initializing E2E encryption with key rotation...');
    
    // 生成初始密鑰
    this.rotateKeys();
    
    // 設置定時密鑰輪換
    this.keyRotationTimer = setInterval(() => {
      this.rotateKeys();
    }, this.KEY_ROTATION_INTERVAL);

    console.log(`✓ Key rotation initialized (${this.KEY_ROTATION_INTERVAL}ms interval)`);
  }

  /**
   * 輪換密鑰
   */
  private static rotateKeys(): void {
    const keyId = this.generateKeyId();
    const rsaKeyPair = this.generateRSAKeyPair();
    const aesKey = this.generateAESKey();

    this.keyPairs.set(keyId, {
      keys: rsaKeyPair,
      timestamp: Date.now(),
      aesKey
    });

    // 清理舊密鑰（保留最近10個）
    const keyIds = Array.from(this.keyPairs.keys()).sort();
    if (keyIds.length > 10) {
      const oldKeyIds = keyIds.slice(0, keyIds.length - 10);
      oldKeyIds.forEach(id => this.keyPairs.delete(id));
    }

    console.log(`🔄 Keys rotated. New keyId: ${keyId}`);
  }

  /**
   * 生成密鑰ID
   */
  private static generateKeyId(): string {
    return `key_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  }

  /**
   * 獲取當前密鑰ID
   */
  static getCurrentKeyId(): string {
    const keyIds = Array.from(this.keyPairs.keys()).sort();
    return keyIds[keyIds.length - 1] || '';
  }

  /**
   * 獲取公鑰用於前端
   */
  static getPublicKey(keyId?: string): { publicKey: string; keyId: string } | null {
    console.log('getPublicKey called, available keys:', Array.from(this.keyPairs.keys()));
    const targetKeyId = keyId || this.getCurrentKeyId();
    console.log('target keyId:', targetKeyId);
    const keyData = this.keyPairs.get(targetKeyId);
    
    if (!keyData) {
      console.error('No key data found for keyId:', targetKeyId);
      return null;
    }

    return {
      publicKey: keyData.keys.publicKey,
      keyId: targetKeyId
    };
  }

  /**
   * 建立加密會話
   */
  static establishSession(encryptedAESKey: string, keyId: string): { success: boolean; sessionId?: string; error?: string } {
    const keyData = this.keyPairs.get(keyId);
    
    if (!keyData) {
      console.error(`Key not found: ${keyId}. Available keys:`, Array.from(this.keyPairs.keys()));
      return { success: false, error: `Key not found: ${keyId}` };
    }

    try {
      const aesKey = this.decryptAESKey(encryptedAESKey, keyData.keys.privateKey);
      const sessionId = crypto.randomBytes(16).toString('hex');
      
      // 存儲會話AES密鑰
      keyData.aesKey = aesKey;
      
      console.log(`✓ Session established: ${sessionId} with key: ${keyId}`);
      return { success: true, sessionId };
    } catch (error) {
      console.error('Session establishment failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * 獲取指定密鑰的AES密鑰
   */
  static getAESKey(keyId: string): Buffer | null {
    const keyData = this.keyPairs.get(keyId);
    return keyData?.aesKey || null;
  }

  /**
   * 生成客戶端令牌
   */
  static generateClientToken(): string {
    const token = crypto.randomBytes(32).toString('hex');
    const timestamp = Date.now();
    const clientSecret = this.getClientSecret();
    
    const signature = crypto.createHmac('sha256', clientSecret)
      .update(`${token}:${timestamp}`)
      .digest('hex');
    
    return Buffer.from(`${token}:${timestamp}:${signature}`).toString('base64');
  }

  /**
   * 驗證客戶端令牌
   */
  static verifyClientToken(token: string): boolean {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf8');
      const [clientToken, timestamp, signature] = decoded.split(':');
      
      // 檢查時間戳（令牌有效期5分鐘）
      const now = Date.now();
      const tokenTime = parseInt(timestamp);
      if (now - tokenTime > 300000) { // 5分鐘
        return false;
      }
      
      // 使用相同的客戶端密鑰驗證簽名
      const clientSecret = this.getClientSecret();
      const expectedSignature = crypto.createHmac('sha256', clientSecret)
        .update(`${clientToken}:${timestamp}`)
        .digest('hex');
      
      return signature === expectedSignature;
    } catch (error) {
      return false;
    }
  }

  /**
   * 停止密鑰輪換
   */
  static stopKeyRotation(): void {
    if (this.keyRotationTimer) {
      clearInterval(this.keyRotationTimer);
      this.keyRotationTimer = null;
    }
    this.keyPairs.clear();
    console.log('🔐 Key rotation stopped');
  }
}