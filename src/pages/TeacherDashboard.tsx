
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Calendar, DollarSign, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ServiceCreationModal from '@/components/teacher/ServiceCreationModal';

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  audience: string;
  price: number;
  max_students: number;
  is_active: boolean;
  created_at: string;
}

const TeacherDashboard = () => {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showServiceModal, setShowServiceModal] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      fetchCourses();
    }
  }, [profile?.id]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('teacher_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceCreated = () => {
    fetchCourses();
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
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
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {profile?.first_name}!
              </h1>
              <p className="text-gray-600 mt-2">Manage your teaching services and students</p>
            </div>
            <Button
              onClick={() => setShowServiceModal(true)}
              className="bg-torah-500 hover:bg-torah-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Service
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-torah-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Services</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {courses.filter(course => course.is_active).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-xs text-gray-500">lessons</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">$0</p>
                    <p className="text-xs text-gray-500">this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Teaching Services</h2>
            
            {courses.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No services created yet</h3>
                  <p className="text-gray-600 mb-6">
                    Create your first teaching service to start connecting with students
                  </p>
                  <Button 
                    onClick={() => setShowServiceModal(true)}
                    className="bg-torah-500 hover:bg-torah-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Service
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <Badge variant={course.is_active ? "default" : "secondary"}>
                            {course.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {course.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Subject:</span>
                            <Badge variant="outline" className="text-xs">
                              {course.subject}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Audience:</span>
                            <Badge variant="outline" className="text-xs">
                              {course.audience}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Price:</span>
                            <span className="text-sm font-medium">
                              ${(course.price / 100).toFixed(0)}/hour
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Max Students:</span>
                            <span className="text-sm">{course.max_students}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                          <Button variant="outline" className="w-full">
                            Manage Service
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <ServiceCreationModal
          isOpen={showServiceModal}
          onClose={() => setShowServiceModal(false)}
          teacherId={profile?.id || ''}
          onServiceCreated={handleServiceCreated}
        />
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
