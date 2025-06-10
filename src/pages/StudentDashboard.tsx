
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { CourseEnrollment } from '@/components/student/CourseEnrollment';
import { DonationInterface } from '@/components/donations/DonationInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Gift, Heart, Calendar } from 'lucide-react';

const StudentDashboard = () => {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-torah-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile || profile.role !== 'student') {
    return <Navigate to="/auth" replace />;
  }

  const remainingTrials = (profile.max_trial_lessons || 2) - (profile.trial_lessons_used || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600">Welcome back, {profile.first_name}!</p>
            </div>
            {remainingTrials > 0 && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <Gift className="w-4 h-4 mr-1" />
                {remainingTrials} Free Trial{remainingTrials !== 1 ? 's' : ''} Available
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">Browse Courses</TabsTrigger>
            <TabsTrigger value="my-courses">My Courses</TabsTrigger>
            <TabsTrigger value="donate">Support Others</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <CourseEnrollment />
          </TabsContent>

          <TabsContent value="my-courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">Active enrollments</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Hours</CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">Learning time</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>My Learning Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Your enrolled courses and progress will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donate">
            <DonationInterface />
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Student Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <p className="text-gray-900">{profile.first_name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <p className="text-gray-900">{profile.last_name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <p className="text-gray-900">{profile.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Learning Level</label>
                    <p className="text-gray-900">{profile.learning_level || 'Not set'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Trial Lessons</label>
                  <p className="text-gray-900">
                    Used: {profile.trial_lessons_used || 0} / {profile.max_trial_lessons || 2}
                  </p>
                </div>

                {profile.bio && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <p className="text-gray-900">{profile.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
