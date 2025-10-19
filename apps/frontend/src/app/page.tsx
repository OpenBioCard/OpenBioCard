'use client';

import React, { useState, useEffect } from 'react';
import { initAPI } from '../api/init';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/context';
import InitializationPage from '../components/InitializationPage';
import LoginPage from '../components/LoginPage';
import DashboardLayout from '../components/DashboardLayout';
import DashboardOverview from '../components/DashboardOverview';
import UserManagement from '../components/UserManagement';
import SystemStatusPage from '../components/SystemStatusPage';

export default function Home() {
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('overview');
  const { isAuthenticated, user } = useAuth();
  const { setLanguage } = useI18n();

  useEffect(() => {
    checkInitStatus();
  }, []);

  const checkInitStatus = async () => {
    try {
      const status = await initAPI.checkStatus();
      setIsInitialized(status.isInitialized);
      
      // 如果系統已初始化且有語言設置，就設置語言
      if (status.isInitialized && status.language) {
        setLanguage(status.language as any);
      }
    } catch (error) {
      console.error('Failed to check init status:', error);
      setIsInitialized(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInitComplete = () => {
    setIsInitialized(true);
  };

  const handleLoginSuccess = () => {
    setCurrentPage('overview');
  };

  const renderDashboardContent = () => {
    switch (currentPage) {
      case 'users':
        return <UserManagement />;
      case 'system':
        return <SystemStatusPage />;
      default:
        return <DashboardOverview />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return <InitializationPage onComplete={handleInitComplete} />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 檢查用戶權限
  if (!user || !['root', 'admin'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">訪問被拒絕</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            您沒有權限訪問管理面板。只有管理員和根用戶可以訪問此頁面。
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="glass-button px-4 py-2 rounded-lg text-blue-600 hover:text-blue-700"
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderDashboardContent()}
    </DashboardLayout>
  );
}
