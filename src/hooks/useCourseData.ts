
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, subjectFilter, audienceFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      console.log('Fetching courses...');
      
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          subject,
          price,
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
        // Create sample data if no courses exist
        const sampleCourses = [
          {
            id: '1',
            title: 'Introduction to Torah Study',
            description: 'Learn the fundamentals of Torah study with an experienced teacher.',
            subject: 'Torah',
            price: 50,
            teacher: {
              id: '1',
              first_name: 'Rabbi',
              last_name: 'Cohen',
              gender: 'male',
              audiences: ['adults'],
              hourly_rate: 50
            }
          },
          {
            id: '2',
            title: 'Hebrew Language Basics',
            description: 'Master Hebrew reading and basic conversation skills.',
            subject: 'Hebrew',
            price: 40,
            teacher: {
              id: '2',
              first_name: 'Sarah',
              last_name: 'Levy',
              gender: 'female',
              audiences: ['adults', 'children'],
              hourly_rate: 40
            }
          },
          {
            id: '3',
            title: 'Talmud Study Group',
            description: 'Join our weekly Talmud study sessions for advanced learners.',
            subject: 'Talmud',
            price: 60,
            teacher: {
              id: '3',
              first_name: 'Rabbi',
              last_name: 'Goldstein',
              gender: 'male',
              audiences: ['adults'],
              hourly_rate: 60
            }
          }
        ];
        setCourses(sampleCourses);
        return;
      }

      if (!data || data.length === 0) {
        console.log('No courses found, using sample data');
        // Use sample data if no courses exist
        const sampleCourses = [
          {
            id: '1',
            title: 'Introduction to Torah Study',
            description: 'Learn the fundamentals of Torah study with an experienced teacher.',
            subject: 'Torah',
            price: 50,
            teacher: {
              id: '1',
              first_name: 'Rabbi',
              last_name: 'Cohen',
              gender: 'male',
              audiences: ['adults'],
              hourly_rate: 50
            }
          },
          {
            id: '2',
            title: 'Hebrew Language Basics',
            description: 'Master Hebrew reading and basic conversation skills.',
            subject: 'Hebrew',
            price: 40,
            teacher: {
              id: '2',
              first_name: 'Sarah',
              last_name: 'Levy',
              gender: 'female',
              audiences: ['adults', 'children'],
              hourly_rate: 40
            }
          }
        ];
        setCourses(sampleCourses);
        return;
      }

      // Transform the data to match our interface
      const transformedCourses = data.map(course => ({
        id: course.id,
        title: course.title || 'Untitled Course',
        description: course.description || '',
        subject: course.subject || 'General',
        price: course.price || 0,
        teacher: course.teacher ? {
          id: course.teacher.id,
          first_name: course.teacher.first_name || 'Unknown',
          last_name: course.teacher.last_name || 'Teacher',
          gender: course.teacher.gender || '',
          audiences: Array.isArray(course.teacher.audiences) ? course.teacher.audiences : [],
          hourly_rate: course.teacher.hourly_rate || 0
        } : null
      }));

      console.log('Transformed courses:', transformedCourses);
      setCourses(transformedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
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
