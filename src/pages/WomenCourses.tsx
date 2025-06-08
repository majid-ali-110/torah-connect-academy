
import React from 'react';
import { motion } from 'framer-motion';
import CoursePageHeader from '@/components/courses/CoursePageHeader';
import CourseFilters from '@/components/courses/CourseFilters';
import CourseGrid from '@/components/courses/CourseGrid';
import { useCourseData } from '@/hooks/useCourseData';

const WomenCourses = () => {
  const {
    transformedCourses,
    loading,
    searchTerm,
    setSearchTerm,
    subjectFilter,
    setSubjectFilter,
    audienceFilter,
    setAudienceFilter,
    getUniqueSubjects,
    getUniqueAudiences,
    getPageTitle,
    getPageDescription,
    profile
  } = useCourseData();

  return (
    <div className="container mx-auto px-4 py-8">
      <CoursePageHeader
        title="Cours pour Femmes"
        description="Découvrez nos cours spécialement conçus pour les femmes"
        userGender={profile?.gender}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CourseFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          subjectFilter={subjectFilter}
          setSubjectFilter={setSubjectFilter}
          audienceFilter={audienceFilter}
          setAudienceFilter={setAudienceFilter}
          subjects={getUniqueSubjects()}
          audiences={getUniqueAudiences()}
        />

        <CourseGrid
          courses={transformedCourses}
          loading={loading}
        />
      </motion.div>
    </div>
  );
};

export default WomenCourses;
