import { Request, Response, NextFunction } from 'express';
import { E2ECrypto, EncryptedData } from '../utils/e2eCrypto';

interface EncryptedRequest extends Request {
  decryptedBody?: any;
  encryptionKeyId?: string;
}

interface EncryptedResponse extends Response {
  encryptedJson?: (data: any) => Response;
}

export const encryptionMiddleware = (req: EncryptedRequest, res: EncryptedResponse, next: NextFunction) => {
  const startTime = Date.now();

  // 跳過加密的端點（健康檢查、密鑰交換、初始化等）
  const skipEncryption = [
    '/api/health',
    '/api/crypto/public-key',
    '/api/crypto/establish-session',
    '/api/init',
    '/api/auth',
    '/api/admin',
    '/api/user'
  ];

  if (skipEncryption.some(path => req.path.startsWith(path))) {
    return next();
  }

  // 驗證客戶端令牌
  const clientToken = req.header('X-Client-Token');
  if (!clientToken || !E2ECrypto.verifyClientToken(clientToken)) {
    console.warn('🚨 SECURITY ALERT: Invalid or missing client token', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      timestamp: new Date().toISOString()
    });
    
    return res.status(500).json({ 
      error: 'Request processing failed',
      code: 'PROCESSING_ERROR'
    });
  }

  // 處理加密的請求體
  if (req.method !== 'GET' && req.body && !skipEncryption.some(path => req.path.startsWith(path))) {
    try {
      const encryptedData: EncryptedData = req.body;
      
      if (!encryptedData.keyId || !encryptedData.data) {
        return res.status(400).json({ error: 'Invalid encrypted request format' });
      }

      const aesKey = E2ECrypto.getAESKey(encryptedData.keyId);
      if (!aesKey) {
        return res.status(400).json({ error: 'Invalid encryption key' });
      }

      // 檢查時間戳（防重放攻擊）
      const now = Date.now();
      if (Math.abs(now - encryptedData.timestamp) > 30000) { // 30秒窗口
        return res.status(400).json({ error: 'Request timestamp invalid' });
      }

      const decryptedBody = E2ECrypto.decryptData(encryptedData, aesKey);
      req.decryptedBody = JSON.parse(decryptedBody);
      req.body = req.decryptedBody;
      req.encryptionKeyId = encryptedData.keyId;

    } catch (error) {
      console.error('Decryption failed:', error);
      return res.status(500).json({ 
        error: 'Request processing failed',
        code: 'DECRYPTION_ERROR'
      });
    }
  }

  // 覆蓋res.json來自動加密響應
  const originalJson = res.json;
  res.encryptedJson = function(data: any): Response {
    try {
      const keyId = req.encryptionKeyId || E2ECrypto.getCurrentKeyId();
      const aesKey = E2ECrypto.getAESKey(keyId);
      
      if (!aesKey) {
        console.error('No AES key available for response encryption');
        return originalJson.call(this, { error: 'Response processing failed' });
      }

      const encryptedResponse = E2ECrypto.encryptData(JSON.stringify(data), aesKey);
      return originalJson.call(this, encryptedResponse);
    } catch (error) {
      console.error('Response encryption failed:', error);
      return originalJson.call(this, { error: 'Response processing failed' });
    }
  };

  // 自動使用加密響應（除非是錯誤響應或跳過加密的路由）
  res.json = function(this: Response, data: any): Response {
    if (res.statusCode >= 400 || skipEncryption.some(path => req.path.startsWith(path))) {
      // 錯誤響應或跳過加密的路由不加密，返回原始數據
      return originalJson.call(this, data);
    }
    return res.encryptedJson!(data);
  };

  const processingTime = Date.now() - startTime;
  if (processingTime > 10) { // 記錄慢請求
    console.log(`⚠️ Slow encryption processing: ${processingTime}ms for ${req.path}`);
  }

  next();
};