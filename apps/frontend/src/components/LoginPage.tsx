'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/context';
import { SecureForm, SecureInput } from './SecureForm';
import { InputSanitizer } from '../utils/inputSanitizer';
import { useSecureApiClient } from '../api/secureClient';
import { apiClient as regularApiClient } from '../api/client';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const { login } = useAuth();
  const { t } = useI18n();
  const apiClient = useSecureApiClient();
  const [formValid, setFormValid] = useState({
    username: true,
    password: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSecureSubmit = async (data: any, isValid: boolean) => {
    if (!isValid) {
      setError('Invalid input detected');
      return;
    }

    if (!data.username?.trim() || !data.password?.trim()) {
      setError(t('usernameRequired'));
      return;
    }

    // 額外的密碼驗證
    const passwordValidation = InputSanitizer.validatePassword(data.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiClient.login(data);
      
      if (response.success && response.data) {
        // Set token in both AuthContext and regular apiClient
        login(response.data.user, response.data.token);
        // Set token in the regular API client for subsequent requests
        regularApiClient.setToken(response.data.token);
        onLoginSuccess();
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (_value: string, isValid: boolean) => {
    setFormValid(prev => ({ ...prev, username: isValid }));
  };

  const handlePasswordChange = (_value: string, isValid: boolean) => {
    setFormValid(prev => ({ ...prev, password: isValid }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">OpenBioCard</h1>
          <p className="text-gray-600 dark:text-gray-300">管理員登錄</p>
        </div>

        <SecureForm onSecureSubmit={handleSecureSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('username')}
            </label>
            <SecureInput
              type="text"
              id="username"
              name="username"
              sanitizeType="username"
              onSecureChange={handleUsernameChange}
              placeholder={t('usernamePlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={loading}
              maxLength={32}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('password')}
            </label>
            <SecureInput
              type="password"
              id="password"
              name="password"
              onSecureChange={handlePasswordChange}
              placeholder={t('passwordPlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={loading}
              maxLength={128}
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !formValid.username || !formValid.password}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {loading ? t('validating') : '登錄'}
          </button>
        </SecureForm>
      </div>
    </div>
  );
}