
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'teacher' | 'student';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireRole }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: Auth state', { 
    loading, 
    hasUser: !!user, 
    hasProfile: !!profile, 
    userRole: profile?.role, 
    requireRole,
    currentPath: location.pathname 
  });

  // Show loading spinner while authentication state is being determined
  if (loading) {
    console.log('ProtectedRoute: Still loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-torah-500"></div>
      </div>
    );
  }

  // If no user is authenticated, redirect to auth page
  if (!user) {
    console.log('ProtectedRoute: No user found, redirecting to /auth');
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // If user exists but no profile, redirect to auth page (profile creation issue)
  if (!profile) {
    console.log('ProtectedRoute: User exists but no profile found, redirecting to /auth');
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // If a specific role is required and user doesn't have it, redirect to their appropriate dashboard
  if (requireRole && profile.role !== requireRole) {
    console.log('ProtectedRoute: Role mismatch', { required: requireRole, actual: profile.role });
    const redirectPath = profile.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student';
    return <Navigate to={redirectPath} replace />;
  }

  console.log('ProtectedRoute: All checks passed, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
