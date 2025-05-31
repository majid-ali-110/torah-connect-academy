
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  bio: string;
  subjects: string[];
  languages: string[];
  audiences: string[];
  hourly_rate: number;
  location: string;
  experience: string;
  avatar_url?: string;
  availability_status: 'available' | 'busy' | 'offline';
  gender: string;
}

const FindTeachers = () => {
  const { profile } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
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
      
      // Fetch teachers with same gender as current user (if gender is specified)
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher')
        .not('subjects', 'is', null);

      // Apply gender filter - only show teachers of same gender
      if (profile?.gender) {
        query = query.eq('gender', profile.gender);
      }

      const { data, error } = await query;

      if (error) throw error;
      console.log('Fetched teachers:', data?.length, 'teachers');
      setTeachers(data || []);
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
        teacher.bio?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getUniqueValues = (field: keyof Teacher) => {
    const values = teachers.flatMap(teacher => teacher[field] as string[] || []);
    return [...new Set(values)];
  };

  if (loading) {
    return (
      <Layout>
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Find Your Torah Teacher</h1>
            {profile?.gender && (
              <div className="text-sm text-gray-600">
                Showing {profile.gender} teachers only
              </div>
            )}
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Input
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-2 focus:ring-torah-500 transition-all"
            />
            
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {getUniqueValues('subjects').map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {getUniqueValues('languages').map(language => (
                  <SelectItem key={language} value={language}>{language}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={audienceFilter} onValueChange={setAudienceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Audiences</SelectItem>
                {getUniqueValues('audiences').map(audience => (
                  <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Teachers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                className="transition-all duration-300"
              >
                <Card className="h-full cursor-pointer overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={teacher.avatar_url} alt={`${teacher.first_name} ${teacher.last_name}`} />
                          <AvatarFallback>
                            {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          teacher.availability_status === 'available' ? 'bg-green-500 animate-pulse' :
                          teacher.availability_status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{teacher.first_name} {teacher.last_name}</h3>
                        <p className="text-sm text-gray-600">{teacher.location}</p>
                        <p className="text-sm font-medium text-torah-600">${teacher.hourly_rate}/hour</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">{teacher.bio}</p>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Subjects:</p>
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects?.slice(0, 3).map(subject => (
                            <Badge key={subject} variant="secondary" className="text-xs bg-torah-100 text-torah-700">
                              {subject}
                            </Badge>
                          ))}
                          {teacher.subjects && teacher.subjects.length > 3 && (
                            <Badge variant="secondary" className="text-xs">+{teacher.subjects.length - 3}</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Languages:</p>
                        <div className="flex flex-wrap gap-1">
                          {teacher.languages?.map(language => (
                            <Badge key={language} variant="outline" className="text-xs">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <Button asChild className="w-full bg-torah-500 hover:bg-torah-600 transition-colors">
                        <Link to={`/teachers/${teacher.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {filteredTeachers.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No teachers found matching your criteria.</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSubjectFilter('all');
                  setLanguageFilter('all');
                  setAudienceFilter('all');
                }}
                className="mt-4"
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default FindTeachers;
