
import React from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/home/Hero';
import FeatureBlocks from '@/components/home/FeatureBlocks';
import SOSPartner from '@/components/home/SOSPartner';
import HowItWorksNew from '@/components/home/HowItWorksNew';
import FAQ from '@/components/home/FAQ';
import Testimonials from '@/components/home/Testimonials';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeatureBlocks />
      <SOSPartner />
      <HowItWorksNew />
      <FAQ />
      <Testimonials />
    </Layout>
  );
};

export default Index;
