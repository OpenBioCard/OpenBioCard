'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initAPI } from '../api/init';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/context';
import InitializationPage from '../components/InitializationPage';
import LoginPage from '../components/LoginPage';

export default function Home() {
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { setLanguage } = useI18n();
  const router = useRouter();

  useEffect(() => {
    checkInitStatus();
  }, []);

  // Set document title based on current state
  useEffect(() => {
    if (loading || authLoading) {
      document.title = 'Loading - OpenBioCard';
    } else if (!isInitialized) {
      document.title = 'Initialization - OpenBioCard';
    } else if (!isAuthenticated) {
      document.title = 'Login - OpenBioCard';
    }
  }, [loading, authLoading, isInitialized, isAuthenticated]);

  // Redirect based on user role after authentication
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (['root', 'admin'].includes(user.role)) {
        router.push('/dashboard');
      } else {
        router.push('/user');
      }
    }
  }, [isAuthenticated, authLoading, user, router]);

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
    // Navigation will be handled by useEffect
  };

  if (loading || authLoading) {
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

  return null; // Will redirect based on user role
}
