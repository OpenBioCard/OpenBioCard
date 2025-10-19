import { Request, Response, NextFunction } from 'express';
import path from 'path';

const PROTECTED_PATHS = [
  '/data',
  '/config',
  '/.env',
  '/package.json',
  '/tsconfig.json',
  '/node_modules'
];

const PROTECTED_EXTENSIONS = [
  '.json',
  '.env',
  '.config',
  '.key',
  '.pem',
  '.crt',
  '.log'
];

export const securityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestPath = req.path.toLowerCase();
  
  // 檢查是否嘗試訪問受保護的路徑
  for (const protectedPath of PROTECTED_PATHS) {
    if (requestPath.includes(protectedPath.toLowerCase())) {
      return res.status(403).json({ 
        error: 'Access denied. Protected resource.' 
      });
    }
  }
  
  // 檢查是否嘗試訪問受保護的文件擴展名
  for (const ext of PROTECTED_EXTENSIONS) {
    if (requestPath.endsWith(ext)) {
      return res.status(403).json({ 
        error: 'Access denied. File type not allowed.' 
      });
    }
  }
  
  // 檢查路徑遍歷攻擊
  if (requestPath.includes('..') || requestPath.includes('~')) {
    return res.status(403).json({ 
      error: 'Access denied. Invalid path.' 
    });
  }
  
  // 防止直接訪問系統文件
  const systemPaths = ['/etc', '/usr', '/var', '/root', '/home', '/opt', '/tmp'];
  for (const sysPath of systemPaths) {
    if (requestPath.startsWith(sysPath)) {
      return res.status(403).json({ 
        error: 'Access denied. System path access forbidden.' 
      });
    }
  }
  
  next();
};

export const apiRateLimiter = (windowMs: number = 5 * 60 * 1000, max: number = 5000) => {
  const requests = new Map();
  
  return (req: Request, res: Response, next: NextFunction) => {
    // 在開發環境跳過速率限制
    if (process.env.NODE_ENV === 'development') {
      return next();
    }
    
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests.has(clientIP)) {
      requests.set(clientIP, []);
    }
    
    const clientRequests = requests.get(clientIP);
    
    // 清理過期的請求記錄
    const validRequests = clientRequests.filter((timestamp: number) => timestamp > windowStart);
    requests.set(clientIP, validRequests);
    
    if (validRequests.length >= max) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    validRequests.push(now);
    next();
  };
};