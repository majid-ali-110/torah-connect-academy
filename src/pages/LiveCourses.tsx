
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, Video, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LiveCourse {
  id: string;
  title: string;
  description: string;
  teacher_id: string;
  subject: string;
  start_time: string;
  duration_minutes: number;
  max_participants: number;
  meeting_url?: string;
  meeting_id?: string;
  status: string;
  price: number;
  created_at: string;
  teacher_name?: string;
  enrollment_count?: number;
  is_enrolled?: boolean;
}

const LiveCourses = () => {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<LiveCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<LiveCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchLiveCourses();
  }, [user]);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, subjectFilter, statusFilter]);

  const fetchLiveCourses = async () => {
    try {
      console.log('Fetching live courses...');
      
      let query = supabase
        .from('live_courses')
        .select('*')
        .eq('status', 'scheduled')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      const { data: coursesData, error } = await query;

      if (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }

      // Get teacher names and enrollment data separately
      const coursesWithData = await Promise.all(
        (coursesData || []).map(async (course) => {
          // Get teacher name
          const { data: teacher } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', course.teacher_id)
            .single();

          // Count enrollments
          const { count } = await supabase
            .from('live_course_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id)
            .eq('payment_status', 'paid');

          // Check if current user is enrolled
          let isEnrolled = false;
          if (user) {
            const { data: enrollment } = await supabase
              .from('live_course_enrollments')
              .select('id')
              .eq('course_id', course.id)
              .eq('student_id', user.id)
              .single();
            
            isEnrolled = !!enrollment;
          }

          return {
            ...course,
            teacher_name: teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown Teacher',
            enrollment_count: count || 0,
            is_enrolled: isEnrolled
          };
        })
      );

      console.log('Fetched courses with data:', coursesWithData);
      setCourses(coursesWithData);
    } catch (error) {
      console.error('Error fetching live courses:', error);
      toast({
        title: "Error",
        description: "Failed to load live courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(course => course.subject === subjectFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(course => course.status === statusFilter);
    }

    setFilteredCourses(filtered);
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to enroll in courses",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('live_course_enrollments')
        .insert({
          course_id: courseId,
          student_id: user.id,
          payment_status: 'paid' // In a real app, this would involve payment processing
        });

      if (error) throw error;

      toast({
        title: "Enrollment Successful",
        description: "You have been enrolled in the course!",
      });

      fetchLiveCourses();
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast({
        title: "Enrollment Failed",
        description: "Failed to enroll in course",
        variant: "destructive",
      });
    }
  };

  const joinMeeting = (course: LiveCourse) => {
    if (course.meeting_url) {
      window.open(course.meeting_url, '_blank');
    } else {
      toast({
        title: "Meeting Not Available",
        description: "The meeting link is not available yet",
        variant: "destructive",
      });
    }
  };

  const getUniqueSubjects = () => {
    return [...new Set(courses.map(course => course.subject))];
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('live_courses.title') || 'Live Courses'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('live_courses.description') || 'Join interactive live Torah sessions with experienced teachers'}
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {getUniqueSubjects().map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">{course.subject}</Badge>
                    <Badge variant={course.status === 'scheduled' ? 'default' : 'secondary'}>
                      {course.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  {course.description && (
                    <p className="text-gray-600 text-sm">{course.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(course.start_time).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {new Date(course.start_time).toLocaleTimeString()} ({course.duration_minutes} min)
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {course.enrollment_count}/{course.max_participants} enrolled
                    </div>
                    
                    {course.teacher_name && (
                      <div className="text-sm text-gray-600">
                        Teacher: {course.teacher_name}
                      </div>
                    )}

                    {course.price > 0 && (
                      <div className="text-lg font-bold text-green-600">
                        ${(course.price / 100).toFixed(2)}
                      </div>
                    )}

                    <div className="pt-4">
                      {course.is_enrolled ? (
                        <div className="space-y-2">
                          <Button 
                            className="w-full" 
                            onClick={() => joinMeeting(course)}
                            disabled={!course.meeting_url}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Join Meeting
                          </Button>
                          <p className="text-xs text-green-600 text-center">Enrolled</p>
                        </div>
                      ) : (
                        <Button 
                          className="w-full" 
                          onClick={() => enrollInCourse(course.id)}
                          disabled={course.enrollment_count >= course.max_participants}
                        >
                          {course.enrollment_count >= course.max_participants ? 'Full' : 'Enroll Now'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 text-lg">No live courses found matching your criteria.</p>
              <Button className="mt-4" onClick={() => {
                setSearchTerm('');
                setSubjectFilter('all');
                setStatusFilter('all');
              }}>
                Clear Filters
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default LiveCourses;
