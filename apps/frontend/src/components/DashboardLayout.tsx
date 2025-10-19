'use client';

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../i18n/context';
import { languages } from '../i18n/translations';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function DashboardLayout({ children, currentPage, onPageChange }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useI18n();

  const menuItems = [
    { id: 'overview', label: t('dashboardOverview'), icon: '📊' },
    { id: 'users', label: t('userManagement'), icon: '👥' },
    { id: 'system', label: t('systemStatus'), icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen glass-background">
      {/* Top Navigation */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center">
                <span className="text-lg">💎</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                OpenBioCard {t('adminPanel')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="glass-input px-3 py-1 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-white dark:bg-gray-800">
                    {lang.name}
                  </option>
                ))}
              </select>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="glass-button p-2 rounded-lg text-gray-600 dark:text-gray-300"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="glass-card px-3 py-1 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user?.username}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="glass-button p-2 rounded-lg text-red-500 hover:text-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 glass-sidebar min-h-[calc(100vh-4rem)]">
          <nav className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'glass-card text-blue-600 dark:text-blue-400'
                      : 'glass-button text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}