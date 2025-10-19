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

    // 首先檢查系統是否已經初始化
    const config = FileManager.readConfig();
    if (config?.isInitialized) {
      console.warn('⚠️ SECURITY ALERT: Attempt to re-initialize system!', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
        attemptedUsername: username
      });
      
      return res.status(403).json({ 
        error: 'System initialization is permanently disabled',
        code: 'INIT_DISABLED'
      });
    }

    // 雙重檢查：確保沒有任何用戶存在（特別是root用戶）
    const existingUsers = FileManager.getUsers();
    const rootUsers = existingUsers.filter(user => user.role === 'root');
    
    if (rootUsers.length > 0) {
      console.error('🚨 CRITICAL SECURITY ALERT: Root user exists but system marked as uninitialized!', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
        existingRootUsers: rootUsers.map(u => ({ id: u.id, username: u.username }))
      });
      
      // 這種情況可能表示數據被篡改，立即拒絕並修復狀態
      const fixedConfig: SystemConfig = {
        isInitialized: true,
        language: 'zh-TW', // 默認語言
        createdAt: new Date().toISOString()
      };
      FileManager.writeConfig(fixedConfig);
      
      return res.status(403).json({ 
        error: 'System initialization is permanently disabled',
        code: 'INIT_DISABLED'
      });
    }

    if (!language || !username || !password) {
      return res.status(400).json({ error: 'Language, username and password are required' });
    }

    if (username.length < 3 || password.length < 8) {
      return res.status(400).json({ 
        error: 'Username must be at least 3 characters and password at least 8 characters' 
      });
    }

    // 檢查用戶名是否已存在（額外安全檢查）
    const existingUser = FileManager.findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    console.log('🚀 Initializing system with root user:', username);

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

    // 原子性操作：先寫入用戶，再標記為已初始化
    FileManager.addUser(rootUser);
    FileManager.writeConfig(newConfig);

    console.log('✅ System initialization completed successfully');
    console.log(`✅ Root user '${username}' created with ID: ${rootUser.id}`);

    res.json({ 
      success: true, 
      message: 'System initialized successfully',
      language: newConfig.language
    });
  } catch (error) {
    console.error('❌ Setup error:', error);
    res.status(500).json({ error: 'Failed to initialize system' });
  }
});

export default router;