
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

// Mock teacher data filtered by gender
const getMockTeachers = (userGender?: string) => {
  const allTeachers = [
    {
      id: 1,
      name: 'Rabbi David',
      subjects: ['Torah', 'Talmud', 'Hebrew'],
      audiences: ['Adults', 'Children'],
      languages: ['English', 'Hebrew'],
      hourlyRate: 40,
      rating: 4.9,
      reviewCount: 124,
      availability: 'Mon - Thu',
      gender: 'male',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
    },
    {
      id: 2,
      name: 'Sarah Cohen',
      subjects: ['Torah', 'Jewish History', 'Holidays'],
      audiences: ['Women', 'Children'],
      languages: ['English', 'French'],
      hourlyRate: 35,
      rating: 4.8,
      reviewCount: 89,
      availability: 'Tue - Fri',
      gender: 'female',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
    },
    {
      id: 3,
      name: 'Rabbi Moshe',
      subjects: ['Talmud', 'Kabbalah', 'Ethics'],
      audiences: ['Adults', 'Seniors'],
      languages: ['English', 'Hebrew', 'Yiddish'],
      hourlyRate: 45,
      rating: 5.0,
      reviewCount: 156,
      availability: 'Sun - Thu',
      gender: 'male',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
    },
    {
      id: 4,
      name: 'Leah Goldstein',
      subjects: ['Women in Judaism', 'Torah', 'Holidays'],
      audiences: ['Women'],
      languages: ['English', 'Hebrew'],
      hourlyRate: 38,
      rating: 4.7,
      reviewCount: 72,
      availability: 'Mon, Wed, Thu',
      gender: 'female',
      image: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
    },
    {
      id: 5,
      name: 'Rabbi Aaron',
      subjects: ['Torah', 'Children Studies'],
      audiences: ['Children'],
      languages: ['English', 'Hebrew'],
      hourlyRate: 30,
      rating: 4.8,
      reviewCount: 95,
      availability: 'All days',
      gender: 'male',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
    },
    {
      id: 6,
      name: 'Miriam Klein',
      subjects: ['Torah', 'Children Studies'],
      audiences: ['Children'],
      languages: ['English', 'French'],
      hourlyRate: 32,
      rating: 4.9,
      reviewCount: 87,
      availability: 'Mon - Fri',
      gender: 'female',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
    }
  ];

  // Filter based on user gender: same gender + children's teachers
  if (!userGender) return allTeachers;
  
  return allTeachers.filter(teacher => 
    teacher.gender === userGender || teacher.audiences.includes('Children')
  );
};

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
  teachers: any[]
}) => {
  const isMobile = useIsMobile();
  
  const subjectOptions = [...new Set(teachers.flatMap(t => t.subjects))];
  const audienceOptions = [...new Set(teachers.flatMap(t => t.audiences))];
  const languageOptions = [...new Set(teachers.flatMap(t => t.languages))];
  
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
                  {audienceOptions.map((audience) => (
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
const TeacherCard = ({ teacher }: { teacher: any }) => {
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
                <AvatarImage src={teacher.image} alt={teacher.name} />
                <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="p-4 md:p-6 flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{teacher.name}</h3>
                  <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    Available: {teacher.availability}
                    <Badge variant="outline" className="text-xs">
                      {teacher.gender === 'male' ? '👨‍🏫' : '👩‍🏫'} {teacher.gender}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-torah-600">${teacher.hourlyRate}/hr</div>
                  <div className="text-sm flex items-center justify-end">
                    <span className="text-yellow-500">★</span> 
                    <span className="ml-1">{teacher.rating} ({teacher.reviewCount})</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {teacher.subjects.map((subject: string) => (
                    <Badge key={subject} variant="secondary" className="bg-torah-100 text-torah-700">{subject}</Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {teacher.audiences.map((audience: string) => (
                    <Badge key={audience} variant="outline" className="text-gray-600">{audience}</Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {teacher.languages.map((language: string) => (
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
                onClick={() => window.location.href = `/teachers/${teacher.id}`}
              >
                Book Lesson
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
  const { profile } = useAuth();
  const searchQuery = searchParams.get('q') || '';
  const [filters, setFilters] = useState({});
  const [teachers, setTeachers] = useState<any[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useIsMobile();

  // Initialize teachers based on user gender
  useEffect(() => {
    const genderFilteredTeachers = getMockTeachers(profile?.gender);
    setTeachers(genderFilteredTeachers);
  }, [profile?.gender]);

  // Filter teachers based on search query and filters
  useEffect(() => {
    let results = teachers;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(teacher => 
        teacher.name.toLowerCase().includes(query) ||
        teacher.subjects.some((subj: string) => subj.toLowerCase().includes(query))
      );
    }
    
    // Apply other filters (subjects, audiences, languages)
    Object.entries(filters).forEach(([filterType, selectedValues]) => {
      if (Object.values(selectedValues).some(v => v)) {
        results = results.filter(teacher => {
          const teacherValues = teacher[filterType.toLowerCase()];
          if (!teacherValues) return true;
          
          return Object.entries(selectedValues).some(([value, isSelected]) => {
            return isSelected && teacherValues.includes(value);
          });
        });
      }
    });
    
    setFilteredTeachers(results);
  }, [searchQuery, filters, teachers]);

  const getGenderDisplayText = () => {
    if (!profile?.gender) return 'all available teachers';
    
    if (profile.gender === 'male') {
      return 'male teachers and children\'s teachers only';
    } else {
      return 'female teachers and children\'s teachers only';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">
          {searchQuery ? `Search results for "${searchQuery}"` : 'All Teachers'}
        </h1>
        <div className="text-sm text-gray-600">
          Showing {getGenderDisplayText()}
        </div>
      </div>
      
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
