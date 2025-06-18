import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navigate } from 'react-router-dom';
import TeacherApprovalList from '@/components/admin/TeacherApprovalList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Clock, Heart, Shield, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalTeachers: number;
  pendingApprovals: number;
  activeCourses: number;
  totalStudents: number;
  totalDonations: number;
  monthlyTeachingHours: number;
}

const AdminDashboard = () => {
  const { user, profile, loading } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalTeachers: 0,
    pendingApprovals: 0,
    activeCourses: 0,
    totalStudents: 0,
    totalDonations: 0,
    monthlyTeachingHours: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchDashboardStats();
    }
  }, [profile]);

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      
      // Fetch total teachers
      const { count: teachersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'teacher');

      // Fetch pending approvals
      const { count: pendingCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'teacher')
        .eq('approval_status', 'pending');

      // Fetch active courses
      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch total students
      const { count: studentsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      // Fetch total donations
      const { count: donationsCount } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      // Fetch monthly teaching hours
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const { data: hoursData } = await supabase
        .from('teacher_hours')
        .select('hours_taught')
        .gte('date_taught', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
        .lt('date_taught', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`);

      const totalHours = hoursData?.reduce((sum, record) => sum + (record.hours_taught || 0), 0) || 0;

      setStats({
        totalTeachers: teachersCount || 0,
        pendingApprovals: pendingCount || 0,
        activeCourses: coursesCount || 0,
        totalStudents: studentsCount || 0,
        totalDonations: donationsCount || 0,
        monthlyTeachingHours: totalHours
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
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

  if (!user || !profile || profile.role !== 'admin') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('admin.dashboard_title')}</h1>
              <p className="text-gray-600">{t('admin.dashboard_subtitle')}</p>
            </div>
            <Badge variant="default" className="bg-blue-100 text-blue-800">
              <Shield className="w-4 h-4 mr-1" />
              {t('roles.admin')}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t('nav.dashboard')}</TabsTrigger>
            <TabsTrigger value="approvals">{t('admin.pending_teachers')}</TabsTrigger>
            <TabsTrigger value="teachers">All Teachers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loadingStats ? '...' : stats.totalTeachers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingApprovals} pending approval
                  </p>
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
                  <p className="text-xs text-muted-foreground">Available to students</p>
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
                  <p className="text-xs text-muted-foreground">Registered learners</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Teaching Hours</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loadingStats ? '...' : stats.monthlyTeachingHours.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveTab('approvals')}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <AlertTriangle className="w-6 h-6" />
                    <span>Review Teacher Applications</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <BookOpen className="w-6 h-6" />
                    <span>Manage Courses</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Heart className="w-6 h-6" />
                    <span>View Donations</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals">
            <TeacherApprovalList />
          </TabsContent>

          <TabsContent value="teachers">
            <Card>
              <CardHeader>
                <CardTitle>All Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Teacher management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
