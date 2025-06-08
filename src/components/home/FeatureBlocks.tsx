
import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Users, Video, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

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
        scale: 1.05,
        boxShadow: "0 20px 30px rgba(0,0,0,0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="feature-card"
    >
      <Link 
        to={link} 
        className={`${bgColor} rounded-2xl p-6 flex flex-col items-center text-center gap-4 h-full transition-all shadow-md overflow-hidden relative`}
      >
        <motion.div 
          className="bg-white/20 p-6 rounded-full relative z-10"
          whileHover={{ 
            scale: 1.1,
            backgroundColor: "rgba(255,255,255,0.3)" 
          }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="h-12 w-12 text-white" />
        </motion.div>
        <h3 className="text-white font-bold text-xl relative z-10">{title}</h3>
        <p className="text-white/90 text-sm relative z-10">{description}</p>
        <div className="mt-auto pt-4 relative z-10">
          <motion.div 
            className="inline-flex items-center justify-center rounded-full bg-white/20 px-4 py-2 text-sm text-white"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.3)" }}
          >
            Learn more
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute w-0 h-0 rounded-full bg-white/10"
          initial={{ scale: 0, x: "50%", y: "50%" }}
          whileHover={{ scale: 5 }}
          transition={{ duration: 0.5 }}
          style={{ top: "50%", left: "50%", translateX: "-50%", translateY: "-50%" }}
        />
      </Link>
    </motion.div>
  );
};

const FeatureBlocks = () => {
  const { profile } = useAuth();
  const { t } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Determine gender-specific learning section
  const getGenderSpecificSection = () => {
    if (!profile || !profile.gender) {
      return {
        title: t('features.children_learning') || "Children's Learning",
        link: "/children-courses",
        description: t('features.children_description') || "Specialized Torah education designed for children of all ages"
      };
    }
    
    if (profile.gender === 'male') {
      return {
        title: t('features.male_studies') || "Male Studies",
        link: "/male-courses",
        description: t('features.male_description') || "Torah learning opportunities specifically tailored for men"
      };
    } else if (profile.gender === 'female') {
      return {
        title: t('features.female_studies') || "Female Studies", 
        link: "/women-courses",
        description: t('features.female_description') || "Torah learning opportunities specifically tailored for women"
      };
    }
    
    return {
      title: t('features.children_learning') || "Children's Learning",
      link: "/children-courses", 
      description: t('features.children_description') || "Specialized Torah education designed for children of all ages"
    };
  };

  const genderSpecificSection = getGenderSpecificSection();

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-2 text-center">
          {t('features.explore_services') || 'Explore Our Services'}
        </h2>
        <p className="text-gray-600 mb-10 text-center max-w-2xl mx-auto">
          {t('features.explore_description') || 'Find the perfect learning experience tailored to your needs and preferences'}
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.div variants={item}>
          <FeatureBlock 
            icon={Calendar} 
            title={genderSpecificSection.title}
            link={genderSpecificSection.link}
            bgColor="bg-red-400"
            description={genderSpecificSection.description}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <FeatureBlock 
            icon={CalendarDays} 
            title={t('features.children_learning') || "Children's Learning"}
            link="/children-courses" 
            bgColor="bg-pink-400"
            description={t('features.children_description') || "Specialized Torah education designed for children of all ages"}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <FeatureBlock 
            icon={Video} 
            title={t('features.live_courses') || "Live Courses"}
            link="/live-courses" 
            bgColor="bg-yellow-400"
            description={t('features.live_description') || "Join our interactive live Torah sessions with renowned teachers"}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <FeatureBlock 
            icon={Users} 
            title={t('features.sos_partner') || "SOS Partner"}
            link="/find-partner" 
            bgColor="bg-teal-400"
            description={t('features.sos_description') || "Get matched with a study partner right away for immediate learning"}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FeatureBlocks;
