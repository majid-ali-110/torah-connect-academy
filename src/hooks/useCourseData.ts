
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
    hourly_rate?: number;
  } | null;
}

interface TransformedCourse {
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

export const useCourseData = () => {
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
      
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:profiles!courses_teacher_id_fkey(
            id,
            first_name,
            last_name,
            gender,
            audiences,
            hourly_rate
          )
        `)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching courses:', error);
        return;
      }

      const genderCompatibleCourses = data?.filter(course => {
        if (!course.teacher || !profile?.gender) return true;
        
        if (course.teacher.gender === profile.gender) return true;
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

  const transformedCourses: TransformedCourse[] = filteredCourses.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description || '',
    schedule: 'Contact for schedule',
    instructor: `${course.teacher?.first_name || ''} ${course.teacher?.last_name || ''}`.trim(),
    rating: 4.5,
    enrolled: 0,
    price: course.teacher?.hourly_rate || course.price || 0,
    category: course.subject,
    level: 'Intermediate' as const
  }));

  return {
    transformedCourses,
    loading,
    searchTerm,
    setSearchTerm,
    subjectFilter,
    setSubjectFilter,
    audienceFilter,
    setAudienceFilter,
    getUniqueSubjects,
    getUniqueAudiences,
    getPageTitle,
    getPageDescription,
    profile
  };
};
