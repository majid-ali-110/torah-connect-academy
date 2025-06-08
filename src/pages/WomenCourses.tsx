
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import WomenCourseCard from '@/components/courses/WomenCourseCard';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  price: number;
  teacher: {
    id: string;
    first_name: string;
    last_name: string;
    gender: string;
    audiences: string[];
  };
  teacher_services: {
    hourly_rate: number;
  }[];
}

const WomenCourses = () => {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchCourses();
    }
  }, [profile]);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, subjectFilter, audienceFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      console.log('Current user gender:', profile?.gender);
      
      // Fetch courses with teachers of same gender or who teach children
      let query = supabase
        .from('courses')
        .select(`
          *,
          teacher:profiles!courses_teacher_id_fkey(
            id,
            first_name,
            last_name,
            gender,
            audiences
          ),
          teacher_services(
            hourly_rate
          )
        `)
        .eq('is_active', true);

      const { data, error } = await query;

      if (error) throw error;
      
      // Filter courses based on gender compatibility
      const genderCompatibleCourses = data?.filter(course => {
        if (!course.teacher || !profile?.gender) return true;
        
        // Show if teacher is same gender as user
        if (course.teacher.gender === profile.gender) return true;
        
        // Show if teacher teaches children and user's profile allows it
        if (course.teacher.audiences?.includes('children')) return true;
        
        return false;
      }) || [];

      console.log('Fetched gender-compatible courses:', genderCompatibleCourses.length, 'courses');
      setCourses(genderCompatibleCourses);
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

    if (audienceFilter !== 'all') {
      filtered = filtered.filter(course =>
        course.teacher?.audiences?.includes(audienceFilter)
      );
    }

    setFilteredCourses(filtered);
  };

  const getUniqueSubjects = () => {
    const subjects = courses.map(course => course.subject);
    return [...new Set(subjects)];
  };

  const getUniqueAudiences = () => {
    const audiences = courses.flatMap(course => course.teacher?.audiences || []);
    return [...new Set(audiences)];
  };

  const getPageTitle = () => {
    if (profile?.gender === 'male') {
      return 'Torah Studies for Men';
    } else if (profile?.gender === 'female') {
      return 'Torah Studies for Women';
    }
    return 'Torah Studies';
  };

  const getPageDescription = () => {
    if (profile?.gender === 'male') {
      return 'Empowering Jewish men through meaningful Torah study and spiritual growth';
    } else if (profile?.gender === 'female') {
      return 'Empowering Jewish women through meaningful Torah study and spiritual growth';
    }
    return 'Meaningful Torah study and spiritual growth for all';
  };

  // Transform courses to match WomenCourseCard expected format
  const transformedCourses = filteredCourses.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description || '',
    schedule: 'Contact for schedule', // Default value since we don't have schedule in DB
    instructor: `${course.teacher?.first_name || ''} ${course.teacher?.last_name || ''}`.trim(),
    rating: 4.5, // Default rating since we don't have ratings in DB
    enrolled: 0, // Default since we don't have enrollment count
    price: course.teacher_services?.[0]?.hourly_rate || course.price || 0,
    category: course.subject,
    level: 'Intermediate' as const // Default level since we don't have levels in DB
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
            {getPageTitle()}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {getPageDescription()}
          </p>
          {profile?.gender && (
            <div className="text-sm text-gray-500 mt-2">
              Showing courses for {profile.gender} students
            </div>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses, instructors, topics..."
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
            <Select value={audienceFilter} onValueChange={setAudienceFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Audiences</SelectItem>
                {getUniqueAudiences().map(audience => (
                  <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transformedCourses.map((course, index) => (
            <WomenCourseCard
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

export default WomenCourses;
