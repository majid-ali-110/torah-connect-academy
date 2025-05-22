
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const Hero = () => {
  return (
    <div className="relative">
      <div className="w-full h-[500px] bg-cover bg-center" style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1490633874781-1c63cc424610?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto relative h-full flex flex-col md:flex-row items-center justify-between px-4 py-12">
          <div className="text-white mb-8 md:mb-0 md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Torah Study Partner</h1>
            <p className="text-xl mb-6">Connect with experienced Torah teachers for personalized learning experiences</p>
          </div>
          
          <div className="md:w-1/3 flex justify-center relative">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <AspectRatio ratio={1/1}>
                <img 
                  src="https://images.unsplash.com/photo-1564106888495-95bbc3a331c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                  alt="Franck - Lead Teacher" 
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 -mt-10 md:-mt-16 relative z-10 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Find Teachers or Study Partners</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Input 
                type="text" 
                placeholder="Search by subject, teacher name, or keywords..." 
                className="w-full py-6 px-4 bg-white rounded-md text-lg pr-12"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <Button className="bg-torah-500 hover:bg-torah-600 px-8 py-6 text-white rounded-md font-medium flex items-center justify-center">
              <span>Search</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
