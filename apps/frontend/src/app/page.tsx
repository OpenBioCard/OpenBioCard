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
  const { isAuthenticated } = useAuth();
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

  return (
    <DashboardLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderDashboardContent()}
    </DashboardLayout>
  );
}
