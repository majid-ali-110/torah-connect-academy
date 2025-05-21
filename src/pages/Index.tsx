
import React from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/home/Hero';
import Statistics from '@/components/home/Statistics';
import HowItWorks from '@/components/home/HowItWorks';
import FeaturedTeachers from '@/components/home/FeaturedTeachers';
import SubjectCards from '@/components/home/SubjectCards';
import BecomeTeacher from '@/components/home/BecomeTeacher';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Statistics />
      <HowItWorks />
      <FeaturedTeachers />
      <SubjectCards />
      <BecomeTeacher />
    </Layout>
  );
};

export default Index;
