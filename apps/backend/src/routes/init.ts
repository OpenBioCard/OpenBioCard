import { Router, Request, Response } from 'express';
import { FileManager, SystemConfig, User } from '../utils/fileManager';
import { SecurityUtils } from '../utils/security';

const router = Router();

router.get('/status', (req: Request, res: Response) => {
  try {
    const config = FileManager.readConfig();
    res.json({ 
      isInitialized: config?.isInitialized || false,
      language: config?.language || null
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check initialization status' });
  }
});

router.post('/setup', (req: Request, res: Response) => {
  try {
    const { language, username, password } = req.body;

    if (!language || !username || !password) {
      return res.status(400).json({ error: 'Language, username and password are required' });
    }

    const config = FileManager.readConfig();
    if (config?.isInitialized) {
      return res.status(400).json({ error: 'System is already initialized' });
    }

    if (username.length < 3 || password.length < 6) {
      return res.status(400).json({ 
        error: 'Username must be at least 3 characters and password at least 6 characters' 
      });
    }

    const existingUser = FileManager.findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const newConfig: SystemConfig = {
      isInitialized: true,
      language,
      createdAt: new Date().toISOString()
    };

    const rootUser: User = {
      id: SecurityUtils.generateId(),
      username,
      password: SecurityUtils.hashPassword(password),
      role: 'root',
      createdAt: new Date().toISOString()
    };

    FileManager.writeConfig(newConfig);
    FileManager.addUser(rootUser);

    res.json({ 
      success: true, 
      message: 'System initialized successfully',
      language: newConfig.language
    });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ error: 'Failed to initialize system' });
  }
});

export default router;