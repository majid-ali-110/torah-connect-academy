
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
import { Flame, Star, User, Book, Calendar } from 'lucide-react';
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
        <div className="space-y-8">
          <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
          
          {/* Learning Streak Section */}
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-orange-500">
                    <Flame className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Learning Streak</h3>
                    <p className="text-gray-600">Keep up the great work!</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-600">
                    {streak?.current_streak || 0}
                  </div>
                  <p className="text-sm text-gray-500">
                    Best: {streak?.longest_streak || 0} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Teachers Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Teachers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher) => (
                <Card key={teacher.id} className="cursor-pointer overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
              ))}
            </div>
          </div>

          {/* My Courses Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id} className="hover:shadow-lg transition-shadow duration-300">
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
                      <Progress 
                        value={enrollment.progress} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Progress Milestones Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Course Milestones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {milestones.map((milestone) => (
                <Card 
                  key={milestone.id} 
                  className={`${milestone.achieved ? 'bg-green-50 border-green-200' : 'bg-gray-50'} transition-all duration-300 hover:scale-105`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`${milestone.achieved ? 'text-green-500' : 'text-gray-400'}`}>
                        <Star className="h-6 w-6" />
                      </div>
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
