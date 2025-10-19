'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    if (isLanguageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen]);

  const menuItems = [
    { id: 'overview', label: t('dashboardOverview'), icon: '📊' },
    { id: 'users', label: t('userManagement'), icon: '👥' },
    { id: 'system', label: t('systemStatus'), icon: '⚙️' }
  ];

  const currentLanguageInfo = languages.find(lang => lang.code === language);

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode as any);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <div className="min-h-screen glass-background">
      {/* Top Navigation */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl glass-card flex items-center justify-center p-1 transition-all duration-200 hover:scale-110 hover:rotate-6">
                <img src="/logo.svg" alt="OpenBioCard Logo" className="w-full h-full" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                OpenBioCard {t('adminPanel')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="glass-button px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2 min-w-[100px] rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <span>{currentLanguageInfo?.name || 'Language'}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isLanguageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-card rounded-2xl shadow-lg z-50 border border-gray-200 dark:border-gray-600 overflow-hidden">
                    <div className="py-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageSelect(lang.code)}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02] hover:px-5 ${
                            language === lang.code
                              ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{lang.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{lang.code}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="glass-button p-2 rounded-xl text-gray-600 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95 hover:rotate-12"
              >
                {theme === 'dark' ? (
                  // Sun icon for light mode
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  // Moon icon for dark mode
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="glass-card px-3 py-2 rounded-xl transition-all duration-200 hover:scale-105">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user?.username}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="glass-button p-2 rounded-xl text-red-500 hover:text-red-600 transition-all duration-200 hover:scale-110 active:scale-95 hover:rotate-12"
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