import { Router, Response } from 'express';
import { FileManager, User } from '../utils/fileManager';
import { SecurityUtils } from '../utils/security';
import { authMiddleware, requireRole, requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import os from 'os';
import fs from 'fs';
import path from 'path';

const router = Router();

router.use(authMiddleware);

// 獲取用戶列表 - admin和root都可以訪問
router.get('/users', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = FileManager.getSafeUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// 創建用戶 - 只有root可以創建
router.post('/users', requireRole('root'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, password, role } = req.body;
    const currentUser = req.user;

    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password and role are required' });
    }

    if (username.length < 3 || password.length < 8) {
      return res.status(400).json({ 
        error: 'Username must be at least 3 characters and password at least 8 characters' 
      });
    }

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin or user' });
    }

    // 再次驗證當前用戶是否仍為root（雙重檢查）
    const users = FileManager.getUsers();
    const authUser = users.find((user: User) => user.id === currentUser?.id);
    if (!authUser || authUser.role !== 'root') {
      return res.status(403).json({ error: 'Access denied. Root privileges required.' });
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

    console.log(`User ${newUser.username} (${newUser.role}) created by ${authUser.username}`);

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

// 刪除用戶 - 只有root可以刪除
router.delete('/users/:id', requireRole('root'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;
    
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // 再次驗證當前用戶是否仍為root（雙重檢查）
    const users = FileManager.getUsers();
    const authUser = users.find((user: User) => user.id === currentUser?.id);
    if (!authUser || authUser.role !== 'root') {
      return res.status(403).json({ error: 'Access denied. Root privileges required.' });
    }

    // 查找要刪除的用戶
    const targetUser = users.find((user: User) => user.id === id);
    
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 防止用戶刪除自己
    if (targetUser.id === currentUser?.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // 防止刪除最後一個root用戶
    const rootUsers = users.filter((user: User) => user.role === 'root');
    if (targetUser.role === 'root' && rootUsers.length === 1) {
      return res.status(400).json({ error: 'Cannot delete the last root user' });
    }

    // 刪除用戶
    const updatedUsers = users.filter((user: User) => user.id !== id);
    FileManager.saveUsers(updatedUsers);

    // 刪除用戶的個人資料文件
    try {
      FileManager.deleteUserProfile(targetUser.username);
    } catch (profileError) {
      console.warn(`Failed to delete profile for user ${targetUser.username}:`, profileError);
    }

    console.log(`User ${targetUser.username} (${targetUser.role}) deleted by ${authUser.username}`);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// 獲取系統狀態 - admin和root都可以訪問
router.get('/status', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
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