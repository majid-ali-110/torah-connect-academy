
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PendingApprovalMessage from '@/components/auth/PendingApprovalMessage';

interface LiveCoursesWrapperProps {
  children: React.ReactNode;
}

const LiveCoursesWrapper: React.FC<LiveCoursesWrapperProps> = ({ children }) => {
  const { profile } = useAuth();

  // Show pending approval message for teachers who aren't approved yet
  if (profile?.role === 'teacher' && profile.approval_status !== 'approved') {
    return <PendingApprovalMessage />;
  }

  return <>{children}</>;
};

export default LiveCoursesWrapper;
