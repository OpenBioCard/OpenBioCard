import { Request, Response, NextFunction } from 'express';
import { SecurityUtils } from '../utils/security';
import { FileManager } from '../utils/fileManager';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const decoded = SecurityUtils.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token.' });
  }

  // 驗證用戶是否仍然存在於數據庫中
  try {
    const users = FileManager.getUsers();
    const currentUser = users.find(user => user.id === decoded.id);
    
    if (!currentUser) {
      return res.status(401).json({ error: 'User not found. Please login again.' });
    }

    // 驗證token中的角色是否與數據庫記錄一致
    if (currentUser.role !== decoded.role) {
      return res.status(401).json({ error: 'User permissions have changed. Please login again.' });
    }

    // 驗證用戶名是否一致（額外安全檢查）
    if (currentUser.username !== decoded.username) {
      return res.status(401).json({ error: 'User data mismatch. Please login again.' });
    }

    // 使用數據庫中的最新用戶信息
    req.user = {
      id: currentUser.id,
      username: currentUser.username,
      role: currentUser.role
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication verification failed.' });
  }
};

export const requireRole = (role: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

export const requireRoles = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

export const requireAdmin = requireRoles(['root', 'admin']);