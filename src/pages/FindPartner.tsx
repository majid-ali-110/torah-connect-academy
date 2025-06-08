
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Users, MessageCircle, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import StudyPartnerCard from '@/components/partner/StudyPartnerCard';

interface StudyPartner {
  id: string;
  name: string;
  subjects: string[];
  level: string;
  availability: string;
  studyGoals: string;
  rating: number;
  avatar?: string;
  location: string;
  languages: string[];
}

const FindPartner = () => {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [studyPartners, setStudyPartners] = useState<any[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<StudyPartner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchStudyPartners();
    }
  }, [profile]);

  useEffect(() => {
    filterPartners();
  }, [studyPartners, searchTerm, levelFilter, subjectFilter]);

  const fetchStudyPartners = async () => {
    try {
      console.log('Current user gender:', profile?.gender);
      
      // Since we don't have a study_partner_requests table, let's use profiles
      // Filter by same gender and exclude current user
      let query = supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          avatar_url,
          location,
          languages,
          gender,
          subjects,
          bio,
          learning_level
        `)
        .eq('role', 'student')
        .neq('id', profile?.id); // Exclude current user

      // Apply gender filter - only show partners of same gender
      if (profile?.gender) {
        query = query.eq('gender', profile.gender);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      console.log('Fetched study partners:', data?.length, 'partners');
      setStudyPartners(data || []);
    } catch (error) {
      console.error('Error fetching study partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPartners = () => {
    // Transform data to match the StudyPartner interface
    const transformedPartners: StudyPartner[] = studyPartners.map(partner => ({
      id: partner.id,
      name: `${partner.first_name} ${partner.last_name}`,
      subjects: partner.subjects || [],
      level: partner.learning_level || 'Intermediate',
      availability: 'Flexible', // Default since we don't have availability data
      studyGoals: partner.bio || 'Looking for a study partner',
      rating: 4.5, // Default rating since we don't have ratings yet
      avatar: partner.avatar_url,
      location: partner.location || 'Not specified',
      languages: partner.languages || ['English']
    }));

    let filtered = transformedPartners;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(partner =>
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.subjects.some(subject => 
          subject.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        partner.studyGoals.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(partner => 
        partner.level.toLowerCase() === levelFilter
      );
    }

    // Apply subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(partner =>
        partner.subjects.some(subject => 
          subject.toLowerCase().includes(subjectFilter.toLowerCase())
        )
      );
    }

    setFilteredPartners(filtered);
  };

  const getUniqueSubjects = () => {
    const subjects = studyPartners.flatMap(partner => partner.subjects || []);
    return [...new Set(subjects)];
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white rounded-lg shadow p-6">
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
              </div>
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
            Find Your Study Partner
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with fellow learners who share your passion for Torah study
          </p>
          {profile?.gender && (
            <div className="text-sm text-gray-600 mt-2">
              Showing {profile.gender} study partners only
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center p-6 bg-blue-50 rounded-lg"
          >
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{studyPartners.length}+</div>
            <div className="text-gray-600">Active Partners</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center p-6 bg-green-50 rounded-lg"
          >
            <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">1,200+</div>
            <div className="text-gray-600">Study Sessions</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center p-6 bg-purple-50 rounded-lg"
          >
            <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </motion.div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search partners by name, subject, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
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
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner, index) => (
            <div key={partner.id}>
              <StudyPartnerCard
                partner={partner}
                index={index}
              />
            </div>
          ))}
        </div>

        {filteredPartners.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No study partners found matching your criteria.</p>
            <Button className="mt-4" onClick={() => {
              setSearchTerm('');
              setLevelFilter('all');
              setSubjectFilter('all');
            }}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default FindPartner;
