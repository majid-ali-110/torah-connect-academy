
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TeacherProfile {
  id: string;
  first_name: string;
  last_name: string;
  bio: string;
  subjects: string[];
  languages: string[];
  audiences: string[];
  location: string;
  experience: string;
  avatar_url?: string;
  availability_status: 'available' | 'busy' | 'offline';
  gender: string;
  hourly_rate?: number;
}

export const useTeacherData = () => {
  const { profile } = useAuth();
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<TeacherProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchTeachers();
    }
  }, [profile]);

  useEffect(() => {
    filterTeachers();
  }, [teachers, searchTerm, subjectFilter, languageFilter, audienceFilter]);

  const fetchTeachers = async () => {
    try {
      console.log('Current user gender:', profile?.gender);
      
      // Fetch teacher profiles
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher');

      const { data, error } = await query;

      if (error) throw error;
      
      // Apply gender-based filtering
      const genderFilteredTeachers = data?.filter(teacher => {
        if (!profile?.gender || !teacher.gender) return true;
        
        // If user is male, show male teachers for men and children
        if (profile.gender === 'male') {
          return teacher.gender === 'male' && 
                 (teacher.audiences?.includes('men') || 
                  teacher.audiences?.includes('adults') || 
                  teacher.audiences?.includes('children'));
        }
        
        // If user is female, show female teachers for women and children
        if (profile.gender === 'female') {
          return teacher.gender === 'female' && 
                 (teacher.audiences?.includes('women') || 
                  teacher.audiences?.includes('adults') || 
                  teacher.audiences?.includes('children'));
        }
        
        return true;
      }) || [];

      console.log('Fetched gender-filtered teachers:', genderFilteredTeachers.length, 'teachers');
      setTeachers(genderFilteredTeachers as TeacherProfile[]);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTeachers = () => {
    let filtered = teachers;

    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        `${teacher.first_name} ${teacher.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subjects?.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (subjectFilter && subjectFilter !== 'all') {
      filtered = filtered.filter(teacher =>
        teacher.subjects?.includes(subjectFilter)
      );
    }

    if (languageFilter && languageFilter !== 'all') {
      filtered = filtered.filter(teacher =>
        teacher.languages?.includes(languageFilter)
      );
    }

    if (audienceFilter && audienceFilter !== 'all') {
      filtered = filtered.filter(teacher =>
        teacher.audiences?.includes(audienceFilter)
      );
    }

    setFilteredTeachers(filtered);
  };

  const getUniqueValues = (field: 'subjects' | 'languages' | 'audiences') => {
    const values = teachers.flatMap(teacher => teacher[field] as string[] || []);
    return [...new Set(values)];
  };

  const getFilteredAudiences = () => {
    if (!profile?.gender) return getUniqueValues('audiences');
    
    const allAudiences = getUniqueValues('audiences');
    
    if (profile.gender === 'male') {
      return allAudiences.filter(audience => 
        ['men', 'adults', 'children'].includes(audience.toLowerCase())
      );
    } else if (profile.gender === 'female') {
      return allAudiences.filter(audience => 
        ['women', 'adults', 'children'].includes(audience.toLowerCase())
      );
    }
    
    return allAudiences;
  };

  const getPageDescription = () => {
    if (profile?.gender === 'male') {
      return 'Showing male teachers for men and children';
    } else if (profile?.gender === 'female') {
      return 'Showing female teachers for women and children';
    }
    return 'Find qualified Torah teachers';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSubjectFilter('all');
    setLanguageFilter('all');
    setAudienceFilter('all');
  };

  return {
    teachers,
    filteredTeachers,
    loading,
    searchTerm,
    setSearchTerm,
    subjectFilter,
    setSubjectFilter,
    languageFilter,
    setLanguageFilter,
    audienceFilter,
    setAudienceFilter,
    getUniqueValues,
    getFilteredAudiences,
    getPageDescription,
    clearFilters,
    profile
  };
};
