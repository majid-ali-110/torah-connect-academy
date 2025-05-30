
import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface AnimatedProgressProps {
  value: number;
  className?: string;
  delay?: number;
}

const AnimatedProgress: React.FC<AnimatedProgressProps> = ({ 
  value, 
  className = '', 
  delay = 0 
}) => {
  return (
    <div className={`relative ${className}`}>
      <Progress value={0} className="absolute inset-0" />
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.5, delay, ease: "easeOut" }}
        className="absolute inset-0 bg-primary rounded-full"
        style={{ 
          background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
          height: '100%'
        }}
      />
    </div>
  );
};

export default AnimatedProgress;
