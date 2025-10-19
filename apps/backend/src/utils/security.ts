import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 從環境變量獲取，如果沒有則使用固定的默認值（僅用於開發）
const JWT_SECRET = process.env.JWT_SECRET || 'openbiocards-dev-secret-key-change-in-production';

export class SecurityUtils {
  static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  static verifyPassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  static generateId(): string {
    return crypto.randomUUID();
  }

  static generateToken(payload: any): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // 獲取當前使用的密鑰指紋（用於調試）
  static getKeyFingerprint(): string {
    return crypto.createHash('sha256').update(JWT_SECRET).digest('hex').substring(0, 8);
  }
}