
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
  image_url?: string;
  student_count: number;
  avg_progress: number;
}

interface StudentProgress {
  id: string;
  student_name: string;
  progress: number;
  last_accessed: string;
  course_title: string;
}

interface TeacherStats {
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
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [stats, setStats] = useState<TeacherStats>({ total_students: 0, total_courses: 0, avg_progress: 0 });
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
      // Fetch courses with student counts
      const { data: coursesData } = await supabase
        .from('courses')
        .select(`
          *,
          course_enrollments(count)
        `)
        .eq('teacher_id', user?.id);

      if (coursesData) {
        const coursesWithStats = await Promise.all(
          coursesData.map(async (course) => {
            const { data: enrollments } = await supabase
              .from('course_enrollments')
              .select('progress')
              .eq('course_id', course.id);

            const avgProgress = enrollments && enrollments.length > 0
              ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
              : 0;

            return {
              ...course,
              student_count: course.course_enrollments?.[0]?.count || 0,
              avg_progress: avgProgress
            };
          })
        );
        setCourses(coursesWithStats);
      }

      // Fetch student progress
      const { data: progressData } = await supabase
        .from('course_enrollments')
        .select(`
          id, progress, last_accessed,
          student:profiles!student_id(first_name, last_name),
          course:courses!course_id(title)
        `)
        .eq('courses.teacher_id', user?.id);

      if (progressData) {
        const formattedProgress = progressData.map(item => ({
          id: item.id,
          student_name: `${item.student.first_name} ${item.student.last_name}`,
          progress: item.progress,
          last_accessed: item.last_accessed,
          course_title: item.course.title
        }));
        setStudentProgress(formattedProgress);
      }

      // Calculate stats
      const totalStudents = coursesData?.reduce((sum, course) => sum + (course.course_enrollments?.[0]?.count || 0), 0) || 0;
      const totalCourses = coursesData?.length || 0;
      const avgProgress = coursesData && coursesData.length > 0
        ? coursesData.reduce((sum, course) => sum + (course.avg_progress || 0), 0) / coursesData.length
        : 0;

      setStats({ total_students: totalStudents, total_courses: totalCourses, avg_progress: avgProgress });

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <motion.p 
                      className="text-3xl font-bold text-torah-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {stats.total_students}
                    </motion.p>
                  </div>
                  <User className="h-8 w-8 text-torah-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Courses</p>
                    <motion.p 
                      className="text-3xl font-bold text-torah-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      {stats.total_courses}
                    </motion.p>
                  </div>
                  <Book className="h-8 w-8 text-torah-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Progress</p>
                    <motion.p 
                      className="text-3xl font-bold text-torah-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      {Math.round(stats.avg_progress)}%
                    </motion.p>
                  </div>
                  <Activity className="h-8 w-8 text-torah-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* My Courses Section */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  className="transition-all duration-300"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <Badge variant="outline">{course.subject}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Students: {course.student_count}</span>
                          <span>Avg: {Math.round(course.avg_progress)}%</span>
                        </div>
                        <Progress value={course.avg_progress} className="h-2" />
                        <Button className="w-full" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Student Progress Table */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Student Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studentProgress.slice(0, 5).map((student, index) => (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                        className="flex items-center justify-between p-3 rounded-lg transition-all duration-200"
                      >
                        <div>
                          <p className="font-medium">{student.student_name}</p>
                          <p className="text-sm text-gray-600">{student.course_title}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{Math.round(student.progress)}%</p>
                          <Progress value={student.progress} className="w-20 h-2" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
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
            </motion.div>
          </div>

          {/* Payments Section */}
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Payments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {payouts.map((payout, index) => (
                <motion.div
                  key={payout.id}
                  initial={{ opacity: 0, rotateY: 0 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="perspective-1000"
                >
                  <motion.div
                    animate={{ rotateY: flippedCard === payout.id ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative preserve-3d w-full h-32 cursor-pointer"
                    onClick={() => setFlippedCard(flippedCard === payout.id ? null : payout.id)}
                  >
                    {/* Front of card */}
                    <div className="absolute inset-0 backface-hidden">
                      <Card className={`h-full ${payout.status === 'completed' ? 'bg-green-50 border-green-200' : payout.status === 'pending' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                        <CardContent className="p-4 h-full flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-lg">${payout.amount}</p>
                            <Badge variant={payout.status === 'completed' ? 'default' : payout.status === 'pending' ? 'secondary' : 'destructive'}>
                              {payout.status}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {new Date(payout.period_start).toLocaleDateString()} - {new Date(payout.period_end).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">Click for details</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Back of card */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180">
                      <Card className="h-full bg-gray-50">
                        <CardContent className="p-4 h-full">
                          <div className="space-y-2 text-sm">
                            <p><span className="font-medium">Created:</span> {new Date(payout.created_at).toLocaleDateString()}</p>
                            {payout.paid_at && (
                              <p><span className="font-medium">Paid:</span> {new Date(payout.paid_at).toLocaleDateString()}</p>
                            )}
                            <p><span className="font-medium">Period:</span> {new Date(payout.period_start).toLocaleDateString()} - {new Date(payout.period_end).toLocaleDateString()}</p>
                            <p><span className="font-medium">Status:</span> {payout.status}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
