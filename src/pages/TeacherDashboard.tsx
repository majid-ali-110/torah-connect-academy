import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navigate } from 'react-router-dom';
import { useTeacherHours } from '@/hooks/useTeacherHours';
import { CourseCreation } from '@/components/teacher/CourseCreation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Plus, CheckCircle, AlertCircle, Calendar, TrendingUp, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TeacherStats {
  totalStudents: number;
  activeCourses: number;
  upcomingSessions: number;
  totalEarnings: number;
}

const TeacherDashboard = () => {
  const { user, profile, loading } = useAuth();
  const { t } = useLanguage();
  const { hours, totalHours, loading: hoursLoading } = useTeacherHours();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<TeacherStats>({
    totalStudents: 0,
    activeCourses: 0,
    upcomingSessions: 0,
    totalEarnings: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (profile?.role === 'teacher' && profile.approval_status === 'approved') {
      fetchTeacherStats();
    }
  }, [profile]);

  const fetchTeacherStats = async () => {
    try {
      setLoadingStats(true);
      
      // For now, we'll get basic stats without complex joins
      // TODO: Implement proper student count calculation
      const totalStudents = 0;

      // Fetch active courses
      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('teacher_id', user?.id)
        .eq('is_active', true);

      // Fetch upcoming sessions
      const { count: sessionsCount } = await supabase
        .from('course_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('teacher_id', user?.id)
        .gte('session_date', new Date().toISOString())
        .eq('status', 'scheduled');

      // Fetch total earnings (simplified calculation)
      const { data: earningsData } = await supabase
        .from('teacher_earnings')
        .select('amount')
        .eq('teacher_id', user?.id)
        .eq('status', 'completed');

      const totalEarnings = earningsData?.reduce((sum, record) => sum + (record.amount || 0), 0) || 0;

      setStats({
        totalStudents,
        activeCourses: coursesCount || 0,
        upcomingSessions: sessionsCount || 0,
        totalEarnings
      });
    } catch (error) {
      console.error('Error fetching teacher stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-gray-50"
        role="status"
        aria-live="polite"
        aria-label={t('common.loading')}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-torah-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.teacher.title')}</h1>
              <p className="text-gray-600">Welcome back, {profile.first_name}!</p>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="w-4 h-4 mr-1" />
              {t('auth.approved')}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="create">Create Course</TabsTrigger>
            <TabsTrigger value="sessions">Live Sessions</TabsTrigger>
            <TabsTrigger value="hours">Teaching Hours</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  <div className="text-2xl font-bold">
                    {loadingStats ? '...' : stats.activeCourses}
                  </div>
                  <p className="text-xs text-muted-foreground">Currently teaching</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loadingStats ? '...' : stats.totalStudents}
                  </div>
                  <p className="text-xs text-muted-foreground">Enrolled in courses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loadingStats ? '...' : stats.upcomingSessions}
                  </div>
                  <p className="text-xs text-muted-foreground">Scheduled this week</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Recent Teaching Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hoursLoading ? (
                    <p>{t('common.loading')}</p>
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setActiveTab('create')}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Course
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('sessions')}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Schedule Live Session
                    </Button>
                    <Button 
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      View My Students
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Course management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <CourseCreation />
          </TabsContent>

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Live Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Live session management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle>Teaching Hours Log</CardTitle>
              </CardHeader>
              <CardContent>
                {hoursLoading ? (
                  <p>{t('common.loading')}</p>
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
