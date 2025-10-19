'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    // 確保DOM已加載
    if (typeof window === 'undefined') return;
    
    const savedTheme = localStorage.getItem('theme') as Theme;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    const initialTheme = savedTheme || systemTheme;
    setThemeState(initialTheme);
    
    // 立即應用主題，而不是延遲
    applyTheme(initialTheme);
    
    // 監聽系統主題變化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    // 清理函數
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

 // 每次theme狀態變化時強制重新應用
useEffect(() => {
   if (typeof window !== 'undefined') {
     applyTheme(theme);
   }
 }, [theme]);

 const applyTheme = (newTheme: Theme) => {
   // 檢查是否在瀏覽器環境中
   if (typeof window === 'undefined' || typeof document === 'undefined') return;
   
   const root = document.documentElement;
   
   // 先移除現有的深色類，然後根據需要添加
   root.classList.remove('dark');
   if (newTheme === 'dark') {
     root.classList.add('dark');
   }
 };

  const setTheme = (newTheme: Theme) => {
    // 使用函數式更新確保狀態基於最新值
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};