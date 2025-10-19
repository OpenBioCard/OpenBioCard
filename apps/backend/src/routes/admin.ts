import { Router, Response } from 'express';
import { FileManager, User } from '../utils/fileManager';
import { SecurityUtils } from '../utils/security';
import { authMiddleware, requireRole, AuthenticatedRequest } from '../middleware/auth';
import os from 'os';
import fs from 'fs';
import path from 'path';

const router = Router();

router.use(authMiddleware);
router.use(requireRole('root'));

router.get('/users', (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = FileManager.getSafeUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/users', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password and role are required' });
    }

    if (username.length < 3 || password.length < 6) {
      return res.status(400).json({ 
        error: 'Username must be at least 3 characters and password at least 6 characters' 
      });
    }

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin or user' });
    }

    const existingUser = FileManager.findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const newUser: User = {
      id: SecurityUtils.generateId(),
      username,
      password: SecurityUtils.hashPassword(password),
      role: role as 'admin' | 'user',
      createdAt: new Date().toISOString()
    };

    FileManager.addUser(newUser);

    res.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.get('/status', (req: AuthenticatedRequest, res: Response) => {
  try {
    const config = FileManager.readConfig();
    const systemStats = FileManager.getSystemStats();
    
    const packageJsonPath = path.join(__dirname, '../../../package.json');
    let version = 'Unknown';
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      version = packageJson.version;
    } catch (error) {
      console.warn('Could not read version from package.json');
    }

    const systemInfo = {
      version,
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      uptime: Math.floor(process.uptime()),
      memoryUsage: process.memoryUsage(),
      cpuCount: os.cpus().length,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      hostname: os.hostname()
    };

    res.json({
      config: {
        isInitialized: config?.isInitialized || false,
        language: config?.language || null,
        createdAt: config?.createdAt || null
      },
      users: {
        total: systemStats.totalUsers,
        byRole: systemStats.usersByRole
      },
      system: systemInfo
    });
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ error: 'Failed to get system status' });
  }
});

export default router;