
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import Hero from '@/components/home/Hero';
import FeatureBlocks from '@/components/home/FeatureBlocks';
import SubjectCards from '@/components/home/SubjectCards';
import FeaturedTeachers from '@/components/home/FeaturedTeachers';
import Statistics from '@/components/home/Statistics';
import HowItWorksNew from '@/components/home/HowItWorksNew';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import BecomeTeacher from '@/components/home/BecomeTeacher';
import SOSPartner from '@/components/home/SOSPartner';

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <Hero />
        <Statistics />
        <FeatureBlocks />
        <SubjectCards />
        <FeaturedTeachers />
        <HowItWorksNew />
        <SOSPartner />
        <Testimonials />
        <BecomeTeacher />
        <FAQ />
      </div>
    </Layout>
  );
};

export default Index;
