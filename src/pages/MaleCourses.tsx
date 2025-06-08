
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, User, Calendar, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MaleCourse {
  id: string;
  title: string;
  description: string;
  schedule: string;
  instructor: string;
  rating: number;
  enrolled: number;
  price: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

const MaleCourses = () => {
  const { t } = useLanguage();
  const [courses, setCourses] = useState<MaleCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<MaleCourse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaleCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, categoryFilter]);

  const fetchMaleCourses = async () => {
    try {
      // Fetch courses specifically for male audience
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('audience', 'male')
        .eq('is_active', true);

      if (error) throw error;

      // Transform the data to match our interface
      const transformedCourses = (data || []).map(course => ({
        id: course.id,
        title: course.title,
        description: course.description || '',
        schedule: 'Flexible scheduling available',
        instructor: 'Qualified instructor',
        rating: 4.5 + Math.random() * 0.5, // Mock rating
        enrolled: Math.floor(Math.random() * 50) + 10, // Mock enrollment
        price: course.price / 100, // Convert from cents
        category: course.subject,
        level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)] as 'Beginner' | 'Intermediate' | 'Advanced'
      }));

      setCourses(transformedCourses);
    } catch (error) {
      console.error('Error fetching male courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(course => course.category === categoryFilter);
    }

    setFilteredCourses(filtered);
  };

  const getUniqueCategories = () => {
    return [...new Set(courses.map(course => course.category))];
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
              Male Torah Studies
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive Torah learning programs designed specifically for men
            </p>
          </div>

          {/* Search and Filter */}
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
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {getUniqueCategories().map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <Badge variant={course.level === 'Beginner' ? 'default' : course.level === 'Intermediate' ? 'secondary' : 'destructive'}>
                        {course.level}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <Badge variant="outline">{course.category}</Badge>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{course.schedule}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                    
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Instructor:</span> {course.instructor}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{course.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{course.enrolled} enrolled</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">${course.price}</span>
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                        Enroll Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredCourses.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default MaleCourses;
