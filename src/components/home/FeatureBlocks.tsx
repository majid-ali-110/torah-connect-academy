
import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Video, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureBlock = ({ 
  icon: Icon, 
  title, 
  link, 
  bgColor,
  description
}: { 
  icon: React.ElementType; 
  title: string; 
  link: string; 
  bgColor: string;
  description: string;
}) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}
      transition={{ duration: 0.2 }}
    >
      <Link 
        to={link} 
        className={`${bgColor} rounded-lg p-6 flex flex-col items-center text-center gap-4 h-full transition-all shadow-md`}
      >
        <div className="bg-white/20 p-4 rounded-full">
          <Icon className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-white font-bold text-xl">{title}</h3>
        <p className="text-white/90 text-sm">{description}</p>
        <div className="mt-auto pt-4">
          <div className="inline-flex items-center justify-center rounded-full bg-white/20 px-4 py-1 text-sm text-white">
            Learn more
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const FeatureBlocks = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-2 text-center">Explore Our Services</h2>
      <p className="text-gray-600 mb-10 text-center max-w-2xl mx-auto">Find the perfect learning experience tailored to your needs and preferences</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureBlock 
          icon={Book} 
          title="Children's Learning" 
          link="/children-courses" 
          bgColor="bg-red-400"
          description="Specialized Torah education designed for children of all ages"
        />
        <FeatureBlock 
          icon={Book} 
          title="Women's Studies" 
          link="/women-courses" 
          bgColor="bg-pink-400"
          description="Torah learning opportunities specifically tailored for women"
        />
        <FeatureBlock 
          icon={Video} 
          title="Live Courses" 
          link="/live-courses" 
          bgColor="bg-yellow-400"
          description="Join our interactive live Torah sessions with renowned teachers"
        />
        <FeatureBlock 
          icon={Users} 
          title="SOS Partner" 
          link="/sos-partner" 
          bgColor="bg-teal-400"
          description="Get matched with a study partner right away for immediate learning"
        />
      </div>
    </div>
  );
};

export default FeatureBlocks;
