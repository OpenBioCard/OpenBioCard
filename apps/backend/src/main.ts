import express from 'express';
import cors from 'cors';
import initRoutes from './routes/init';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import securityRoutes from './routes/security';
import { securityMiddleware, apiRateLimiter } from './middleware/security';
import { accessControlMiddleware } from './middleware/accessControl';
import { encryptionMiddleware } from './middleware/encryption';
import { 
  securityHeadersMiddleware, 
  advancedRateLimiter, 
  slowDownMiddleware,
  requestSizeLimit,
  requestValidationMiddleware,
  honeypotMiddleware
} from './middleware/advancedSecurity';
import { SecurityMonitor } from './utils/securityMonitor';
import { FileManager } from './utils/fileManager';
import { SystemIntegrity } from './utils/systemIntegrity';
import { E2ECrypto } from './utils/e2eCrypto';

const app = express();
const port = process.env.PORT || 3001;

// 輸出環境信息（用於調試）
console.log('=== OpenBioCard Backend Environment ===');
console.log(`Node ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`Platform: ${process.env.VERCEL_ENV ? 'Vercel' : process.env.CF_PAGES ? 'Cloudflare Pages' : 'Local'}`);
console.log(`Port: ${port}`);
console.log('========================================');

// 確保data文件夾存在
console.log('=== OpenBioCard Backend Initialization ===');
try {
  FileManager.ensureDataDir();
  console.log('✓ Data directory initialized successfully');
} catch (error) {
  console.error('✗ Failed to initialize data directory:', error);
  console.error('Please ensure the application has proper file system permissions');
  process.exit(1);
}

// 執行系統完整性檢查
console.log('Performing system integrity check...');
try {
  const integrityResult = SystemIntegrity.checkInitializationIntegrity();
  
  if (!integrityResult.isValid) {
    console.error('✗ System integrity check failed:', integrityResult.issues);
    process.exit(1);
  }
  
  if (integrityResult.autoFixed) {
    console.warn('⚠️ System integrity issues auto-fixed:', integrityResult.issues);
    SystemIntegrity.logSecurityEvent('INTEGRITY_AUTO_FIX', integrityResult);
  }
  
  if (integrityResult.issues.length > 0) {
    console.warn('⚠️ System integrity warnings:', integrityResult.issues);
  } else {
    console.log('✓ System integrity check passed');
  }
} catch (error) {
  console.error('✗ System integrity check failed:', error);
  process.exit(1);
}

// 初始化端到端加密系統
console.log('Initializing end-to-end encryption...');
try {
  E2ECrypto.initializeKeyRotation();
  console.log('✓ E2E encryption initialized successfully');
} catch (error) {
  console.error('✗ Failed to initialize E2E encryption:', error);
  process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Apply comprehensive security headers
app.use(securityHeadersMiddleware);

// Apply security monitoring
app.use(SecurityMonitor.middleware());

// Apply honeypot middleware (must be early)
app.use(honeypotMiddleware);

// Apply request validation
app.use(requestValidationMiddleware);

// Apply request size limits
app.use(requestSizeLimit);

// Apply advanced rate limiting and slow down
app.use(advancedRateLimiter);
app.use(slowDownMiddleware);

// Apply legacy security middleware
app.use(securityMiddleware);

// Apply legacy rate limiting (backup)
app.use(apiRateLimiter(5 * 60 * 1000, 5000)); // 5分鐘內5000次請求

// Apply access control middleware - this is the key addition
app.use(accessControlMiddleware);

// Apply encryption middleware for E2E encryption
app.use(encryptionMiddleware);

app.get('/api/health', (_, res) => {
  res.json({ status: 'OK', message: 'Backend API is running' });
});

// 加密端點
app.get('/api/crypto/public-key', (req, res) => {
  const publicKeyData = E2ECrypto.getPublicKey();
  if (!publicKeyData) {
    return res.status(500).json({ error: 'Encryption not available' });
  }
  res.json(publicKeyData);
});

app.post('/api/crypto/establish-session', (req, res) => {
  const { encryptedAESKey, keyId } = req.body;
  
  if (!encryptedAESKey || !keyId) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  
  const result = E2ECrypto.establishSession(encryptedAESKey, keyId);
  res.json(result);
});

app.use('/api/init', initRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/security', securityRoutes);

// 處理未找到的路由 - 返回500而不是404
app.use('*', (_req, res) => {
  console.log(`Unauthorized access attempt to: ${_req.method} ${_req.originalUrl}`);
  res.status(500).json({ 
    error: 'Endpoint not available',
    code: 'ENDPOINT_NOT_AVAILABLE'
  });
});

app.listen(port, () => {
  console.log('=== OpenBioCard Backend Started ===');
  console.log(`✓ Backend API listening on port ${port}`);
  console.log(`✓ Health check available at: http://localhost:${port}/api/health`);
  console.log(`✓ E2E encryption active with 0.5s key rotation`);
  console.log('=====================================');
});

// 清理資源
process.on('SIGINT', () => {
  console.log('\n=== Shutting down OpenBioCard Backend ===');
  E2ECrypto.stopKeyRotation();
  console.log('✓ Encryption system stopped');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n=== Shutting down OpenBioCard Backend ===');
  E2ECrypto.stopKeyRotation();
  console.log('✓ Encryption system stopped');
  process.exit(0);
});