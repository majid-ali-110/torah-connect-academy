
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative">
      <div className="w-full h-64 bg-cover bg-center" style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1490633874781-1c63cc424610?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="container mx-auto relative h-full flex flex-col items-center justify-center">
          <div className="w-full max-w-xl mx-auto mt-12">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Rechercher un cours ou un Rav..." 
                className="w-full py-6 px-4 bg-white rounded-md text-lg shadow-md"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
