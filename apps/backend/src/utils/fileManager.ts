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
  static ensureDataDir(): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  static readConfig(): SystemConfig | null {
    try {
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
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    } catch (error) {
      console.error('Error writing config:', error);
      throw error;
    }
  }

  static readUsers(): User[] {
    try {
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
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (error) {
      console.error('Error writing users:', error);
      throw error;
    }
  }

  static addUser(user: User): void {
    const users = this.readUsers();
    users.push(user);
    this.writeUsers(users);
  }

  static findUserByUsername(username: string): User | null {
    const users = this.readUsers();
    return users.find(user => user.username === username) || null;
  }
}