
import React from 'react';
import { motion } from 'framer-motion';
import WomenCourseCard from '@/components/courses/WomenCourseCard';

interface Course {
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

interface CourseGridProps {
  courses: Course[];
  loading: boolean;
}

const CourseGrid: React.FC<CourseGridProps> = ({ courses, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-64 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, index) => (
        <WomenCourseCard
          key={course.id}
          course={course}
          index={index}
        />
      ))}
    </div>
  );
};

export default CourseGrid;
