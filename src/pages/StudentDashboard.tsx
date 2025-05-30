
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Flame, Star, User, Book, Calendar, Trophy } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import AnimatedCounter from '@/components/AnimatedCounter';
import AnimatedProgress from '@/components/ui/animated-progress';

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  subject: string;
  gender: string;
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
  const { t } = useLanguage();
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
      // Fetch same-gender teachers only
      const { data: teachersData } = await supabase
        .from('student_teachers')
        .select(`
          subject,
          teacher:profiles!teacher_id(
            id, first_name, last_name, avatar_url, gender
          )
        `)
        .eq('student_id', user?.id);

      if (teachersData) {
        const formattedTeachers = teachersData
          .filter(item => item.teacher.gender === profile?.gender)
          .map(item => ({
            id: item.teacher.id,
            first_name: item.teacher.first_name,
            last_name: item.teacher.last_name,
            avatar_url: item.teacher.avatar_url,
            subject: item.subject,
            gender: item.teacher.gender
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

  if (profile?.role !== 'student') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-8"
          >
            {t('dashboard.student.title')}
          </motion.h1>
          
          {/* Enhanced Learning Streak Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-orange-500"
                    >
                      <Flame className="h-8 w-8" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold">{t('dashboard.learning_streak')}</h3>
                      <p className="text-gray-600">{t('common.keep_up')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-600">
                      <AnimatedCounter value={streak?.current_streak || 0} />
                    </div>
                    <p className="text-sm text-gray-500">
                      {t('common.best')}: <AnimatedCounter value={streak?.longest_streak || 0} /> {t('common.days')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced My Teachers Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4">{t('dashboard.my_teachers')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher, index) => (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-torah-500">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16 ring-2 ring-torah-100">
                          <AvatarImage src={teacher.avatar_url} alt={`${teacher.first_name} ${teacher.last_name}`} />
                          <AvatarFallback>
                            {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {teacher.first_name} {teacher.last_name}
                          </h3>
                          <Badge variant="secondary" className="bg-torah-100 text-torah-700 mt-1">
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

          {/* Enhanced My Courses Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-4">{t('dashboard.my_courses')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((enrollment, index) => (
                <motion.div
                  key={enrollment.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Book className="h-5 w-5 text-torah-500" />
                        {enrollment.course.title}
                      </CardTitle>
                      <Badge variant="outline">{enrollment.course.subject}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>{t('common.progress')}</span>
                          <span className="font-medium">{Math.round(enrollment.progress)}%</span>
                        </div>
                        <AnimatedProgress 
                          value={enrollment.progress} 
                          delay={0.2 * index}
                          className="h-3"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Progress Milestones Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-4">{t('dashboard.course_milestones')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                >
                  <Card 
                    className={`${
                      milestone.achieved 
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    } transition-all duration-300`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <motion.div 
                          animate={milestone.achieved ? { rotate: [0, 360] } : {}}
                          transition={{ duration: 0.5 }}
                          className={`${milestone.achieved ? 'text-green-500' : 'text-gray-400'}`}
                        >
                          {milestone.achieved ? (
                            <Trophy className="h-6 w-6" />
                          ) : (
                            <Star className="h-6 w-6" />
                          )}
                        </motion.div>
                        <div>
                          <h4 className="font-medium">{milestone.title}</h4>
                          <p className="text-sm text-gray-600">{milestone.description}</p>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 * index }}
                          >
                            <Badge 
                              variant={milestone.achieved ? "default" : "secondary"}
                              className="mt-1"
                            >
                              {milestone.achieved ? t('common.achieved') : `${milestone.required_progress}% ${t('common.required')}`}
                            </Badge>
                          </motion.div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
