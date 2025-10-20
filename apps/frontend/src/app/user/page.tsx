'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n/context';
import { useToast } from '../../components/Toast';

export default function UserPage() {
  const { user, logout } = useAuth();
  const { t, language } = useI18n();
  const { showSuccess } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    showSuccess(language.startsWith('zh') ? '登出成功' : 'Logout successful');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="glass-card p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {language.startsWith('zh') ? '用戶面板' : 'User Panel'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {language.startsWith('zh') ? `歡迎回來，${user?.username}` : `Welcome back, ${user?.username}`}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="glass-button px-4 py-2 rounded-lg text-red-600 hover:text-red-700 transition-colors"
              >
                {language.startsWith('zh') ? '登出' : 'Logout'}
              </button>
            </div>
          </div>

          {/* User Information */}
          <div className="glass-card p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {language.startsWith('zh') ? '用戶信息' : 'User Information'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {language.startsWith('zh') ? '用戶名' : 'Username'}
                </label>
                <p className="text-lg text-gray-900 dark:text-white">{user?.username}</p>
              </div>
              <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {language.startsWith('zh') ? '角色' : 'Role'}
                </label>
                <p className="text-lg text-gray-900 dark:text-white capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* User Features */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {language.startsWith('zh') ? '功能' : 'Features'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {language.startsWith('zh') ? '個人資料' : 'Profile'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language.startsWith('zh') ? '管理您的個人信息' : 'Manage your personal information'}
                </p>
              </div>

              <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {language.startsWith('zh') ? '我的文件' : 'My Documents'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language.startsWith('zh') ? '查看和管理您的文件' : 'View and manage your documents'}
                </p>
              </div>

              <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {language.startsWith('zh') ? '設置' : 'Settings'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language.startsWith('zh') ? '自定義您的體驗' : 'Customize your experience'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}