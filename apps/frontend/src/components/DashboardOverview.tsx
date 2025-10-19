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
    const interval = setInterval(checkSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001' + '/api/health');
      const apiServiceHealthy = response.ok;
      
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

  const isSystemStable = systemHealth?.apiService && systemHealth?.database;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('welcomeBack')}, {user?.username}！
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t('systemOverview')}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* System Health */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('systemHealth')}</h3>
            {loading && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="glass-button p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    loading ? 'bg-gray-400' : systemHealth?.apiService ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium">{t('apiService')}</span>
                </div>
                <span className={`text-sm ${
                  loading ? 'text-gray-500' : 
                  systemHealth?.apiService ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {loading ? t('checking') : systemHealth?.apiService ? t('normal') : t('abnormal')}
                </span>
              </div>
            </div>

            <div className="glass-button p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    loading ? 'bg-gray-400' : systemHealth?.database ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium">{t('database')}</span>
                </div>
                <span className={`text-sm ${
                  loading ? 'text-gray-500' : 
                  systemHealth?.database ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {loading ? t('checking') : systemHealth?.database ? t('normal') : t('abnormal')}
                </span>
              </div>
            </div>
          </div>

          {/* Overall Status */}
          <div className={`glass-card p-4 rounded-lg ${
            loading ? 'bg-gray-50/50 dark:bg-gray-800/50' : 
            isSystemStable ? 'bg-green-50/50 dark:bg-green-900/20' : 'bg-red-50/50 dark:bg-red-900/20'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg">
                  {loading ? '⏳' : isSystemStable ? '✅' : '⚠️'}
                </span>
                <span className="font-medium">
                  {loading ? t('checkingSystemStatus') : isSystemStable ? t('stable') : t('systemAbnormal')}
                </span>
              </div>
              <button
                onClick={checkSystemHealth}
                disabled={loading}
                className="glass-button px-3 py-1 rounded text-sm disabled:opacity-50"
              >
                {loading ? t('checking') : t('recheckHealth')}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}