'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, User, CreateUserRequest } from '../api/client';
import { useI18n } from '../i18n/context';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './Toast';

export default function UserManagement() {
  const { t } = useI18n();
  const { user: currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getUsers();
      setUsers(response.users);
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users';
      setError(errorMessage);
      showError('Failed to Load Users', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.password.trim()) {
      showError(t('usernamePasswordRequired'));
      return;
    }

    if (formData.username.length < 3 || formData.password.length < 6) {
      showError(t('usernamePasswordMinLength'));
      return;
    }

    setCreating(true);
    setError('');

    try {
      await apiClient.createUser(formData);
      setFormData({ username: '', password: '', role: 'user' });
      setShowCreateForm(false);
      showSuccess(`User "${formData.username}" created successfully!`);
      await loadUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!window.confirm(`確定要刪除用戶 "${username}" 嗎？此操作無法復原。`)) {
      return;
    }

    setDeleting(userId);
    setError('');

    try {
      await apiClient.deleteUser(userId);
      showSuccess(`User "${username}" deleted successfully!`);
      await loadUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getRoleBadge = (role: string) => {
    const roleStyles = {
      root: { bg: 'bg-red-500', text: 'text-white', icon: '👑' },
      admin: { bg: 'bg-orange-500', text: 'text-white', icon: '🛡️' },
      user: { bg: 'bg-green-500', text: 'text-white', icon: '👤' }
    };
    
    const style = roleStyles[role as keyof typeof roleStyles] || roleStyles.user;
    const roleText = role === 'root' ? 'Root' : role === 'admin' ? t('admin') : t('user');
    
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-lg ${style.bg} ${style.text} text-xs font-medium`}>
        <span className="mr-1">{style.icon}</span>
        {roleText}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('userManagement')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('userManagementDescription')}</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
          disabled={currentUser?.role === 'user'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>{t('createNewUser')}</span>
        </button>
      </div>

      {error && (
        <div className="glass-card p-4 bg-red-50/50 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('createNewUser')}</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="glass-button p-2 rounded-lg text-gray-500"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('username')}
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="glass-input w-full px-3 py-2 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="請輸入用戶名"
                  disabled={creating}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('password')}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="glass-input w-full px-3 py-2 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="請輸入密碼"
                  disabled={creating}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('role')}
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
                  className="glass-input w-full px-3 py-2 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 appearance-none cursor-pointer"
                  disabled={creating}
                >
                  <option value="user">{t('user')}</option>
                  {currentUser?.role === 'root' && <option value="admin">{t('admin')}</option>}
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 glass-button py-2 px-4 rounded-lg text-gray-700 dark:text-gray-300"
                  disabled={creating}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {creating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{t('creating')}</span>
                    </>
                  ) : (
                    <span>{t('create')}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="glass-card p-6">
        <div className="space-y-4">
          {users.map((user) => (
            <div 
              key={user.id}
              className="glass-button p-4 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('createdAt')}: {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {getRoleBadge(user.role)}
                {(currentUser?.role === 'root' || (currentUser?.role === 'admin' && user.role === 'user')) && user.id !== currentUser.id && (
                  <button 
                    onClick={() => handleDeleteUser(user.id, user.username)}
                    disabled={deleting === user.id}
                    className="glass-button p-2 rounded-lg text-red-500 hover:text-red-600 disabled:opacity-50"
                  >
                    {deleting === user.id ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {users.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                尚無用戶
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                點擊上方按鈕創建第一個用戶
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}