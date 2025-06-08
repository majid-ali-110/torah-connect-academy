
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, Video, Calendar, Clock, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Course {
  id: string;
  title: string;
  description: string;
  age_range: string;
  subject: string;
  teacher_id: string;
  price: number;
  max_students: number;
  is_active: boolean;
}

const ChildrenSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('audience', 'children')
        .eq('is_active', true)
        .order('title');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load courses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollment = async (courseId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to enroll in courses',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: courseId,
          student_id: user.id,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Successfully enrolled in the course!',
      });
    } catch (error) {
      console.error('Error enrolling:', error);
      toast({
        title: 'Error',
        description: 'Failed to enroll in course',
        variant: 'destructive',
      });
    }
  };

  const filteredCourses = courses.filter(course => {
    if (activeTab === 'all') return true;
    return course.subject.toLowerCase().includes(activeTab.toLowerCase());
  });

  const subjects = [...new Set(courses.map(c => c.subject))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-blue-900">Children's Torah Learning</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Engaging and age-appropriate Torah education designed to inspire young minds and nurture spiritual growth.
          </p>
        </motion.div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Interactive Learning</h3>
              <p className="text-sm text-gray-600">Engaging lessons with games and activities</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Small Classes</h3>
              <p className="text-sm text-gray-600">Personalized attention for every child</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <Video className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Live Sessions</h3>
              <p className="text-sm text-gray-600">Real-time interaction with teachers</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Progress Tracking</h3>
              <p className="text-sm text-gray-600">Monitor your child's learning journey</p>
            </CardContent>
          </Card>
        </div>

        {/* Course Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            {subjects.slice(0, 5).map(subject => (
              <TabsTrigger key={subject} value={subject}>{subject}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading courses...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <Badge className="bg-blue-100 text-blue-800">
                            Ages {course.age_range}
                          </Badge>
                        </div>
                        <Badge variant="outline">{course.subject}</Badge>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>Max {course.max_students} students</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Weekly</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4">
                          <span className="text-2xl font-bold text-blue-600">
                            ${course.price}
                            <span className="text-sm font-normal text-gray-500">/month</span>
                          </span>
                          <Button 
                            onClick={() => handleEnrollment(course.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Enroll Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChildrenSection;
