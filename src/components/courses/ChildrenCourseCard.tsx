
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, User, Calendar } from 'lucide-react';

interface ChildrenCourse {
  id: string;
  title: string;
  description: string;
  ageRange: string;
  duration: string;
  instructor: string;
  rating: number;
  enrolled: number;
  price: number;
  image: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface ChildrenCourseCardProps {
  course: ChildrenCourse;
  index: number;
}

const ChildrenCourseCard: React.FC<ChildrenCourseCardProps> = ({ course, index }) => {
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
            <span>Ages {course.ageRange}</span>
            <span>{course.duration}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
          
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
            <span className="text-lg font-bold text-blue-600">${course.price}</span>
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
              Enroll Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChildrenCourseCard;
