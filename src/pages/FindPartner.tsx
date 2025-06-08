
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Users, MessageCircle, Heart, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import StudyPartnerCard from '@/components/partner/StudyPartnerCard';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface StudyPartnerWithProfile {
  id: string;
  user_id: string;
  subjects: string[];
  study_goals: string;
  availability: string;
  preferred_level: string;
  created_at: string;
  profile: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    location?: string;
    languages?: string[];
    gender: string;
  };
}

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
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [studyPartners, setStudyPartners] = useState<StudyPartnerWithProfile[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<StudyPartner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [hasActiveRequest, setHasActiveRequest] = useState(false);
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [newRequest, setNewRequest] = useState({
    subjects: [] as string[],
    availability: '',
    preferred_level: 'intermediate',
    study_goals: ''
  });

  useEffect(() => {
    if (profile) {
      fetchStudyPartners();
      checkActiveRequest();
    }
  }, [profile]);

  useEffect(() => {
    filterPartners();
  }, [studyPartners, searchTerm, levelFilter, subjectFilter]);

  const checkActiveRequest = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('study_partner_requests')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      setHasActiveRequest(!!data);
    } catch (error) {
      console.log('No active request found');
    }
  };

  const fetchStudyPartners = async () => {
    try {
      console.log('Current user gender:', profile?.gender);
      
      let query = supabase
        .from('study_partner_requests')
        .select(`
          *,
          profile:profiles!inner(
            id,
            first_name,
            last_name,
            avatar_url,
            location,
            languages,
            gender
          )
        `)
        .eq('is_active', true)
        .neq('user_id', profile?.id);

      if (profile?.gender) {
        query = query.eq('profile.gender', profile.gender);
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

  const createStudyPartnerRequest = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a study partner request",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('study_partner_requests')
        .insert({
          user_id: user.id,
          subjects: newRequest.subjects,
          availability: newRequest.availability,
          preferred_level: newRequest.preferred_level,
          study_goals: newRequest.study_goals
        });

      if (error) throw error;

      toast({
        title: "Request Created",
        description: "Your study partner request has been created successfully!",
      });

      setHasActiveRequest(true);
      setShowCreateRequest(false);
      setNewRequest({
        subjects: [],
        availability: '',
        preferred_level: 'intermediate',
        study_goals: ''
      });
      
      fetchStudyPartners();
    } catch (error) {
      console.error('Error creating study partner request:', error);
      toast({
        title: "Error",
        description: "Failed to create study partner request",
        variant: "destructive",
      });
    }
  };

  const sendPartnerRequest = async (partnerId: string, partnerName: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to send partner requests",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('study_partner_matches')
        .insert({
          requester_id: user.id,
          partner_id: partnerId,
          subjects: [], // This should be populated based on common subjects
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Request Sent",
        description: `Study partner request sent to ${partnerName}!`,
      });
    } catch (error) {
      console.error('Error sending partner request:', error);
      toast({
        title: "Error", 
        description: "Failed to send partner request",
        variant: "destructive",
      });
    }
  };

  const filterPartners = () => {
    const transformedPartners: StudyPartner[] = studyPartners.map(partner => ({
      id: partner.user_id,
      name: `${partner.profile.first_name} ${partner.profile.last_name}`,
      subjects: partner.subjects || [],
      level: partner.preferred_level || 'Intermediate',
      availability: partner.availability || 'Flexible',
      studyGoals: partner.study_goals || 'Looking for a study partner',
      rating: 4.5,
      avatar: partner.profile.avatar_url,
      location: partner.profile.location || 'Not specified',
      languages: partner.profile.languages || ['English']
    }));

    let filtered = transformedPartners;

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

    if (levelFilter !== 'all') {
      filtered = filtered.filter(partner => 
        partner.level.toLowerCase() === levelFilter
      );
    }

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

  const addSubject = (subject: string) => {
    if (subject && !newRequest.subjects.includes(subject)) {
      setNewRequest(prev => ({
        ...prev,
        subjects: [...prev.subjects, subject]
      }));
    }
  };

  const removeSubject = (subject: string) => {
    setNewRequest(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
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
            {t('partners.title') || 'Find Your Study Partner'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('partners.description') || 'Connect with fellow learners who share your passion for Torah study'}
          </p>
          {profile?.gender && (
            <div className="text-sm text-gray-600 mt-2">
              {t('partners.gender_filter') || `Showing ${profile.gender} study partners only`}
            </div>
          )}
        </div>

        {/* Action Section */}
        <div className="mb-8 text-center">
          {!hasActiveRequest ? (
            <Dialog open={showCreateRequest} onOpenChange={setShowCreateRequest}>
              <DialogTrigger asChild>
                <Button size="lg" className="mr-4">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('partners.create_request') || 'Create Study Partner Request'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t('partners.create_request') || 'Create Study Partner Request'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('partners.subjects') || 'Study Subjects'}
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newRequest.subjects.map(subject => (
                        <Badge key={subject} variant="secondary" className="cursor-pointer" onClick={() => removeSubject(subject)}>
                          {subject} ×
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder={t('partners.add_subject') || "Add a subject..."}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addSubject(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('partners.availability') || 'Availability'}
                    </label>
                    <Input
                      placeholder={t('partners.availability_placeholder') || "e.g., Evenings, Weekends..."}
                      value={newRequest.availability}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, availability: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('partners.level') || 'Preferred Level'}
                    </label>
                    <Select value={newRequest.preferred_level} onValueChange={(value) => setNewRequest(prev => ({ ...prev, preferred_level: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">{t('partners.beginner') || 'Beginner'}</SelectItem>
                        <SelectItem value="intermediate">{t('partners.intermediate') || 'Intermediate'}</SelectItem>
                        <SelectItem value="advanced">{t('partners.advanced') || 'Advanced'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('partners.goals') || 'Study Goals'}
                    </label>
                    <Textarea
                      placeholder={t('partners.goals_placeholder') || "What do you hope to achieve with a study partner?"}
                      value={newRequest.study_goals}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, study_goals: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <Button onClick={createStudyPartnerRequest} className="w-full">
                    {t('partners.create') || 'Create Request'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
              <p className="text-green-800">
                {t('partners.active_request') || 'You have an active study partner request'}
              </p>
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
            <div className="text-gray-600">{t('partners.active_partners') || 'Active Partners'}</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center p-6 bg-green-50 rounded-lg"
          >
            <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">1,200+</div>
            <div className="text-gray-600">{t('partners.study_sessions') || 'Study Sessions'}</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center p-6 bg-purple-50 rounded-lg"
          >
            <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">95%</div>
            <div className="text-gray-600">{t('partners.success_rate') || 'Success Rate'}</div>
          </motion.div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t('partners.search_placeholder') || "Search partners by name, subject, or location..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder={t('partners.all_levels') || "All Levels"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('partners.all_levels') || 'All Levels'}</SelectItem>
                <SelectItem value="beginner">{t('partners.beginner') || 'Beginner'}</SelectItem>
                <SelectItem value="intermediate">{t('partners.intermediate') || 'Intermediate'}</SelectItem>
                <SelectItem value="advanced">{t('partners.advanced') || 'Advanced'}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder={t('partners.all_subjects') || "All Subjects"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('partners.all_subjects') || 'All Subjects'}</SelectItem>
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
            <Card key={partner.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={partner.avatar || '/placeholder.svg'}
                    alt={partner.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{partner.name}</h3>
                    <p className="text-gray-600 text-sm">{partner.location}</p>
                    <p className="text-gray-500 text-xs">{partner.level}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {t('partners.subjects') || 'Subjects:'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {partner.subjects.slice(0, 3).map(subject => (
                        <Badge key={subject} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {partner.subjects.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{partner.subjects.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {t('partners.availability') || 'Availability:'}
                    </p>
                    <p className="text-sm text-gray-600">{partner.availability}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {t('partners.goals') || 'Goals:'}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">{partner.studyGoals}</p>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => sendPartnerRequest(partner.id, partner.name)}
                  >
                    {t('partners.send_request') || 'Send Partner Request'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPartners.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">
              {t('partners.no_partners') || 'No study partners found matching your criteria.'}
            </p>
            <Button className="mt-4" onClick={() => {
              setSearchTerm('');
              setLevelFilter('all');
              setSubjectFilter('all');
            }}>
              {t('partners.clear_filters') || 'Clear Filters'}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default FindPartner;
