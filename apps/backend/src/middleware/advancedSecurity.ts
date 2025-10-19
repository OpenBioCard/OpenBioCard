import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

export const securityHeadersMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:3000", "http://localhost:3001"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: parseInt(process.env.SECURITY_HSTS_MAX_AGE || '31536000'), // 默認1年
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: false,
  referrerPolicy: { policy: "no-referrer" },
  xssFilter: true,
});

export const advancedRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '60000'), // 1分鐘
  max: parseInt(process.env.RATE_LIMIT_MAX || '10000'), // 大幅增加到10000次請求
  message: {
    error: 'Too many requests',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // 跳過健康檢查和開發環境
    return req.path === '/api/health' || process.env.NODE_ENV === 'development';
  },
  keyGenerator: (req) => {
    // 使用IP + User-Agent的組合來生成key
    return `${req.ip}-${req.get('User-Agent')?.substring(0, 50) || 'unknown'}`;
  }
});

export const slowDownMiddleware = slowDown({
  windowMs: 5 * 60 * 1000, // 5分鐘
  delayAfter: 5000, // 5000次請求後開始延遲（大幅增加）
  delayMs: () => 100, // 每次增加100ms延遲（減少延遲）
  maxDelayMs: 2000, // 最大延遲2秒（減少最大延遲）
  skip: (req) => req.path === '/api/health' || process.env.NODE_ENV === 'development'
});

export const requestSizeLimit = (req: Request, res: Response, next: NextFunction) => {
  const contentLength = parseInt(req.get('Content-Length') || '0');
  const maxSize = 1024 * 1024; // 1MB限制
  
  if (contentLength > maxSize) {
    return res.status(413).json({
      error: 'Request entity too large',
      code: 'PAYLOAD_TOO_LARGE',
      limit: '1MB'
    });
  }
  
  next();
};

export const ipWhitelistMiddleware = (whitelist: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (whitelist.length === 0) {
      return next();
    }
    
    const clientIP = req.ip || req.connection.remoteAddress || '';
    
    if (!whitelist.includes(clientIP)) {
      console.warn(`🚨 IP not in whitelist: ${clientIP}`);
      return res.status(403).json({
        error: 'Access denied',
        code: 'IP_NOT_WHITELISTED'
      });
    }
    
    next();
  };
};

export const requestValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 跳過加密端點的嚴格驗證
  if (req.path.startsWith('/api/crypto/')) {
    return next();
  }
  
  // 驗證請求頭
  const userAgent = req.get('User-Agent');
  if (!userAgent || userAgent.length < 5) {
    return res.status(400).json({
      error: 'Invalid request headers',
      code: 'INVALID_HEADERS'
    });
  }
  
  // 檢查可疑的請求模式
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /script/i
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
    console.warn(`🚨 Suspicious User-Agent detected: ${userAgent}`);
    return res.status(403).json({
      error: 'Access denied',
      code: 'SUSPICIOUS_CLIENT'
    });
  }
  
  next();
};

export const honeypotMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 蜜罐端點 - 如果有人訪問這些端點，記錄並阻止
  const honeypotPaths = [
    '/admin',
    '/administrator', 
    '/wp-admin',
    '/phpmyadmin',
    '/.env',
    '/config',
    '/backup',
    '/test',
    '/debug'
  ];
  
  if (honeypotPaths.some(path => req.path.startsWith(path))) {
    console.error(`🍯 HONEYPOT TRIGGERED: ${req.ip} attempted to access ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      timestamp: new Date().toISOString()
    });
    
    // 延遲回應以浪費攻擊者時間
    setTimeout(() => {
      res.status(404).json({ error: 'Not Found' });
    }, Math.random() * 5000 + 2000); // 2-7秒延遲
    
    return;
  }
  
  next();
};