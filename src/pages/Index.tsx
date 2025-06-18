
import React from 'react';
import Hero from '@/components/home/Hero';
import FeatureBlocks from '@/components/home/FeatureBlocks';
import SOSPartner from '@/components/home/SOSPartner';
import HowItWorksNew from '@/components/home/HowItWorksNew';
import FAQ from '@/components/home/FAQ';
import Testimonials from '@/components/home/Testimonials';
import SubjectCards from '@/components/home/SubjectCards';

const Index = () => {
  return (
    <>
      <Hero />
      <FeatureBlocks />
      <SOSPartner />
      <SubjectCards />
      <HowItWorksNew />
      <FAQ />
      <Testimonials />
    </>
  );
};

export default Index;
