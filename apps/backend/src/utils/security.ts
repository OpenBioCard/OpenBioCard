import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'openbiocards-secret-key';

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
}