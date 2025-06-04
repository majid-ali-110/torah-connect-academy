
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, Star, User } from 'lucide-react';
import ChildrenCourseCard from '@/components/courses/ChildrenCourseCard';

// Dummy data for children courses
const dummyChildrenCourses = [
  {
    id: '1',
    title: 'Torah Stories for Little Ones',
    description: 'Engaging Torah stories adapted for young children with colorful illustrations and interactive activities.',
    ageRange: '3-6',
    duration: '30 min',
    instructor: 'Rabbi Sarah Cohen',
    rating: 4.9,
    enrolled: 45,
    price: 25,
    image: '/placeholder.svg',
    level: 'Beginner' as const
  },
  {
    id: '2',
    title: 'Hebrew Alphabet Adventure',
    description: 'Fun and interactive way to learn Hebrew letters through songs, games, and creative activities.',
    ageRange: '4-8',
    duration: '45 min',
    instructor: 'Morah Rachel Goldstein',
    rating: 4.8,
    enrolled: 67,
    price: 30,
    image: '/placeholder.svg',
    level: 'Beginner' as const
  },
  {
    id: '3',
    title: 'Junior Shabbat Club',
    description: 'Learn about Shabbat traditions, blessings, and customs through hands-on activities and songs.',
    ageRange: '5-9',
    duration: '1 hour',
    instructor: 'Rabbi David Levy',
    rating: 4.7,
    enrolled: 38,
    price: 35,
    image: '/placeholder.svg',
    level: 'Beginner' as const
  },
  {
    id: '4',
    title: 'Young Scholars Parsha Class',
    description: 'Weekly Torah portion discussions adapted for children with interactive storytelling and activities.',
    ageRange: '7-12',
    duration: '1 hour',
    instructor: 'Morah Esther Rosen',
    rating: 4.9,
    enrolled: 52,
    price: 40,
    image: '/placeholder.svg',
    level: 'Intermediate' as const
  },
  {
    id: '5',
    title: 'Holiday Celebrations Workshop',
    description: 'Learn about Jewish holidays through crafts, cooking, and storytelling activities.',
    ageRange: '6-10',
    duration: '1.5 hours',
    instructor: 'Rabbi Michael Green',
    rating: 4.6,
    enrolled: 29,
    price: 45,
    image: '/placeholder.svg',
    level: 'Beginner' as const
  },
  {
    id: '6',
    title: 'Teen Torah Study Circle',
    description: 'Advanced Torah study and discussion group for teenagers exploring deeper Jewish concepts.',
    ageRange: '13-17',
    duration: '1.5 hours',
    instructor: 'Rabbi Jonathan Klein',
    rating: 4.8,
    enrolled: 23,
    price: 50,
    image: '/placeholder.svg',
    level: 'Advanced' as const
  }
];

const ChildrenCourses = () => {
  const { t } = useLanguage();
  const [courses, setCourses] = useState(dummyChildrenCourses);
  const [filteredCourses, setFilteredCourses] = useState(dummyChildrenCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  useEffect(() => {
    let filtered = courses;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply age filter
    if (ageFilter !== 'all') {
      filtered = filtered.filter(course => {
        const [minAge, maxAge] = course.ageRange.split('-').map(Number);
        const [filterMin, filterMax] = ageFilter.split('-').map(Number);
        return minAge >= filterMin && maxAge <= filterMax;
      });
    }

    // Apply level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(course => course.level.toLowerCase() === levelFilter);
    }

    setFilteredCourses(filtered);
  }, [searchTerm, ageFilter, levelFilter, courses]);

  return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Torah Courses for Children
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nurture your child's Jewish learning with engaging, age-appropriate Torah courses
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search courses, instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={ageFilter} onValueChange={setAgeFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Age Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  <SelectItem value="3-6">3-6 years</SelectItem>
                  <SelectItem value="7-12">7-12 years</SelectItem>
                  <SelectItem value="13-17">13-17 years</SelectItem>
                </SelectContent>
              </Select>
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
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <ChildrenCourseCard
                key={course.id}
                course={course}
                index={index}
              />
            ))}
          </div>

          {filteredCourses.length === 0 && (
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

export default ChildrenCourses;
