
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MaleCourse {
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

const MaleCourseCard: React.FC<{ course: MaleCourse; index: number }> = ({ course, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <Badge variant={course.level === 'Beginner' ? 'default' : course.level === 'Intermediate' ? 'secondary' : 'destructive'}>
              {course.level}
            </Badge>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <Badge variant="outline">{course.category}</Badge>
            <span>{course.schedule}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium">Instructor:</span> {course.instructor}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <span>⭐</span>
              <span>{course.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>👥</span>
              <span>{course.enrolled} enrolled</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-600">${course.price}</span>
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
              Join Class
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const MaleCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  // Mock data for male courses
  const courses: MaleCourse[] = [
    {
      id: '1',
      title: 'Advanced Talmud Study',
      description: 'Deep dive into complex Talmudic discussions and methodology for serious male students.',
      schedule: 'Sunday 8:00 PM',
      instructor: 'Rabbi David Cohen',
      rating: 4.9,
      enrolled: 24,
      price: 45,
      category: 'Talmud',
      level: 'Advanced'
    },
    {
      id: '2',
      title: 'Mishnah Fundamentals',
      description: 'Comprehensive study of Mishnah with traditional commentaries for male learners.',
      schedule: 'Tuesday 7:30 PM',
      instructor: 'Rabbi Moshe Levy',
      rating: 4.8,
      enrolled: 18,
      price: 35,
      category: 'Mishnah',
      level: 'Beginner'
    },
    {
      id: '3',
      title: 'Halacha in Practice',
      description: 'Practical Jewish law discussions and applications for daily life.',
      schedule: 'Thursday 8:30 PM',
      instructor: 'Rabbi Yosef Klein',
      rating: 4.7,
      enrolled: 32,
      price: 40,
      category: 'Halacha',
      level: 'Intermediate'
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-blue-600">Male Torah Studies</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dedicated learning opportunities designed specifically for male students, 
            with traditional approaches and in-depth study methodologies.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Talmud">Talmud</SelectItem>
              <SelectItem value="Mishnah">Mishnah</SelectItem>
              <SelectItem value="Halacha">Halacha</SelectItem>
              <SelectItem value="Kabbalah">Kabbalah</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <MaleCourseCard key={course.id} course={course} index={index} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MaleCourses;
