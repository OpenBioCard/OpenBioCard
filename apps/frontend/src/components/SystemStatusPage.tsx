'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, SystemStatus } from '../api/client';
import { useI18n } from '../i18n/context';
import { useToast } from './Toast';

export default function SystemStatusPage() {
  const { t } = useI18n();
  const { showSuccess, showError } = useToast();
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSystemStatus();
    const interval = setInterval(loadSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSystemStatus = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getSystemStatus();
      setStatus(response);
      setError('');
      if (!loading) {
        showSuccess('System status refreshed successfully');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load system status';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}${t('days')} ${hours}${t('hours')} ${minutes}${t('minutes')}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading && !status) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-1">載入失敗</h3>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
          <button
            onClick={loadSystemStatus}
            className="glass-button px-4 py-2 rounded-lg text-red-600 dark:text-red-400"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  if (!status) return null;

  const memoryUsagePercentage = Math.round((status.system.memoryUsage.heapUsed / status.system.memoryUsage.heapTotal) * 100);
  const systemMemoryUsagePercentage = Math.round(((status.system.totalMemory - status.system.freeMemory) / status.system.totalMemory) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('systemStatus')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">系統運行狀態監控</p>
        </div>
        <button
          onClick={loadSystemStatus}
          disabled={loading}
          className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{loading ? t('refreshing') : t('refresh')}</span>
        </button>
      </div>

      {error && (
        <div className="glass-card p-4 bg-yellow-50/50 dark:bg-yellow-900/20">
          <p className="text-yellow-700 dark:text-yellow-400 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* System Information */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('systemInfo')}</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('version')}</span>
              <span className="font-mono text-sm">{status.system.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('platform')}</span>
              <span className="text-sm">{status.system.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Node.js</span>
              <span className="font-mono text-sm">{status.system.nodeVersion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('uptime')}</span>
              <span className="text-sm">{formatUptime(status.system.uptime)}</span>
            </div>
          </div>
        </div>

        {/* Memory Information */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('memoryInfo')}</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('totalMemory')}</span>
              <span className="text-sm">{formatBytes(status.system.totalMemory)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('freeMemory')}</span>
              <span className="text-sm">{formatBytes(status.system.freeMemory)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('heapUsed')}</span>
              <span className="text-sm">{formatBytes(status.system.memoryUsage.heapUsed)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('cpuCores')}</span>
              <span className="text-sm">{status.system.cpuCount}</span>
            </div>
          </div>
        </div>

        {/* Application Status */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('applicationStatus')}</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">{t('initStatus')}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                status.config.isInitialized 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
              }`}>
                {status.config.isInitialized ? t('initialized') : t('notInitialized')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('systemLanguage')}</span>
              <span className="text-sm">{status.config.language || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('totalUsers')}</span>
              <span className="text-sm">{status.users.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">{t('systemPerformance')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {memoryUsagePercentage}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('heapMemoryUsage')}</div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${memoryUsagePercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              {systemMemoryUsagePercentage}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('systemMemoryUsage')}</div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${systemMemoryUsagePercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-2">
              {formatUptime(status.system.uptime)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('systemUptime')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}