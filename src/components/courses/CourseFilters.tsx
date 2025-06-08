
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface CourseFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  subjectFilter: string;
  setSubjectFilter: (subject: string) => void;
  audienceFilter: string;
  setAudienceFilter: (audience: string) => void;
  subjects: string[];
  audiences: string[];
}

const CourseFilters: React.FC<CourseFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  subjectFilter,
  setSubjectFilter,
  audienceFilter,
  setAudienceFilter,
  subjects,
  audiences
}) => {
  return (
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
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map(subject => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={audienceFilter} onValueChange={setAudienceFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Audiences</SelectItem>
            {audiences.map(audience => (
              <SelectItem key={audience} value={audience}>{audience}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CourseFilters;
