'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/context';
import { apiClient } from '../api/client';

interface SystemHealth {
  apiService: boolean;
  database: boolean;
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 30000); // 每30秒檢查一次
    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    try {
      // 檢查API服務狀態
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001' + '/api/health');
      const apiServiceHealthy = response.ok;
      
      // 檢查數據庫狀態（通過嘗試獲取系統狀態）
      let databaseHealthy = false;
      try {
        await apiClient.getSystemStatus();
        databaseHealthy = true;
      } catch (error) {
        databaseHealthy = false;
      }

      setSystemHealth({
        apiService: apiServiceHealthy,
        database: databaseHealthy
      });
    } catch (error) {
      console.error('Health check failed:', error);
      setSystemHealth({
        apiService: false,
        database: false
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (isHealthy: boolean) => {
    return isHealthy ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = (isHealthy: boolean) => {
    return isHealthy ? t('normal') : t('abnormal');
  };

  const getStatusTextColor = (isHealthy: boolean) => {
    return isHealthy 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  };

  const isSystemStable = systemHealth?.apiService && systemHealth?.database;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('dashboardOverview')}</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t('welcomeBack')}, {user?.username}！{t('systemOverview')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Health */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('systemHealth')}</h3>
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              )}
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${loading ? 'bg-gray-400' : getStatusColor(systemHealth?.apiService || false)}`}></div>
                  <span className="text-sm text-gray-900 dark:text-white">{t('apiService')}</span>
                </div>
                <span className={`text-sm ${loading ? 'text-gray-500' : getStatusTextColor(systemHealth?.apiService || false)}`}>
                  {loading ? t('checking') : getStatusText(systemHealth?.apiService || false)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${loading ? 'bg-gray-400' : getStatusColor(systemHealth?.database || false)}`}></div>
                  <span className="text-sm text-gray-900 dark:text-white">{t('database')}</span>
                </div>
                <span className={`text-sm ${loading ? 'text-gray-500' : getStatusTextColor(systemHealth?.database || false)}`}>
                  {loading ? t('checking') : getStatusText(systemHealth?.database || false)}
                </span>
              </div>
            </div>
            
            <div className={`mt-6 p-4 rounded-lg ${
              loading 
                ? 'bg-gray-50 dark:bg-gray-700/20' 
                : isSystemStable 
                  ? 'bg-blue-50 dark:bg-blue-900/20' 
                  : 'bg-red-50 dark:bg-red-900/20'
            }`}>
              <div className="flex items-center space-x-2">
                <span className={
                  loading 
                    ? 'text-gray-600 dark:text-gray-400' 
                    : isSystemStable 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-red-600 dark:text-red-400'
                }>
                  {loading ? '⏳' : isSystemStable ? 'ℹ️' : '⚠️'}
                </span>
                <span className={`text-sm ${
                  loading 
                    ? 'text-gray-800 dark:text-gray-300' 
                    : isSystemStable 
                      ? 'text-blue-800 dark:text-blue-300' 
                      : 'text-red-800 dark:text-red-300'
                }`}>
                  {loading 
                    ? t('checkingSystemStatus') 
                    : isSystemStable 
                      ? t('stable') 
                      : t('systemAbnormal')
                  }
                </span>
              </div>
            </div>
            
            <div className="mt-4 text-right">
              <button
                onClick={checkSystemHealth}
                disabled={loading}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50"
              >
                {loading ? t('checking') : t('recheckHealth')}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('quickActions')}</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 text-center border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="text-2xl mb-2">👥</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{t('createUser')}</div>
              </button>
              
              <button className="p-4 text-center border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{t('viewReports')}</div>
              </button>
              
              <button className="p-4 text-center border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="text-2xl mb-2">⚙️</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{t('systemSettings')}</div>
              </button>
              
              <button className="p-4 text-center border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="text-2xl mb-2">💾</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{t('dataBackup')}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}