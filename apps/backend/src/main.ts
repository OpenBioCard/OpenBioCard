import express from 'express';
import cors from 'cors';
import initRoutes from './routes/init';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import { securityMiddleware, apiRateLimiter } from './middleware/security';

const app = express();
const port = process.env.PORT || 3001;

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
  console.log(`Backend API listening on port ${port}`);
});