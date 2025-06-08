
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface TeacherWithServices {
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
  availability_status: string;
  gender: string;
  hourly_rate?: number;
}

// Filter panel component
const FilterPanel = ({ 
  isOpen, 
  toggleOpen, 
  filters, 
  setFilters,
  teachers 
}: { 
  isOpen: boolean, 
  toggleOpen: () => void, 
  filters: any, 
  setFilters: (filters: any) => void,
  teachers: TeacherWithServices[]
}) => {
  const isMobile = useIsMobile();
  const { profile } = useAuth();
  
  const subjectOptions = [...new Set(teachers.flatMap(teacher => teacher.subjects || []))];
  
  const getFilteredAudiences = () => {
    const allAudiences = [...new Set(teachers.flatMap(teacher => teacher.audiences || []))];
    
    if (profile?.gender === 'male') {
      return allAudiences.filter(audience => 
        ['men', 'adults', 'children'].includes(audience.toLowerCase())
      );
    } else if (profile?.gender === 'female') {
      return allAudiences.filter(audience => 
        ['women', 'adults', 'children'].includes(audience.toLowerCase())
      );
    }
    
    return allAudiences;
  };
  
  const languageOptions = [...new Set(teachers.flatMap(teacher => teacher.languages || []))];
  
  const handleFilterChange = (category: string, value: string) => {
    setFilters({
      ...filters,
      [category]: {
        ...filters[category],
        [value]: !filters[category]?.[value]
      }
    });
  };

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      {isMobile && (
        <div className="w-full mb-4">
          <Button 
            onClick={toggleOpen} 
            variant="outline" 
            className="w-full flex items-center justify-between"
          >
            <span className="flex items-center">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      )}
      
      {/* Filter Panel Content */}
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.div
            initial={isMobile ? { height: 0, opacity: 0 } : { opacity: 1 }}
            animate={isMobile ? { height: 'auto', opacity: 1 } : { opacity: 1 }}
            exit={isMobile ? { height: 0, opacity: 0 } : { opacity: 1 }}
            className={`${isMobile ? "overflow-hidden" : ""} bg-white rounded-lg border p-4`}
          >
            <div className="space-y-6">
              {/* Subject Filters */}
              <div>
                <h3 className="font-semibold mb-3">Subject</h3>
                <div className="space-y-2">
                  {subjectOptions.map((subject) => (
                    <div key={subject} className="flex items-center">
                      <Checkbox 
                        id={`subject-${subject}`} 
                        checked={filters.subjects?.[subject] || false}
                        onCheckedChange={() => handleFilterChange('subjects', subject)}
                        className="mr-2 data-[state=checked]:bg-torah-500"
                      />
                      <label htmlFor={`subject-${subject}`} className="text-sm cursor-pointer">
                        {subject}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Audience Filters */}
              <div>
                <h3 className="font-semibold mb-3">Audience</h3>
                <div className="space-y-2">
                  {getFilteredAudiences().map((audience) => (
                    <div key={audience} className="flex items-center">
                      <Checkbox 
                        id={`audience-${audience}`} 
                        checked={filters.audiences?.[audience] || false}
                        onCheckedChange={() => handleFilterChange('audiences', audience)}
                        className="mr-2 data-[state=checked]:bg-torah-500"
                      />
                      <label htmlFor={`audience-${audience}`} className="text-sm cursor-pointer">
                        {audience}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Language Filters */}
              <div>
                <h3 className="font-semibold mb-3">Language</h3>
                <div className="space-y-2">
                  {languageOptions.map((language) => (
                    <div key={language} className="flex items-center">
                      <Checkbox 
                        id={`language-${language}`} 
                        checked={filters.languages?.[language] || false}
                        onCheckedChange={() => handleFilterChange('languages', language)}
                        className="mr-2 data-[state=checked]:bg-torah-500"
                      />
                      <label htmlFor={`language-${language}`} className="text-sm cursor-pointer">
                        {language}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => setFilters({})} 
                variant="outline" 
                className="w-full mt-4"
              >
                Clear All Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Teacher card component
const TeacherCard = ({ teacher }: { teacher: TeacherWithServices }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-all">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="p-4 md:p-6 flex-shrink-0">
              <Avatar className="w-20 h-20 rounded-lg">
                <AvatarImage src={teacher.avatar_url} alt={`${teacher.first_name} ${teacher.last_name}`} />
                <AvatarFallback>{teacher.first_name?.[0]}{teacher.last_name?.[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div className="p-4 md:p-6 flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{teacher.first_name} {teacher.last_name}</h3>
                  <div className="text-sm text-muted-foreground mb-2">
                    {teacher.location}
                  </div>
                </div>
                <div className="text-right">
                  {teacher.hourly_rate && (
                    <div className="font-semibold text-torah-600">
                      ${teacher.hourly_rate}/hr
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{teacher.bio}</p>
              
              <div className="mt-2 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {teacher.subjects?.slice(0, 3).map((subject) => (
                    <Badge key={subject} variant="secondary" className="bg-torah-100 text-torah-700">
                      {subject}
                    </Badge>
                  ))}
                  {teacher.subjects && teacher.subjects.length > 3 && (
                    <Badge variant="secondary" className="text-xs">+{teacher.subjects.length - 3}</Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {teacher.audiences?.map((audience: string) => (
                    <Badge key={audience} variant="outline" className="text-gray-600">{audience}</Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {teacher.languages?.map((language: string) => (
                    <Badge key={language} variant="outline" className="text-blue-600 border-blue-200">{language}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 pb-4 md:px-6 md:pb-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button 
                className="w-full bg-torah-500 hover:bg-torah-600"
                asChild
              >
                <Link to={`/teacher/${teacher.id}`}>View Profile</Link>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [filters, setFilters] = useState({});
  const [teachers, setTeachers] = useState<TeacherWithServices[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<TeacherWithServices[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      fetchTeachers();
    }
  }, [profile]);

  const fetchTeachers = async () => {
    try {
      console.log('Current user gender:', profile?.gender);
      
      // Fetch teachers from profiles table
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
      setTeachers(genderFilteredTeachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter teachers based on search query and filters
  useEffect(() => {
    let results = teachers;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(teacher => 
        `${teacher.first_name} ${teacher.last_name}`.toLowerCase().includes(query) ||
        teacher.bio?.toLowerCase().includes(query) ||
        teacher.subjects?.some(subject => 
          subject.toLowerCase().includes(query)
        )
      );
    }
    
    // Apply other filters (subjects, audiences, languages)
    Object.entries(filters).forEach(([filterType, selectedValues]) => {
      if (Object.values(selectedValues).some(v => v)) {
        results = results.filter(teacher => {
          if (filterType === 'subjects') {
            return Object.entries(selectedValues).some(([value, isSelected]) => {
              return isSelected && teacher.subjects?.includes(value);
            });
          } else if (filterType === 'audiences') {
            return Object.entries(selectedValues).some(([value, isSelected]) => {
              return isSelected && teacher.audiences?.includes(value);
            });
          } else if (filterType === 'languages') {
            return Object.entries(selectedValues).some(([value, isSelected]) => {
              return isSelected && teacher.languages?.includes(value);
            });
          }
          return true;
        });
      }
    });
    
    setFilteredTeachers(results);
  }, [searchQuery, filters, teachers]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">
        {searchQuery ? `Search results for "${searchQuery}"` : 'All Teachers'}
      </h1>
      
      {profile?.gender && (
        <div className="text-sm text-gray-600 mb-4">
          Showing {profile.gender} teachers for {profile.gender === 'male' ? 'men and children' : 'women and children'}
        </div>
      )}
      
      <div className="mb-6">
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Refine your search..." 
            defaultValue={searchQuery}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <div className={`${isMobile ? 'w-full' : 'w-80 flex-shrink-0'}`}>
          <FilterPanel 
            isOpen={isFilterOpen} 
            toggleOpen={() => setIsFilterOpen(!isFilterOpen)} 
            filters={filters} 
            setFilters={setFilters}
            teachers={teachers}
          />
        </div>
        
        {/* Results */}
        <div className="flex-grow">
          {filteredTeachers.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No teachers found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredTeachers.map(teacher => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
