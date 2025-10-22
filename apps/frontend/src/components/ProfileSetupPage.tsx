'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '../i18n/context';
import { useToast } from './Toast';
import { apiClient } from '../api/client';
import { ImageValidator } from '../utils/imageValidator';

interface ProfileSetupPageProps {
  isFirstTime?: boolean;
  onComplete?: () => void;
}

export default function ProfileSetupPage({ isFirstTime = false, onComplete }: ProfileSetupPageProps) {
  const router = useRouter();
  const { language } = useI18n();
  const { showSuccess, showError } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const isZh = language.startsWith('zh');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await apiClient.getUserProfile();
      if (response.success && response.profile) {
        const profile = response.profile;
        setDisplayName(profile.displayName || '');
        setBio(profile.bio || '');
        setAvatar(profile.avatar || '');
        setAvatarPreview(profile.avatar || '');
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleAvatarSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证图片
    const validationResult = ImageValidator.validateImageFile(file);
    if (!validationResult.valid) {
      showError(validationResult.error || (isZh ? '图片验证失败' : 'Image validation failed'));
      return;
    }

    try {
      // 显示文件大小
      const fileSize = ImageValidator.formatFileSize(file.size);
      console.log(`Selected image: ${file.name}, Size: ${fileSize}`);

      setUploadProgress(10);

      // 转换为base64
      const result = await ImageValidator.validateAndConvertImage(file);

      setUploadProgress(50);

      if (!result.success || !result.data) {
        showError(result.error || (isZh ? '图片处理失败' : 'Failed to process image'));
        setUploadProgress(0);
        return;
      }

      setAvatar(result.data);
      setAvatarPreview(result.data);
      setUploadProgress(100);

      showSuccess(isZh ? `图片已选择 (${fileSize})` : `Image selected (${fileSize})`);

      // 重置进度条
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error) {
      console.error('Avatar upload error:', error);
      showError(isZh ? '图片上传失败' : 'Failed to upload image');
      setUploadProgress(0);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
    setAvatarPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showSuccess(isZh ? '头像已移除' : 'Avatar removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      showError(isZh ? '请输入显示名称' : 'Please enter display name');
      return;
    }

    if (displayName.length > 100) {
      showError(isZh ? '显示名称不能超过100个字符' : 'Display name must be less than 100 characters');
      return;
    }

    if (bio.length > 500) {
      showError(isZh ? '简介不能超过500个字符' : 'Bio must be less than 500 characters');
      return;
    }

    try {
      setLoading(true);

      const response = await apiClient.updateUserProfile({
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatar: avatar
      });

      if (response.success) {
        showSuccess(isZh ? '个人资料已保存' : 'Profile saved successfully');

        if (onComplete) {
          onComplete();
        } else if (isFirstTime) {
          // 首次设置完成，跳转到用户页面
          router.push('/user');
        } else {
          // 正常更新，刷新数据
          loadProfile();
        }
      }
    } catch (error) {
      console.error('Profile update error:', error);
      showError(error instanceof Error ? error.message : (isZh ? '保存失败' : 'Failed to save profile'));
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {isZh ? '加载中...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="glass-card p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isFirstTime
                ? (isZh ? '设置您的个人资料' : 'Setup Your Profile')
                : (isZh ? '编辑个人资料' : 'Edit Profile')
              }
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isFirstTime
                ? (isZh ? '首次登录，请完善您的个人信息' : 'First time login, please complete your profile')
                : (isZh ? '更新您的个人信息' : 'Update your personal information')
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-card p-6">
            {/* Avatar Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {isZh ? '头像' : 'Avatar'}
                <span className="text-gray-500 text-xs ml-2">
                  ({isZh ? '可选，最大5MB' : 'Optional, max 5MB'})
                </span>
              </label>

              <div className="flex items-center space-x-4">
                {/* Avatar Preview */}
                <div className="relative">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Upload Buttons */}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleAvatarSelect}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <div className="flex flex-wrap gap-2">
                    <label
                      htmlFor="avatar-upload"
                      className="glass-button px-4 py-2 rounded-lg text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
                    >
                      {isZh ? '选择图片' : 'Choose Image'}
                    </label>
                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="glass-button px-4 py-2 rounded-lg text-red-600 hover:text-red-700 transition-colors"
                      >
                        {isZh ? '移除' : 'Remove'}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {isZh ? '支持 JPEG, PNG, GIF, WebP 格式' : 'Supports JPEG, PNG, GIF, WebP'}
                  </p>

                  {/* Progress Bar */}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Display Name */}
            <div className="mb-6">
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isZh ? '显示名称' : 'Display Name'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={100}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder={isZh ? '输入您的显示名称' : 'Enter your display name'}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {displayName.length}/100 {isZh ? '字符' : 'characters'}
              </p>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isZh ? '个人简介' : 'Bio'}
                <span className="text-gray-500 text-xs ml-2">({isZh ? '可选' : 'Optional'})</span>
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder={isZh ? '介绍一下您自己...' : 'Tell us about yourself...'}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {bio.length}/500 {isZh ? '字符' : 'characters'}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (isZh ? '保存中...' : 'Saving...') : (isZh ? '保存' : 'Save')}
              </button>

              {!isFirstTime && (
                <button
                  type="button"
                  onClick={() => router.push('/user')}
                  className="glass-button px-6 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  {isZh ? '取消' : 'Cancel'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
