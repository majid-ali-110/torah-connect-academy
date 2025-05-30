
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Users, MessageCircle, Heart } from 'lucide-react';
import StudyPartnerCard from '@/components/partner/StudyPartnerCard';

// Dummy data for study partners
const dummyStudyPartners = [
  {
    id: '1',
    name: 'Sarah Miller',
    subjects: ['Gemara', 'Halacha', 'Tanach'],
    level: 'Intermediate',
    availability: 'Evenings, Weekends',
    studyGoals: 'Looking to deepen understanding of Talmudic texts and improve analytical skills',
    rating: 4.8,
    avatar: '',
    location: 'New York',
    languages: ['English', 'Hebrew']
  },
  {
    id: '2',
    name: 'David Cohen',
    subjects: ['Parsha', 'Jewish Philosophy', 'Mussar'],
    level: 'Advanced',
    availability: 'Mornings, Sunday',
    studyGoals: 'Seeking partner for weekly parsha study and philosophical discussions',
    rating: 4.9,
    avatar: '',
    location: 'Los Angeles',
    languages: ['English', 'Yiddish']
  },
  {
    id: '3',
    name: 'Rachel Green',
    subjects: ['Hebrew Language', 'Torah', 'Jewish History'],
    level: 'Beginner',
    availability: 'Flexible weekdays',
    studyGoals: 'New to Jewish learning, looking for supportive study partner to learn basics',
    rating: 4.7,
    avatar: '',
    location: 'Chicago',
    languages: ['English']
  },
  {
    id: '4',
    name: 'Michael Rosen',
    subjects: ['Chassidut', 'Kabbalah', 'Jewish Mysticism'],
    level: 'Advanced',
    availability: 'Late evenings',
    studyGoals: 'Exploring deeper mystical texts and chassidic teachings with like-minded partner',
    rating: 4.6,
    avatar: '',
    location: 'Miami',
    languages: ['English', 'Hebrew']
  },
  {
    id: '5',
    name: 'Esther Goldberg',
    subjects: ['Women in Judaism', 'Jewish Law', 'Ethics'],
    level: 'Intermediate',
    availability: 'Mornings only',
    studyGoals: 'Focus on women-specific halachic topics and contemporary Jewish ethics',
    rating: 4.9,
    avatar: '',
    location: 'Brooklyn',
    languages: ['English', 'Hebrew']
  },
  {
    id: '6',
    name: 'Joshua Levy',
    subjects: ['Mishnah', 'Jewish Calendar', 'Holidays'],
    level: 'Beginner',
    availability: 'Weekends',
    studyGoals: 'Learning about Jewish holidays and traditions, preparing for upcoming festivals',
    rating: 4.5,
    avatar: '',
    location: 'Boston',
    languages: ['English']
  }
];

const FindPartner = () => {
  const { t } = useLanguage();
  const [partners, setPartners] = useState(dummyStudyPartners);
  const [filteredPartners, setFilteredPartners] = useState(dummyStudyPartners);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let filtered = partners;

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
  }, [searchTerm, levelFilter, subjectFilter, partners]);

  return (
    <Layout>
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
              <div className="text-2xl font-bold text-blue-600">150+</div>
              <div className="text-gray-600">Active Partners</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center p-6 bg-green-50 rounded-lg"
            >
              <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">2,500+</div>
              <div className="text-gray-600">Study Sessions</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center p-6 bg-purple-50 rounded-lg"
            >
              <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">98%</div>
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
                  <SelectItem value="gemara">Gemara</SelectItem>
                  <SelectItem value="halacha">Halacha</SelectItem>
                  <SelectItem value="tanach">Tanach</SelectItem>
                  <SelectItem value="parsha">Parsha</SelectItem>
                  <SelectItem value="philosophy">Philosophy</SelectItem>
                  <SelectItem value="hebrew">Hebrew</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner, index) => (
              <StudyPartnerCard
                key={partner.id}
                partner={partner}
                index={index}
              />
            ))}
          </div>

          {filteredPartners.length === 0 && (
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
    </Layout>
  );
};

export default FindPartner;
