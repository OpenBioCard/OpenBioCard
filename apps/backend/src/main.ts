import express from 'express';
import cors from 'cors';
import initRoutes from './routes/init';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import { securityMiddleware, apiRateLimiter } from './middleware/security';
import { FileManager } from './utils/fileManager';

const app = express();
const port = process.env.PORT || 3001;

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

app.use(cors());
app.use(express.json());

// Apply security middleware to protect sensitive files
app.use(securityMiddleware);

// Apply rate limiting
app.use(apiRateLimiter(15 * 60 * 1000, 100)); // 100 requests per 15 minutes

app.get('/api/health', (_, res) => {
  res.json({ status: 'OK', message: 'Backend API is running' });
});

app.use('/api/init', initRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
  console.log('=== OpenBioCard Backend Started ===');
  console.log(`✓ Backend API listening on port ${port}`);
  console.log(`✓ Health check available at: http://localhost:${port}/api/health`);
  console.log('=====================================');
});