
import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Users, Video, CircleArrowRight } from 'lucide-react';

const FeatureBlock = ({ 
  icon: Icon, 
  title, 
  link, 
  bgColor 
}: { 
  icon: React.ElementType; 
  title: string; 
  link: string; 
  bgColor: string;
}) => {
  return (
    <Link 
      to={link} 
      className={`${bgColor} rounded-lg p-6 flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-md h-32`}
    >
      <Icon className="h-8 w-8 text-white" />
      <span className="text-white font-medium text-lg">{title}</span>
    </Link>
  );
};

const FeatureBlocks = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureBlock 
          icon={UserCircle} 
          title="Annuaire des Rabbanim" 
          link="/rabbanim" 
          bgColor="bg-red-400"
        />
        <FeatureBlock 
          icon={Users} 
          title="Section pour élèves/enfants" 
          link="/eleves" 
          bgColor="bg-teal-400"
        />
        <FeatureBlock 
          icon={UserCircle} 
          title="Section pour femmes" 
          link="/femmes" 
          bgColor="bg-pink-400"
        />
        <FeatureBlock 
          icon={Video} 
          title="Beit Hamidrash en ligne" 
          link="/beit-hamidrash" 
          bgColor="bg-yellow-400"
        />
      </div>
    </div>
  );
};

export default FeatureBlocks;
