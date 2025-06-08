
import React from 'react';
import { motion } from 'framer-motion';

interface CoursePageHeaderProps {
  title: string;
  description: string;
  userGender?: string;
}

const CoursePageHeader: React.FC<CoursePageHeaderProps> = ({ 
  title, 
  description, 
  userGender 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {description}
        </p>
        {userGender && (
          <div className="text-sm text-gray-500 mt-2">
            Showing courses for {userGender} students
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CoursePageHeader;
