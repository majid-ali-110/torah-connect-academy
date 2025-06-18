
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TeacherApprovalSystem } from '@/components/admin/TeacherApprovalSystem';
import { SalaryManagement } from '@/components/admin/SalaryManagement';
import { TeacherCourseCreation } from '@/components/teacher/TeacherCourseCreation';
import { TrialSystem } from '@/components/student/TrialSystem';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, GraduationCap, BookOpen } from 'lucide-react';

export const RoleBasedDashboard: React.FC = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p>Please log in to access your dashboard.</p>
        </CardContent>
      </Card>
    );
  }

  const renderAdminDashboard = () => (
    <Tabs defaultValue="approvals" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="approvals" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Teacher Approvals
        </TabsTrigger>
        <TabsTrigger value="salary" className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Salary Management
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="approvals">
        <TeacherApprovalSystem />
      </TabsContent>
      
      <TabsContent value="salary">
        <SalaryManagement />
      </TabsContent>
    </Tabs>
  );

  const renderTeacherDashboard = () => {
    if (profile.approval_status === 'pending') {
      return (
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Approval Pending</h3>
            <p className="text-gray-600">
              Your teacher application is under review. You'll be able to create courses once approved by an admin.
            </p>
          </CardContent>
        </Card>
      );
    }

    if (profile.approval_status === 'rejected') {
      return (
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Application Rejected</h3>
            <p className="text-gray-600">
              Unfortunately, your teacher application was not approved. Please contact support for more information.
            </p>
          </CardContent>
        </Card>
      );
    }

    return <TeacherCourseCreation />;
  };

  const renderStudentDashboard = () => (
    <TrialSystem />
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {profile.role === 'admin' && 'Admin Dashboard'}
          {profile.role === 'teacher' && 'Teacher Dashboard'}
          {profile.role === 'student' && 'Student Dashboard'}
        </h1>
        <p className="text-gray-600">
          Welcome back, {profile.first_name} {profile.last_name}!
        </p>
      </div>

      {profile.role === 'admin' && renderAdminDashboard()}
      {profile.role === 'teacher' && renderTeacherDashboard()}
      {profile.role === 'student' && renderStudentDashboard()}
    </div>
  );
};
