
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { flame, star, user, book, calendar } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  subject: string;
}

interface CourseEnrollment {
  id: string;
  progress: number;
  course: {
    id: string;
    title: string;
    subject: string;
    image_url?: string;
  };
}

interface LearningStreak {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  badge_icon: string;
  required_progress: number;
  achieved: boolean;
}

const StudentDashboard = () => {
  const { user, profile, loading } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [streak, setStreak] = useState<LearningStreak | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.role === 'student') {
      fetchDashboardData();
    }
  }, [user, profile]);

  const fetchDashboardData = async () => {
    try {
      // Fetch teachers
      const { data: teachersData } = await supabase
        .from('student_teachers')
        .select(`
          subject,
          teacher:profiles!teacher_id(
            id, first_name, last_name, avatar_url
          )
        `)
        .eq('student_id', user?.id);

      if (teachersData) {
        const formattedTeachers = teachersData.map(item => ({
          id: item.teacher.id,
          first_name: item.teacher.first_name,
          last_name: item.teacher.last_name,
          avatar_url: item.teacher.avatar_url,
          subject: item.subject
        }));
        setTeachers(formattedTeachers);
      }

      // Fetch course enrollments
      const { data: enrollmentsData } = await supabase
        .from('course_enrollments')
        .select(`
          id, progress,
          course:courses(
            id, title, subject, image_url
          )
        `)
        .eq('student_id', user?.id);

      if (enrollmentsData) {
        setEnrollments(enrollmentsData);
      }

      // Fetch learning streak
      const { data: streakData } = await supabase
        .from('learning_streaks')
        .select('*')
        .eq('student_id', user?.id)
        .single();

      if (streakData) {
        setStreak(streakData);
      }

      // Fetch milestones for enrolled courses
      if (enrollmentsData && enrollmentsData.length > 0) {
        const courseIds = enrollmentsData.map(e => e.course.id);
        const { data: milestonesData } = await supabase
          .from('course_milestones')
          .select(`
            *,
            student_milestones!left(
              id, achieved_at
            )
          `)
          .in('course_id', courseIds)
          .order('required_progress');

        if (milestonesData) {
          const formattedMilestones = milestonesData.map(milestone => ({
            ...milestone,
            achieved: milestone.student_milestones && milestone.student_milestones.length > 0
          }));
          setMilestones(formattedMilestones);
        }
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

  if (profile?.role !== 'student') {
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
          <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
          
          {/* Learning Streak Section */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-orange-500"
                    >
                      <flame className="h-8 w-8" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold">Learning Streak</h3>
                      <p className="text-gray-600">Keep up the great work!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <motion.div
                      key={streak?.current_streak}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-bold text-orange-600"
                    >
                      {streak?.current_streak || 0}
                    </motion.div>
                    <p className="text-sm text-gray-500">
                      Best: {streak?.longest_streak || 0} days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* My Teachers Section */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4">My Teachers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher, index) => (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  className="transition-all duration-300"
                >
                  <Card className="cursor-pointer overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={teacher.avatar_url} alt={`${teacher.first_name} ${teacher.last_name}`} />
                          <AvatarFallback>
                            {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {teacher.first_name} {teacher.last_name}
                          </h3>
                          <Badge variant="secondary" className="bg-torah-100 text-torah-700">
                            {teacher.subject}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* My Courses Section */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((enrollment, index) => (
                <motion.div
                  key={enrollment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  className="transition-all duration-300"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{enrollment.course.title}</CardTitle>
                      <Badge variant="outline">{enrollment.course.subject}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(enrollment.progress)}%</span>
                        </div>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                        >
                          <Progress 
                            value={enrollment.progress} 
                            className="h-2"
                          />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Progress Milestones Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Course Milestones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className={`${milestone.achieved ? 'bg-green-50 border-green-200' : 'bg-gray-50'} transition-all duration-300`}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          animate={milestone.achieved ? { rotate: 360, scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.6 }}
                          className={`${milestone.achieved ? 'text-green-500' : 'text-gray-400'}`}
                        >
                          <star className="h-6 w-6" />
                        </motion.div>
                        <div>
                          <h4 className="font-medium">{milestone.title}</h4>
                          <p className="text-sm text-gray-600">{milestone.description}</p>
                          <Badge 
                            variant={milestone.achieved ? "default" : "secondary"}
                            className="mt-1"
                          >
                            {milestone.achieved ? "Achieved!" : `${milestone.required_progress}% required`}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
