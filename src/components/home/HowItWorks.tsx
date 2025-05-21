
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How TorahConnect works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-torah-100 text-torah-600 font-bold text-xl mb-6">1</div>
            <h3 className="text-2xl font-bold mb-4">Find your teacher</h3>
            <p className="text-gray-600">
              Browse through our verified Torah teachers based on subject, experience level, and availability. Read reviews from students.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-torah-100 text-torah-600 font-bold text-xl mb-6">2</div>
            <h3 className="text-2xl font-bold mb-4">Start learning</h3>
            <p className="text-gray-600">
              Book your first free trial lesson. Your teacher will guide you through your initial session and help plan your learning path.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-torah-100 text-torah-600 font-bold text-xl mb-6">3</div>
            <h3 className="text-2xl font-bold mb-4">Study. Grow. Connect.</h3>
            <p className="text-gray-600">
              Choose how many lessons you want per week and make consistent progress in your Torah learning journey.
            </p>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Button asChild className="bg-torah-500 hover:bg-torah-600 text-white font-semibold px-8 py-6 text-lg rounded-md">
            <Link to="/find-teachers">Find a Teacher</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
