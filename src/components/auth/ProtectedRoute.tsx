
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'teacher' | 'student' | 'admin';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-torah-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user is authenticated, redirect to auth page
  if (!user) {
    console.log('ProtectedRoute: No user found, redirecting to /auth');
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // User is authenticated - check role requirements if profile exists
  if (requireRole && profile?.role && profile.role !== requireRole) {
    console.log('ProtectedRoute: Role mismatch', { required: requireRole, actual: profile.role });
    let redirectPath = '/dashboard';
    
    if (profile.role === 'teacher') {
      redirectPath = '/dashboard/teacher';
    } else if (profile.role === 'student') {
      redirectPath = '/dashboard/student';
    } else if (profile.role === 'admin') {
      redirectPath = '/dashboard/admin';
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  // If a specific role is required but profile is missing/loading, wait or redirect to general dashboard
  if (requireRole && !profile) {
    console.log('ProtectedRoute: Role required but no profile exists, redirecting to general dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('ProtectedRoute: All checks passed, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
