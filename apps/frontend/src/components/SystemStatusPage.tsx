'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, SystemStatus } from '../api/client';
import { useI18n } from '../i18n/context';

export default function SystemStatusPage() {
  const { t } = useI18n();
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSystemStatus();
    const interval = setInterval(loadSystemStatus, 30000); // 每30秒刷新
    return () => clearInterval(interval);
  }, []);

  const loadSystemStatus = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getSystemStatus();
      setStatus(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load system status');
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
    return `${days}天 ${hours}小時 ${minutes}分鐘`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading && !status) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={loadSystemStatus}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  if (!status) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('systemStatus')}</h2>
        <button
          onClick={loadSystemStatus}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? t('refreshing') : t('refresh')}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800">
          <p className="text-yellow-600 dark:text-yellow-400 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* System Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('systemInfo')}</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('version')}:</span>
              <span className="text-gray-900 dark:text-white font-mono">{status.system.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('platform')}:</span>
              <span className="text-gray-900 dark:text-white">{status.system.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('architecture')}:</span>
              <span className="text-gray-900 dark:text-white">{status.system.arch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Node.js:</span>
              <span className="text-gray-900 dark:text-white font-mono">{status.system.nodeVersion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('hostname')}:</span>
              <span className="text-gray-900 dark:text-white">{status.system.hostname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('uptime')}:</span>
              <span className="text-gray-900 dark:text-white">{formatUptime(status.system.uptime)}</span>
            </div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('memoryInfo')}</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('totalMemory')}:</span>
              <span className="text-gray-900 dark:text-white">{formatBytes(status.system.totalMemory)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('freeMemory')}:</span>
              <span className="text-gray-900 dark:text-white">{formatBytes(status.system.freeMemory)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('processRSS')}:</span>
              <span className="text-gray-900 dark:text-white">{formatBytes(status.system.memoryUsage.rss)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('heapTotal')}:</span>
              <span className="text-gray-900 dark:text-white">{formatBytes(status.system.memoryUsage.heapTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('heapUsed')}:</span>
              <span className="text-gray-900 dark:text-white">{formatBytes(status.system.memoryUsage.heapUsed)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('external')}:</span>
              <span className="text-gray-900 dark:text-white">{formatBytes(status.system.memoryUsage.external)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('cpuCores')}:</span>
              <span className="text-gray-900 dark:text-white">{status.system.cpuCount}</span>
            </div>
          </div>
        </div>

        {/* Application Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('applicationStatus')}</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('initStatus')}:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                status.config.isInitialized 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                {status.config.isInitialized ? t('initialized') : t('notInitialized')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('systemLanguage')}:</span>
              <span className="text-gray-900 dark:text-white">{status.config.language || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('creationTime')}:</span>
              <span className="text-gray-900 dark:text-white text-sm">{formatDate(status.config.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('totalUsers')}:</span>
              <span className="text-gray-900 dark:text-white">{status.users.total}</span>
            </div>
            {Object.entries(status.users.byRole).map(([role, count]) => (
              <div key={role} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{role} {t('user')}:</span>
                <span className="text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Memory Usage Chart Placeholder */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('systemPerformance')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round((status.system.memoryUsage.heapUsed / status.system.memoryUsage.heapTotal) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('heapMemoryUsage')}</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round(((status.system.totalMemory - status.system.freeMemory) / status.system.totalMemory) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('systemMemoryUsage')}</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatUptime(status.system.uptime)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('systemUptime')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}