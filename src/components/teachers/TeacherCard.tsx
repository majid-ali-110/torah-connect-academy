
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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

interface TeacherCardProps {
  teacher: TeacherProfile;
  index: number;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, index }) => {
  return (
    <motion.div
      key={teacher.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      className="transition-all duration-300"
    >
      <Card className="h-full cursor-pointer overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <Avatar className="w-16 h-16">
                <AvatarImage src={teacher.avatar_url} alt={`${teacher.first_name} ${teacher.last_name}`} />
                <AvatarFallback>
                  {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                teacher.availability_status === 'available' ? 'bg-green-500 animate-pulse' :
                teacher.availability_status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}></div>
            </div>
            <div>
              <h3 className="font-bold text-lg">{teacher.first_name} {teacher.last_name}</h3>
              <p className="text-sm text-gray-600">{teacher.location}</p>
              {teacher.hourly_rate && (
                <p className="text-sm font-medium text-torah-600">
                  ${teacher.hourly_rate}/hour
                </p>
              )}
            </div>
          </div>
          
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">{teacher.bio}</p>
          
          <div className="space-y-2">
            {teacher.subjects && teacher.subjects.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Subjects:</p>
                <div className="flex flex-wrap gap-1">
                  {teacher.subjects.slice(0, 3).map(subject => (
                    <Badge key={subject} variant="secondary" className="text-xs bg-torah-100 text-torah-700">
                      {subject}
                    </Badge>
                  ))}
                  {teacher.subjects.length > 3 && (
                    <Badge variant="secondary" className="text-xs">+{teacher.subjects.length - 3}</Badge>
                  )}
                </div>
              </div>
            )}
            
            {teacher.languages && teacher.languages.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Languages:</p>
                <div className="flex flex-wrap gap-1">
                  {teacher.languages.map(language => (
                    <Badge key={language} variant="outline" className="text-xs">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button asChild className="w-full bg-torah-500 hover:bg-torah-600 transition-colors">
              <Link to={`/teacher/${teacher.id}`}>View Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TeacherCard;
