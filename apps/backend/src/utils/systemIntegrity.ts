import { FileManager } from './fileManager';

export class SystemIntegrity {
  /**
   * 檢查系統初始化狀態的完整性
   * 確保配置和用戶數據一致
   */
  static checkInitializationIntegrity(): {
    isValid: boolean;
    issues: string[];
    autoFixed: boolean;
  } {
    const issues: string[] = [];
    let autoFixed = false;

    try {
      const config = FileManager.readConfig();
      const users = FileManager.getUsers();
      const rootUsers = users.filter(user => user.role === 'root');

      // 檢查1: 如果配置說已初始化，必須有root用戶
      if (config?.isInitialized && rootUsers.length === 0) {
        issues.push('System marked as initialized but no root user found');
        return { isValid: false, issues, autoFixed };
      }

      // 檢查2: 如果有root用戶，但配置說未初始化，自動修復
      if ((!config?.isInitialized) && rootUsers.length > 0) {
        issues.push('Root user exists but system marked as uninitialized - auto-fixing');
        
        try {
          const fixedConfig = {
            isInitialized: true,
            language: 'en', // 默認語言
            createdAt: new Date().toISOString()
          };
          
          // 使用特殊方法繞過writeConfig的保護來修復狀態
          FileManager.forceWriteConfig(fixedConfig);
          autoFixed = true;
        } catch (error) {
          issues.push(`Failed to auto-fix configuration: ${error}`);
          return { isValid: false, issues, autoFixed };
        }
      }

      // 檢查3: 多個root用戶檢查
      if (rootUsers.length > 1) {
        issues.push(`Multiple root users detected: ${rootUsers.length}`);
        // 這個不算致命錯誤，但需要記錄
      }

      return { 
        isValid: issues.length === 0 || autoFixed, 
        issues, 
        autoFixed 
      };

    } catch (error) {
      issues.push(`Integrity check failed: ${error}`);
      return { isValid: false, issues, autoFixed };
    }
  }

  /**
   * 記錄安全事件
   */
  static logSecurityEvent(event: string, details: any) {
    const timestamp = new Date().toISOString();
    console.log(`🔒 SECURITY EVENT [${timestamp}]: ${event}`, details);
    
    // 在生產環境中，這裡應該寫入安全審計日誌文件
    // 或者發送到安全監控系統
  }
}