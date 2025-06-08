
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, profile, loading } = useAuth();

  console.log('Dashboard: Auth state', { 
    loading, 
    hasUser: !!user, 
    hasProfile: !!profile, 
    userRole: profile?.role 
  });

  if (loading) {
    console.log('Dashboard: Still loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-torah-500"></div>
      </div>
    );
  }

  if (!user) {
    console.log('Dashboard: No user, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // If profile exists, redirect based on role
  if (profile && profile.role) {
    if (profile.role === 'student') {
      console.log('Dashboard: Student role detected, redirecting to /dashboard/student');
      return <Navigate to="/dashboard/student" replace />;
    } else if (profile.role === 'teacher') {
      console.log('Dashboard: Teacher role detected, redirecting to /dashboard/teacher');
      return <Navigate to="/dashboard/teacher" replace />;
    } else if (profile.role === 'admin') {
      console.log('Dashboard: Admin role detected, redirecting to /dashboard/admin');
      return <Navigate to="/dashboard/admin" replace />;
    }
  }

  // If no profile or role, show a temporary dashboard with profile setup
  console.log('Dashboard: No profile/role found, showing temporary dashboard');
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Welcome!</h1>
        <p className="text-gray-600 text-center mb-6">
          Setting up your profile... Please wait while we prepare your dashboard.
        </p>
        <div className="flex justify-center">
          <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
