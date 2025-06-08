
import React from 'react';
import { motion } from 'framer-motion';
import TeacherFilters from '@/components/teachers/TeacherFilters';
import TeacherGrid from '@/components/teachers/TeacherGrid';
import { useTeacherData } from '@/hooks/useTeacherData';

const FindTeachers = () => {
  const {
    filteredTeachers,
    loading,
    searchTerm,
    setSearchTerm,
    subjectFilter,
    setSubjectFilter,
    languageFilter,
    setLanguageFilter,
    audienceFilter,
    setAudienceFilter,
    getUniqueValues,
    getFilteredAudiences,
    getPageDescription,
    clearFilters
  } = useTeacherData();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Trouvez Votre Professeur de Torah</h1>
          <div className="text-sm text-gray-600">
            {getPageDescription()}
          </div>
        </div>
        
        <TeacherFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          subjectFilter={subjectFilter}
          setSubjectFilter={setSubjectFilter}
          languageFilter={languageFilter}
          setLanguageFilter={setLanguageFilter}
          audienceFilter={audienceFilter}
          setAudienceFilter={setAudienceFilter}
          subjects={getUniqueValues('subjects')}
          languages={getUniqueValues('languages')}
          audiences={getFilteredAudiences()}
        />

        <TeacherGrid
          teachers={filteredTeachers}
          loading={loading}
          onClearFilters={clearFilters}
        />
      </motion.div>
    </div>
  );
};

export default FindTeachers;
