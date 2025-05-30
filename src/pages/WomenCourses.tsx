
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import WomenCourseCard from '@/components/courses/WomenCourseCard';

// Dummy data for women courses
const dummyWomenCourses = [
  {
    id: '1',
    title: 'Women in Torah Leadership',
    description: 'Exploring the roles of biblical matriarchs and contemporary Jewish women leaders.',
    schedule: 'Tuesday 8 PM',
    instructor: 'Rebbetzin Sarah Goldstein',
    rating: 4.9,
    enrolled: 34,
    price: 45,
    category: 'Leadership',
    level: 'Intermediate' as const
  },
  {
    id: '2',
    title: 'Niddah Laws & Mikvah',
    description: 'Comprehensive study of family purity laws and their practical applications.',
    schedule: 'Sunday 7 PM',
    instructor: 'Rebbetzin Rachel Cohen',
    rating: 4.8,
    enrolled: 28,
    price: 40,
    category: 'Halacha',
    level: 'Beginner' as const
  },
  {
    id: '3',
    title: 'Shabbat for the Modern Woman',
    description: 'Practical guidance for creating meaningful Shabbat experiences in contemporary life.',
    schedule: 'Thursday 9 PM',
    instructor: 'Mrs. Esther Rosen',
    rating: 4.7,
    enrolled: 52,
    price: 35,
    category: 'Practical',
    level: 'Beginner' as const
  },
  {
    id: '4',
    title: 'Mystical Teachings for Women',
    description: 'Exploring Kabbalistic concepts and chassidic teachings relevant to women\'s spiritual journey.',
    schedule: 'Monday 8:30 PM',
    instructor: 'Rebbetzin Miriam Klein',
    rating: 4.9,
    enrolled: 19,
    price: 55,
    category: 'Spirituality',
    level: 'Advanced' as const
  },
  {
    id: '5',
    title: 'Jewish Motherhood & Parenting',
    description: 'Torah perspectives on raising children and creating a Jewish home environment.',
    schedule: 'Wednesday 2 PM',
    instructor: 'Mrs. Devorah Levy',
    rating: 4.8,
    enrolled: 41,
    price: 40,
    category: 'Family',
    level: 'Intermediate' as const
  },
  {
    id: '6',
    title: 'Women\'s Prayer & Spirituality',
    description: 'Deep dive into women\'s unique relationship with prayer and spiritual practice.',
    schedule: 'Friday 10 AM',
    instructor: 'Rebbetzin Chaya Green',
    rating: 4.6,
    enrolled: 33,
    price: 38,
    category: 'Spirituality',
    level: 'Beginner' as const
  }
];

const WomenCourses = () => {
  const { t } = useLanguage();
  const [courses, setCourses] = useState(dummyWomenCourses);
  const [filteredCourses, setFilteredCourses] = useState(dummyWomenCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  useEffect(() => {
    let filtered = courses;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(course => course.category.toLowerCase() === categoryFilter);
    }

    // Apply level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(course => course.level.toLowerCase() === levelFilter);
    }

    setFilteredCourses(filtered);
  }, [searchTerm, categoryFilter, levelFilter, courses]);

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
              Torah Classes for Women
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering Jewish women through meaningful Torah study and spiritual growth
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search courses, instructors, topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                  <SelectItem value="halacha">Halacha</SelectItem>
                  <SelectItem value="practical">Practical</SelectItem>
                  <SelectItem value="spirituality">Spirituality</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
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
              <WomenCourseCard
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
    </Layout>
  );
};

export default WomenCourses;
