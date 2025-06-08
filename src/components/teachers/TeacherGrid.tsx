
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TeacherCard from './TeacherCard';

interface TeacherProfile {
  id: string;
  first_name: string;
  last_name: string;
  bio: string;
  subjects: string[];
  languages: string[];
  audiences: string[];
  location: string;
  experience: string;
  avatar_url?: string;
  availability_status: 'available' | 'busy' | 'offline';
  gender: string;
  hourly_rate?: number;
}

interface TeacherGridProps {
  teachers: TeacherProfile[];
  loading: boolean;
  onClearFilters: () => void;
}

const TeacherGrid: React.FC<TeacherGridProps> = ({ teachers, loading, onClearFilters }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <Card>
              <CardContent className="p-6">
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
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No teachers found matching your criteria.</p>
        <Button 
          onClick={onClearFilters}
          className="mt-4"
          variant="outline"
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teachers.map((teacher, index) => (
        <TeacherCard key={teacher.id} teacher={teacher} index={index} />
      ))}
    </div>
  );
};

export default TeacherGrid;
