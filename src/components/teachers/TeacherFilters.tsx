
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TeacherFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  subjectFilter: string;
  setSubjectFilter: (subject: string) => void;
  languageFilter: string;
  setLanguageFilter: (language: string) => void;
  audienceFilter: string;
  setAudienceFilter: (audience: string) => void;
  subjects: string[];
  languages: string[];
  audiences: string[];
}

const TeacherFilters: React.FC<TeacherFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  subjectFilter,
  setSubjectFilter,
  languageFilter,
  setLanguageFilter,
  audienceFilter,
  setAudienceFilter,
  subjects,
  languages,
  audiences
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Input
        placeholder="Search teachers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="focus:ring-2 focus:ring-torah-500 transition-all"
      />
      
      <Select value={subjectFilter} onValueChange={setSubjectFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Subjects</SelectItem>
          {subjects.map(subject => (
            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={languageFilter} onValueChange={setLanguageFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Languages</SelectItem>
          {languages.map(language => (
            <SelectItem key={language} value={language}>{language}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={audienceFilter} onValueChange={setAudienceFilter}>
        <SelectTrigger>
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
  );
};

export default TeacherFilters;
