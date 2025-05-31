
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

  if (!profile) {
    console.log('Dashboard: No profile, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // Redirect based on role
  if (profile.role === 'student') {
    console.log('Dashboard: Student role detected, redirecting to /dashboard/student');
    return <Navigate to="/dashboard/student" replace />;
  } else if (profile.role === 'teacher') {
    console.log('Dashboard: Teacher role detected, redirecting to /dashboard/teacher');
    return <Navigate to="/dashboard/teacher" replace />;
  }

  // Default fallback if no role is set
  console.log('Dashboard: No valid role found, redirecting to /auth');
  return <Navigate to="/auth" replace />;
};

export default Dashboard;
