
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'teacher' | 'student';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireRole }) => {
  const { user, profile, loading } = useAuth();

  console.log('ProtectedRoute - user:', user?.id, 'profile:', profile?.role, 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-torah-500"></div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  if (!profile) {
    console.log('No profile found, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  if (requireRole && profile?.role !== requireRole) {
    console.log('Role mismatch, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
