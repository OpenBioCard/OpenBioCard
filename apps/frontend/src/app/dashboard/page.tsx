'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';
import DashboardOverview from '../../components/DashboardOverview';
import UserManagement from '../../components/UserManagement';
import SystemStatusPage from '../../components/SystemStatusPage';

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState('overview');
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  // Set document title
  useEffect(() => {
    document.title = 'Dashboard - OpenBioCard';
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Check user permissions
  useEffect(() => {
    if (!isLoading && isAuthenticated && user && !['root', 'admin'].includes(user.role)) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, user, router]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !['root', 'admin'].includes(user.role)) {
    return null; // Will redirect in useEffect
  }

  return (
    <DashboardLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderDashboardContent()}
    </DashboardLayout>
  );
}