
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useTeacherHours } from '@/hooks/useTeacherHours';
import { CourseCreation } from '@/components/teacher/CourseCreation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Plus, CheckCircle, AlertCircle } from 'lucide-react';

const TeacherDashboard = () => {
  const { user, profile, loading } = useAuth();
  const { hours, totalHours, loading: hoursLoading } = useTeacherHours();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-torah-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile || profile.role !== 'teacher') {
    return <Navigate to="/auth" replace />;
  }

  const isApproved = profile.approval_status === 'approved';
  const isPending = profile.approval_status === 'pending';

  if (!isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {isPending ? (
                <AlertCircle className="h-12 w-12 text-yellow-500" />
              ) : (
                <AlertCircle className="h-12 w-12 text-red-500" />
              )}
            </div>
            <CardTitle>
              {isPending ? 'Approval Pending' : 'Application Rejected'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              {isPending 
                ? 'Your teacher application is currently under review. You will be notified once approved.'
                : 'Your teacher application was not approved. Please contact support for more information.'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600">Welcome back, {profile.first_name}!</p>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="w-4 h-4 mr-1" />
              Approved
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="create">Create Course</TabsTrigger>
            <TabsTrigger value="hours">Teaching Hours</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Hours Taught</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {hoursLoading ? '...' : totalHours.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">Hours this month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">Currently teaching</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">Enrolled in courses</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Teaching Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {hoursLoading ? (
                  <p>Loading recent sessions...</p>
                ) : hours.length > 0 ? (
                  <div className="space-y-3">
                    {hours.slice(0, 5).map((hour) => (
                      <div key={hour.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{hour.session?.course?.title}</p>
                          <p className="text-sm text-gray-600">
                            {hour.session?.student?.first_name} {hour.session?.student?.last_name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{hour.hours_taught}h</p>
                          <p className="text-sm text-gray-600">
                            {new Date(hour.date_taught).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No teaching sessions yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Course management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <CourseCreation />
          </TabsContent>

          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle>Teaching Hours Log</CardTitle>
              </CardHeader>
              <CardContent>
                {hoursLoading ? (
                  <p>Loading hours...</p>
                ) : hours.length > 0 ? (
                  <div className="space-y-3">
                    {hours.map((hour) => (
                      <div key={hour.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium">{hour.session?.course?.title}</p>
                          <p className="text-sm text-gray-600">
                            Student: {hour.session?.student?.first_name} {hour.session?.student?.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Date: {new Date(hour.date_taught).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{hour.hours_taught} hours</p>
                          <Badge variant="secondary">{hour.session?.course?.subject}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No teaching hours recorded yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;
