import { Request, Response, NextFunction } from 'express';
import { FileManager } from '../utils/fileManager';
import { SecurityUtils } from '../utils/security';

export const accessControlMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const path = req.path;
  const method = req.method;

  try {
    // 總是允許健康檢查
    if (path === '/api/health') {
      return next();
    }

    // 檢查系統是否已初始化
    const config = FileManager.readConfig();
    const isInitialized = config?.isInitialized || false;

    // 如果系統已初始化，完全禁用初始化接口
    if (isInitialized && path.startsWith('/api/init/setup')) {
      console.warn('🚨 SECURITY ALERT: Attempt to access disabled initialization endpoint!', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: path,
        method: method,
        timestamp: new Date().toISOString()
      });
      
      return res.status(500).json({ 
        error: 'Endpoint not available',
        code: 'ENDPOINT_NOT_AVAILABLE'
      });
    }

    // 如果系統未初始化，只允許訪問初始化相關接口和加密接口
    if (!isInitialized) {
      if (path.startsWith('/api/init') || path.startsWith('/api/crypto')) {
        return next();
      }
      
      // 其他所有接口都返回500
      return res.status(500).json({ 
        error: 'System not initialized',
        code: 'SYSTEM_NOT_INITIALIZED'
      });
    }

    // 系統已初始化，檢查認證狀態
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // 如果沒有token，只允許訪問登錄接口和初始化狀態檢查
    if (!token) {
      if (path.startsWith('/api/auth') || path === '/api/init/status' || path.startsWith('/api/crypto')) {
        return next();
      }
      
      console.warn('🚨 SECURITY ALERT: Invalid or missing client token', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: path,
        timestamp: new Date().toISOString()
      });
      
      // 其他所有接口都返回500
      return res.status(500).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // 如果有token，驗證token有效性
    const decoded = SecurityUtils.verifyToken(token);
    if (!decoded) {
      if (path.startsWith('/api/auth') || path === '/api/init/status') {
        return next();
      }
      
      // 無效token，其他接口返回500
      return res.status(500).json({ 
        error: 'Invalid authentication',
        code: 'AUTH_INVALID'
      });
    }

    // 驗證用戶是否仍然存在
    const users = FileManager.getUsers();
    const currentUser = users.find(user => user.id === decoded.id);
    
    if (!currentUser) {
      if (path.startsWith('/api/auth') || path === '/api/init/status') {
        return next();
      }
      
      // 用戶不存在，其他接口返回500
      return res.status(500).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // 驗證用戶權限是否匹配
    if (currentUser.role !== decoded.role || currentUser.username !== decoded.username) {
      if (path.startsWith('/api/auth') || path === '/api/init/status') {
        return next();
      }
      
      // 用戶信息不匹配，其他接口返回500
      return res.status(500).json({ 
        error: 'User data mismatch',
        code: 'USER_DATA_MISMATCH'
      });
    }

    // 所有驗證通過，允許訪問
    next();

  } catch (error) {
    console.error('Access control error:', error);
    
    // 檢查系統初始化狀態來決定允許的接口
    let isInitialized = false;
    try {
      const config = FileManager.readConfig();
      isInitialized = config?.isInitialized || false;
    } catch {
      // 如果無法讀取配置，假設未初始化
      isInitialized = false;
    }
    
    // 發生錯誤時，只允許訪問基本接口
    if (path.startsWith('/api/auth') || path === '/api/health' || 
        (path === '/api/init/status') || (!isInitialized && path.startsWith('/api/init'))) {
      return next();
    }
    
    return res.status(500).json({ 
      error: 'Access control failed',
      code: 'ACCESS_CONTROL_ERROR'
    });
  }
};