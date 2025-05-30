
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { User, Book, Calendar as CalendarIcon, Star, Activity, TrendingUp } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import AnimatedCounter from '@/components/AnimatedCounter';
import AnimatedProgress from '@/components/ui/animated-progress';

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
  const { t } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_students: 0,
    total_courses: 0,
    avg_progress: 0
  });
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

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
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-32 w-32 border-b-2 border-torah-500"
          />
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-8">{t('dashboard.teacher.title')}</h1>
          </motion.div>
          
          {/* Enhanced Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">{t('dashboard.total_students')}</h3>
                      <div className="text-3xl font-bold text-blue-600">
                        <AnimatedCounter value={stats.total_students} />
                      </div>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <User className="h-8 w-8 text-torah-500" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">{t('dashboard.active_courses')}</h3>
                      <div className="text-3xl font-bold text-green-600">
                        <AnimatedCounter value={stats.total_courses} />
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Book className="h-8 w-8 text-torah-500" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">{t('dashboard.avg_progress')}</h3>
                      <div className="text-3xl font-bold text-purple-600">
                        <AnimatedCounter value={Math.round(stats.avg_progress)} suffix="%" />
                      </div>
                    </div>
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <TrendingUp className="h-8 w-8 text-torah-500" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Enhanced My Courses Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold mb-4">{t('dashboard.my_courses')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-torah-500">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Book className="h-5 w-5 text-torah-500" />
                        {course.title}
                      </CardTitle>
                      <Badge variant="outline">{course.subject}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Students enrolled:</span>
                          <span className="font-medium">
                            <AnimatedCounter value={course.course_enrollments.length} />
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Price:</span>
                          <span className="font-medium">${course.price}</span>
                        </div>
                        <Button variant="outline" className="w-full hover:bg-torah-50">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Student Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold mb-4">Student Progress Overview</h2>
            <div className="space-y-4">
              {courses.map((course, courseIndex) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * courseIndex }}
                >
                  <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {course.course_enrollments.length > 0 ? (
                          course.course_enrollments.map((enrollment, enrollmentIndex) => (
                            <motion.div 
                              key={enrollment.id} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.05 * enrollmentIndex }}
                              className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            >
                              <div className="flex-1">
                                <p className="font-medium">
                                  {enrollment.student.first_name} {enrollment.student.last_name}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2 flex-1">
                                <AnimatedProgress 
                                  value={enrollment.progress} 
                                  className="flex-1 h-2"
                                  delay={0.1 * enrollmentIndex}
                                />
                                <span className="text-sm font-medium min-w-[3rem]">
                                  <AnimatedCounter value={Math.round(enrollment.progress)} suffix="%" />
                                </span>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center py-4">No students enrolled yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Calendar and Payments Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5" />
                    <span>{t('dashboard.teaching_schedule')}</span>
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>{t('dashboard.recent_payouts')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {payouts.length > 0 ? (
                      payouts.slice(0, 5).map((payout, index) => (
                        <motion.div 
                          key={payout.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                          onClick={() => setFlippedCard(flippedCard === payout.id ? null : payout.id)}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div>
                            <p className="font-medium">
                              $<AnimatedCounter value={payout.amount} />
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(payout.period_start).toLocaleDateString()} - {new Date(payout.period_end).toLocaleDateString()}
                            </p>
                          </div>
                          <motion.div
                            animate={{ rotateY: flippedCard === payout.id ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Badge 
                              variant={payout.status === 'completed' ? 'default' : 
                                     payout.status === 'pending' ? 'secondary' : 'destructive'}
                            >
                              {payout.status}
                            </Badge>
                          </motion.div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No payouts yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
