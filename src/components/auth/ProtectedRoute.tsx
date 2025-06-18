import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Shield, User, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'teacher' | 'student' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireRole }) => {
  const { user, profile, loading } = useAuth();
  const { t } = useLanguage();
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
      <div 
        className="min-h-screen flex items-center justify-center bg-gray-50"
        role="status"
        aria-live="polite"
        aria-label={t('common.loading')}
      >
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-torah-500 mx-auto mb-4" />
          <p className="text-gray-600">{t('common.loading')}</p>
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
    
    // Show access denied message with proper accessibility
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
        role="alert"
        aria-live="assertive"
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Shield className="h-12 w-12 text-red-500" aria-hidden="true" />
            </div>
            <CardTitle className="text-xl">
              {t('auth.access_denied')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              You need {t(`roles.${requireRole}`)} permissions to access this page. Your current role is {t(`roles.${profile.role}`)}.
            </p>
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => window.history.back()} 
                variant="outline"
                className="w-full"
              >
                {t('common.go_back')}
              </Button>
              <Button 
                asChild
                className="w-full"
              >
                <a href="/dashboard">
                  {t('nav.dashboard')}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If a specific role is required but profile is missing/loading, wait or redirect to general dashboard
  if (requireRole && !profile) {
    console.log('ProtectedRoute: Role required but no profile exists, redirecting to general dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // If teacher role is required, check approval status
  if (requireRole === 'teacher' && profile?.role === 'teacher') {
    const isApproved = profile.approval_status === 'approved';
    const isPending = profile.approval_status === 'pending';
    const isRejected = profile.approval_status === 'rejected';

    if (!isApproved) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
          role="alert"
          aria-live="assertive"
        >
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {isPending ? (
                  <AlertCircle className="h-12 w-12 text-yellow-500" aria-hidden="true" />
                ) : (
                  <AlertCircle className="h-12 w-12 text-red-500" aria-hidden="true" />
                )}
              </div>
              <CardTitle className="text-xl">
                {isPending ? t('auth.approval_pending') : t('auth.application_rejected')}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                {isPending 
                  ? t('auth.approval_pending_message')
                  : t('auth.application_rejected_message')
                }
              </p>
              <Button 
                onClick={() => window.history.back()} 
                variant="outline"
                className="w-full"
              >
                {t('common.go_back')}
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // All checks passed, render the protected content
  console.log('ProtectedRoute: All checks passed, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
