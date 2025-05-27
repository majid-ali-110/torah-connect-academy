
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
  description: string;
  age_range: string;
  price: number;
  image_url?: string;
  subject: string;
  teacher: {
    first_name: string;
    last_name: string;
  };
}

const ChildrenCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildrenCourses();
  }, []);

  const fetchChildrenCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:profiles!courses_teacher_id_fkey(first_name, last_name)
        `)
        .eq('audience', 'Children')
        .eq('is_active', true);

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching children courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card>
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
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
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Children's Torah Learning
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Engaging and interactive Torah courses designed specifically for young learners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, rotateY: -10 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  rotateY: 5,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                }}
                className="group perspective-1000"
              >
                <Card className="h-full overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 hover:border-purple-300 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    {course.image_url ? (
                      <img 
                        src={course.image_url} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center">
                        <span className="text-white text-6xl">📚</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-pink-500 text-white">
                        Ages {course.age_range}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{course.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Subject:</span>
                        <Badge variant="outline" className="text-purple-600 border-purple-200">
                          {course.subject}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Teacher:</span>
                        <span className="text-sm font-medium">
                          {course.teacher.first_name} {course.teacher.last_name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Price:</span>
                        <span className="text-lg font-bold text-purple-600">${course.price}</span>
                      </div>
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white relative overflow-hidden group"
                      >
                        <span className="relative z-10">Join Course</span>
                        <motion.div
                          className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                          initial={{ scale: 0, rotate: 45 }}
                          whileHover={{ scale: 1.5, rotate: 45 }}
                          transition={{ duration: 0.3 }}
                        />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {courses.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-2xl font-bold mb-4">Coming Soon!</h3>
              <p className="text-gray-600">
                We're preparing amazing Torah courses for children. Check back soon!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default ChildrenCourses;
