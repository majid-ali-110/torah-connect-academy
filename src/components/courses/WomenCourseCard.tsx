
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, User, Calendar } from 'lucide-react';

interface WomenCourse {
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

interface WomenCourseCardProps {
  course: WomenCourse;
  index: number;
}

const WomenCourseCard: React.FC<WomenCourseCardProps> = ({ course, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-pink-500">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <Badge variant={course.level === 'Beginner' ? 'default' : course.level === 'Intermediate' ? 'secondary' : 'destructive'}>
              {course.level}
            </Badge>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <Badge variant="outline">{course.category}</Badge>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{course.schedule}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium">Instructor:</span> {course.instructor}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span>{course.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{course.enrolled} enrolled</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-pink-600">${course.price}</span>
            <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
              Join Class
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WomenCourseCard;
