
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import ChildrenCourseCard from '@/components/courses/ChildrenCourseCard';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  price: number;
  age_range: string;
  teacher: {
    id: string;
    first_name: string;
    last_name: string;
    gender: string;
    audiences: string[];
  } | null;
  teacher_services: {
    hourly_rate: number;
  }[] | null;
}

const ChildrenCourses = () => {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchCourses();
    }
  }, [profile]);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, subjectFilter, ageFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      console.log('Fetching children courses for user gender:', profile?.gender);
      
      // Fetch courses specifically for children or general audience
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:profiles!courses_teacher_id_fkey(
            id,
            first_name,
            last_name,
            gender,
            audiences
          )
        `)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching courses:', error);
        return;
      }

      // Fetch teacher services separately to avoid query issues
      const courseIds = data?.map(course => course.teacher_id) || [];
      const { data: servicesData, error: servicesError } = await supabase
        .from('teacher_services')
        .select('teacher_id, hourly_rate')
        .in('teacher_id', courseIds);

      if (servicesError) {
        console.error('Error fetching teacher services:', servicesError);
      }
      
      // Filter courses that are suitable for children and match gender requirements
      const childrenCompatibleCourses = data?.filter(course => {
        if (!course.teacher) return false;
        
        // Must include children in audiences or have age_range specified
        const isForChildren = course.teacher.audiences?.includes('children') || 
                             course.age_range;
        
        if (!isForChildren) return false;
        
        // If user has a gender preference, respect it
        if (profile?.gender && course.teacher.gender) {
          return course.teacher.gender === profile.gender || 
                 course.teacher.audiences?.includes('children');
        }
        
        return true;
      }) || [];

      // Combine courses with teacher services
      const coursesWithServices = childrenCompatibleCourses.map(course => ({
        ...course,
        teacher_services: servicesData?.filter(service => service.teacher_id === course.teacher_id) || []
      }));

      console.log('Fetched children-compatible courses:', coursesWithServices.length, 'courses');
      setCourses(coursesWithServices);
    } catch (error) {
      console.error('Error fetching courses:', error);
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
        course.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${course.teacher?.first_name} ${course.teacher?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(course =>
        course.subject.toLowerCase().includes(subjectFilter.toLowerCase())
      );
    }

    if (ageFilter !== 'all') {
      filtered = filtered.filter(course =>
        course.age_range?.includes(ageFilter) || !course.age_range
      );
    }

    setFilteredCourses(filtered);
  };

  const getUniqueSubjects = () => {
    const subjects = courses.map(course => course.subject);
    return [...new Set(subjects)];
  };

  // Transform courses to match ChildrenCourseCard expected format
  const transformedCourses = filteredCourses.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description || '',
    ageRange: course.age_range || '5-12',
    duration: '45 min', // Default duration
    instructor: `${course.teacher?.first_name || ''} ${course.teacher?.last_name || ''}`.trim(),
    rating: 4.5, // Default rating
    enrolled: 0, // Default enrolled count
    price: course.teacher_services?.[0]?.hourly_rate || course.price || 0,
    image: '/placeholder.svg', // Default image
    level: 'Beginner' as const // Default level
  }));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Torah Courses for Children
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nurture your child's Jewish learning with engaging, age-appropriate Torah courses
          </p>
          {profile?.gender && (
            <div className="text-sm text-gray-500 mt-2">
              Showing courses compatible with {profile.gender} family preferences
            </div>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses, instructors..."
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
            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Age Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="3-6">3-6 years</SelectItem>
                <SelectItem value="7-12">7-12 years</SelectItem>
                <SelectItem value="13-17">13-17 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transformedCourses.map((course, index) => (
            <ChildrenCourseCard
              key={course.id}
              course={course}
              index={index}
            />
          ))}
        </div>

        {transformedCourses.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ChildrenCourses;
