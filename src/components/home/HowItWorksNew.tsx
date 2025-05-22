
import React from 'react';
import { Search, UserCircle, Video } from 'lucide-react';

const HowItWorksNew = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-10 text-center">Comment ça marche ?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 rounded-full p-4 mb-4">
            <Search className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Rechercher un cours ou un Rav.</h3>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 rounded-full p-4 mb-4">
            <UserCircle className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Choisir le Rav souhaité.</h3>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 rounded-full p-4 mb-4">
            <Video className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold mb-2">S'inscrire pour un rendez-vous en visioconférence.</h3>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksNew;
