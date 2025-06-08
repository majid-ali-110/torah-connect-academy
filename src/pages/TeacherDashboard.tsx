
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Calendar, DollarSign, Clock, Plus, Wallet } from 'lucide-react';
import StudyHoursTracker from '@/components/video/StudyHoursTracker';
import CourseCreationModal from '@/components/courses/CourseCreationModal';
import WithdrawalModal from '@/components/teachers/WithdrawalModal';
import CreateLiveClassModal from '@/components/live-courses/CreateLiveClassModal';
import { supabase } from '@/integrations/supabase/client';

const TeacherDashboard = () => {
  const { user, profile, loading } = useAuth();
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showLiveClassModal, setShowLiveClassModal] = useState(false);
  const [earnings, setEarnings] = useState(0);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    pendingLessons: 0,
    unreadMessages: 0
  });

  useEffect(() => {
    if (profile?.role === 'teacher') {
      fetchStats();
      fetchEarnings();
    }
  }, [profile]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Count total students from enrollments
      const { count: studentCount } = await supabase
        .from('course_enrollments')
        .select('student_id', { count: 'exact' })
        .in('course_id', 
          (await supabase.from('courses').select('id').eq('teacher_id', user.id)).data?.map(c => c.id) || []
        );

      // Count total courses
      const { count: courseCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact' })
        .eq('teacher_id', user.id);

      // Count pending lessons
      const { count: lessonCount } = await supabase
        .from('lesson_bookings')
        .select('*', { count: 'exact' })
        .eq('teacher_id', user.id)
        .eq('status', 'scheduled');

      // Count unread messages
      const { count: messageCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      setStats({
        totalStudents: studentCount || 0,
        totalCourses: courseCount || 0,
        pendingLessons: lessonCount || 0,
        unreadMessages: messageCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchEarnings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('teacher_earnings')
        .select('amount, status')
        .eq('teacher_id', user.id);

      if (error) throw error;

      const availableEarnings = data
        ?.filter(earning => earning.status === 'pending')
        .reduce((sum, earning) => sum + earning.amount, 0) || 0;

      setEarnings(availableEarnings);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

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

  if (profile?.role !== 'teacher') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile.first_name}!
          </h1>
          <p className="text-gray-600 mt-2">Manage your teaching activities</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Active enrollments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unreadMessages}</div>
              <Button variant="outline" className="w-full mt-2" onClick={() => window.location.href = '/chat'}>
                View Messages
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{(earnings / 100).toFixed(2)}</div>
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => setShowWithdrawalModal(true)}
                disabled={earnings === 0}
              >
                <Wallet className="w-4 h-4 mr-1" />
                Withdraw
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Lessons</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingLessons}</div>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Create New Course</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Create a new course for students to enroll in</p>
              <Button 
                onClick={() => setShowCourseModal(true)}
                className="w-full bg-torah-500 hover:bg-torah-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Live Class</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Schedule a live interactive class</p>
              <Button 
                onClick={() => setShowLiveClassModal(true)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Live Class
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Total courses: {stats.totalCourses}</p>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = '/teacher/courses'}
              >
                Manage Courses
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Teaching Hours Tracker */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="mr-2 h-6 w-6" />
            Teaching Hours Tracking
          </h2>
          <StudyHoursTracker />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-4">No lessons scheduled for today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <CourseCreationModal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        onCourseCreated={() => {
          fetchStats();
          setShowCourseModal(false);
        }}
      />

      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
      />

      <CreateLiveClassModal
        isOpen={showLiveClassModal}
        onClose={() => setShowLiveClassModal(false)}
        onClassCreated={() => {
          fetchStats();
          setShowLiveClassModal(false);
        }}
      />
    </div>
  );
};

export default TeacherDashboard;
