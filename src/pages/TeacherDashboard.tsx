
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { User, Book, Calendar as CalendarIcon, Star, Activity } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  subject: string;
  description: string;
  price: number;
  image_url?: string;
  course_enrollments: Array<{
    id: string;
    progress: number;
    student: {
      first_name: string;
      last_name: string;
    };
  }>;
}

interface Stats {
  total_students: number;
  total_courses: number;
  avg_progress: number;
}

interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  period_start: string;
  period_end: string;
  created_at: string;
  paid_at?: string;
}

const TeacherDashboard = () => {
  const { user, profile, loading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_students: 0,
    total_courses: 0,
    avg_progress: 0
  });
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.role === 'teacher') {
      fetchDashboardData();
    }
  }, [user, profile]);

  const fetchDashboardData = async () => {
    try {
      // Fetch courses with enrollments
      const { data: coursesData } = await supabase
        .from('courses')
        .select(`
          *,
          course_enrollments(
            id, progress,
            student:profiles!student_id(
              first_name, last_name
            )
          )
        `)
        .eq('teacher_id', user?.id)
        .eq('is_active', true);

      if (coursesData) {
        setCourses(coursesData);
        
        // Calculate stats
        const totalStudents = coursesData.reduce((sum, course) => 
          sum + course.course_enrollments.length, 0
        );
        
        const totalProgress = coursesData.reduce((sum, course) => 
          sum + course.course_enrollments.reduce((courseSum, enrollment) => 
            courseSum + enrollment.progress, 0
          ), 0
        );
        
        const avgProgress = totalStudents > 0 ? totalProgress / totalStudents : 0;
        
        setStats({
          total_students: totalStudents,
          total_courses: coursesData.length,
          avg_progress: avgProgress
        });
      }

      // Fetch payouts
      const { data: payoutsData } = await supabase
        .from('teacher_payouts')
        .select('*')
        .eq('teacher_id', user?.id)
        .order('created_at', { ascending: false });

      if (payoutsData) {
        const typedPayouts = payoutsData.map(payout => ({
          ...payout,
          status: payout.status as 'pending' | 'completed' | 'failed'
        }));
        setPayouts(typedPayouts);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setDashboardLoading(false);
    }
  };

  if (loading || dashboardLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-torah-500"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (profile?.role !== 'teacher') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Total Students</h3>
                    <div className="text-3xl font-bold text-blue-600">
                      {stats.total_students}
                    </div>
                  </div>
                  <User className="h-8 w-8 text-torah-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Active Courses</h3>
                    <div className="text-3xl font-bold text-green-600">
                      {stats.total_courses}
                    </div>
                  </div>
                  <Book className="h-8 w-8 text-torah-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Avg Progress</h3>
                    <div className="text-3xl font-bold text-purple-600">
                      {Math.round(stats.avg_progress)}%
                    </div>
                  </div>
                  <Activity className="h-8 w-8 text-torah-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Courses Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <Badge variant="outline">{course.subject}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Students enrolled:</span>
                        <span className="font-medium">{course.course_enrollments.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Price:</span>
                        <span className="font-medium">${course.price}</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Student Progress Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Student Progress Overview</h2>
            <div className="space-y-4">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.course_enrollments.length > 0 ? (
                        course.course_enrollments.map((enrollment) => (
                          <div key={enrollment.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium">
                                {enrollment.student.first_name} {enrollment.student.last_name}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 flex-1">
                              <Progress value={enrollment.progress} className="flex-1" />
                              <span className="text-sm font-medium min-w-[3rem]">
                                {Math.round(enrollment.progress)}%
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No students enrolled yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Teaching Schedule and Payments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5" />
                    <span>Teaching Schedule</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Payments */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Payouts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {payouts.length > 0 ? (
                      payouts.slice(0, 5).map((payout) => (
                        <div key={payout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">${payout.amount}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(payout.period_start).toLocaleDateString()} - {new Date(payout.period_end).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge 
                            variant={payout.status === 'completed' ? 'default' : 
                                   payout.status === 'pending' ? 'secondary' : 'destructive'}
                          >
                            {payout.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No payouts yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
