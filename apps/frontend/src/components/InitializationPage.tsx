'use client';

import React, { useState } from 'react';
import { useI18n } from '../i18n/context';
import { Language, languages } from '../i18n/translations';
import { initAPI } from '../api/init';

interface InitializationPageProps {
  onComplete: () => void;
}

export default function InitializationPage({ onComplete }: InitializationPageProps) {
  const { language, setLanguage, t } = useI18n();
  const [step, setStep] = useState<'language' | 'account'>('language');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setStep('account');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError(t('usernameRequired'));
      return false;
    }
    if (!formData.password.trim()) {
      setError(t('passwordRequired'));
      return false;
    }
    if (formData.username.length < 3) {
      setError(t('usernameMinLength'));
      return false;
    }
    if (formData.password.length < 6) {
      setError(t('passwordMinLength'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await initAPI.setup({
        language,
        username: formData.username,
        password: formData.password
      });
      
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('initFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (step === 'language') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">OpenBioCard</h1>
            <p className="text-gray-600">{t('selectLanguage')}</p>
          </div>
          
          <div className="space-y-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors flex items-center justify-between"
              >
                <span className="font-medium text-gray-900">{lang.name}</span>
                <span className="text-gray-500 text-sm">{lang.code}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600 mb-1">{t('welcome')}</p>
          <p className="text-gray-500 text-sm">{t('description')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('adminAccount')}</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('username')}
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder={t('usernamePlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('password')}
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder={t('passwordPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep('language')}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              {t('language')}
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? t('initializing') : t('confirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}