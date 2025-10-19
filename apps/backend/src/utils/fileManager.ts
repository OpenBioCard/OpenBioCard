import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../../data');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

export interface SystemConfig {
  isInitialized: boolean;
  language: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'root' | 'admin' | 'user';
  createdAt: string;
}

export class FileManager {
  private static validatePath(filePath: string): boolean {
    // 確保文件路徑在允許的數據目錄內
    const normalizedPath = path.resolve(filePath);
    const normalizedDataDir = path.resolve(DATA_DIR);
    
    if (!normalizedPath.startsWith(normalizedDataDir)) {
      throw new Error('Access denied: Path outside of allowed directory');
    }
    
    return true;
  }

  private static sanitizeData<T>(data: T, sensitiveFields: string[] = ['password']): Partial<T> {
    if (typeof data !== 'object' || data === null) {
      return data as Partial<T>;
    }
    
    const sanitized = { ...data };
    
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        delete (sanitized as any)[field];
      }
    }
    
    return sanitized;
  }

  static ensureDataDir(): void {
    try {
      this.validatePath(DATA_DIR);
      
      if (!fs.existsSync(DATA_DIR)) {
        console.log(`Creating data directory: ${DATA_DIR}`);
        fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
        console.log('Data directory created successfully');
      } else {
        // 確保現有目錄有正確的權限
        try {
          fs.chmodSync(DATA_DIR, 0o700);
        } catch (chmodError) {
          console.warn('Could not set directory permissions:', chmodError);
        }
        console.log('Data directory already exists');
      }
      
      // 驗證目錄可訪問性
      fs.accessSync(DATA_DIR, fs.constants.R_OK | fs.constants.W_OK);
      console.log('Data directory access verified');
      
    } catch (error) {
      console.error('Error with data directory:', error);
      throw new Error(`Failed to initialize data directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static readConfig(): SystemConfig | null {
    try {
      this.validatePath(CONFIG_FILE);
      if (!fs.existsSync(CONFIG_FILE)) {
        return null;
      }
      const data = fs.readFileSync(CONFIG_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading config:', error);
      return null;
    }
  }

  static writeConfig(config: SystemConfig): void {
    this.ensureDataDir();
    try {
      this.validatePath(CONFIG_FILE);
      
      // 驗證配置數據
      if (!config.isInitialized || !config.language || !config.createdAt) {
        throw new Error('Invalid configuration data');
      }

      // 額外安全檢查：如果系統已經初始化，拒絕覆蓋
      const existingConfig = this.readConfig();
      if (existingConfig?.isInitialized && config.isInitialized) {
        console.error('🚨 CRITICAL SECURITY ALERT: Attempt to overwrite initialized config!', {
          existingConfig,
          newConfig: config,
          timestamp: new Date().toISOString()
        });
        throw new Error('Cannot overwrite initialized system configuration');
      }
      
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), { mode: 0o600 });
      console.log('✅ Configuration written successfully:', { isInitialized: config.isInitialized, language: config.language });
    } catch (error) {
      console.error('Error writing config:', error);
      throw error;
    }
  }

  /**
   * 強制寫入配置 - 僅用於系統完整性修復
   * 警告：此方法繞過正常的安全檢查，只應在系統完整性修復時使用
   */
  static forceWriteConfig(config: SystemConfig): void {
    this.ensureDataDir();
    try {
      this.validatePath(CONFIG_FILE);
      
      console.warn('⚠️ Force writing configuration (integrity repair):', config);
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), { mode: 0o600 });
      console.log('✅ Configuration force-written for integrity repair');
    } catch (error) {
      console.error('Error force-writing config:', error);
      throw error;
    }
  }

  static readUsers(): User[] {
    try {
      this.validatePath(USERS_FILE);
      if (!fs.existsSync(USERS_FILE)) {
        return [];
      }
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading users:', error);
      return [];
    }
  }

  static writeUsers(users: User[]): void {
    this.ensureDataDir();
    try {
      this.validatePath(USERS_FILE);
      
      // 驗證用戶數據
      for (const user of users) {
        if (!user.id || !user.username || !user.password || !user.role || !user.createdAt) {
          throw new Error('Invalid user data');
        }
      }
      
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), { mode: 0o600 });
    } catch (error) {
      console.error('Error writing users:', error);
      throw error;
    }
  }

  static addUser(user: User): void {
    const users = this.readUsers();
    
    // 檢查用戶名是否已存在
    if (users.some(existingUser => existingUser.username === user.username)) {
      throw new Error('Username already exists');
    }
    
    users.push(user);
    this.writeUsers(users);
  }

  static getUsers(): User[] {
    return this.readUsers();
  }

  static saveUsers(users: User[]): void {
    this.writeUsers(users);
  }

  static findUserByUsername(username: string): User | null {
    const users = this.readUsers();
    return users.find(user => user.username === username) || null;
  }

  // 安全的用戶數據獲取（不包含敏感信息）
  static getSafeUsers(): Partial<User>[] {
    const users = this.readUsers();
    return users.map(user => this.sanitizeData(user, ['password']));
  }

  // 獲取安全的系統統計信息
  static getSystemStats(): { totalUsers: number; usersByRole: Record<string, number> } {
    const users = this.readUsers();
    const usersByRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalUsers: users.length,
      usersByRole
    };
  }
}