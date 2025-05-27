
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-torah-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect based on role
  if (profile?.role === 'student') {
    return <Navigate to="/dashboard/student" replace />;
  } else if (profile?.role === 'teacher') {
    return <Navigate to="/dashboard/teacher" replace />;
  }

  // Default fallback if no role is set
  return <Navigate to="/auth" replace />;
};

export default Dashboard;
