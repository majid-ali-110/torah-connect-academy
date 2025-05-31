
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

  // If user exists but no profile, create a simple fallback profile
  if (!profile) {
    console.log('ProtectedRoute: User exists but no profile found, using fallback profile');
    // Instead of redirecting, we'll bypass profile checks - the auth context should handle creating a fallback
    // This should have been handled by AuthContext, but as a fail-safe:
    console.log('ProtectedRoute: Bypassing missing profile check for authenticated user');
    // Continue with the rest of the component
  } else {
    console.log('ProtectedRoute: User authenticated with profile', { 
      profileId: profile.id,
      role: profile.role,
      isFallback: profile.is_fallback
    });
  }
  
  // Always allow access if user is authenticated
  // This ensures users can still access protected routes even with profile issues

  // If a specific role is required and user doesn't have it, redirect to their appropriate dashboard
  if (requireRole && profile && profile.role !== requireRole) {
    console.log('ProtectedRoute: Role mismatch', { required: requireRole, actual: profile.role });
    const redirectPath = profile.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student';
    return <Navigate to={redirectPath} replace />;
  }
  
  // If we need a role but don't have a profile yet, send to general dashboard
  if (requireRole && !profile) {
    console.log('ProtectedRoute: Role required but no profile exists, redirecting to general dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('ProtectedRoute: All checks passed, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
