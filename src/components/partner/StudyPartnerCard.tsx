
import React, { useRef, forwardRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Calendar, MessageCircle, Star } from 'lucide-react';

interface StudyPartner {
  id: string;
  name: string;
  subjects: string[];
  level: string;
  availability: string;
  studyGoals: string;
  rating: number;
  avatar?: string;
  location: string;
  languages: string[];
}

interface StudyPartnerCardProps {
  partner: StudyPartner;
  index: number;
}

const StudyPartnerCard = forwardRef<HTMLDivElement, StudyPartnerCardProps>(({ partner, index }, forwardedRef) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const combinedRef = useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (forwardedRef) {
      if (typeof forwardedRef === 'function') {
        if (combinedRef.current) forwardedRef(combinedRef.current);
      } else {
        forwardedRef.current = combinedRef.current;
      }
    }
  }, [forwardedRef]);
  
  const isInView = useInView(combinedRef, { once: true });
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <motion.div
      ref={combinedRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: 0.1 * index }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={partner.avatar} alt={partner.name} />
              <AvatarFallback className="bg-torah-100 text-torah-700">
                {getInitials(partner.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg">{partner.name}</CardTitle>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{partner.location}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span>{partner.rating}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {partner.subjects && partner.subjects.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">Subjects:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {partner.subjects.map((subject, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {partner.languages && partner.languages.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">Languages:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {partner.languages.map((language, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <span className="text-sm font-medium text-gray-700">Level:</span>
            <Badge variant="default" className="ml-2">{partner.level}</Badge>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{partner.availability}</span>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-700">Study Goals:</span>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{partner.studyGoals}</p>
          </div>
          
          <div className="flex space-x-2">
            <Button size="sm" className="flex-1" variant="outline">
              <MessageCircle className="h-4 w-4 mr-1" />
              Message
            </Button>
            <Button size="sm" className="flex-1">
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

StudyPartnerCard.displayName = 'StudyPartnerCard';

export default StudyPartnerCard;
