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
  const { t } = useLanguage();
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 30px rgba(0,0,0,0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="feature-card h-full"
    >
      <Link 
        to={link} 
        className={`${bgColor} rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col items-center text-center gap-3 sm:gap-4 h-full transition-all shadow-md overflow-hidden relative group`}
      >
        <motion.div 
          className="bg-white/20 p-4 sm:p-6 rounded-full relative z-10"
          whileHover={{ 
            scale: 1.1,
            backgroundColor: "rgba(255,255,255,0.3)" 
          }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
        </motion.div>
        <h3 className="text-white font-bold text-lg sm:text-xl lg:text-2xl relative z-10 leading-tight">
          {title}
        </h3>
        <p className="text-white/90 text-xs sm:text-sm lg:text-base relative z-10 leading-relaxed">
          {description}
        </p>
        <div className="mt-auto pt-2 sm:pt-4 relative z-10">
          <motion.div 
            className="inline-flex items-center justify-center rounded-full bg-white/20 px-3 sm:px-4 py-2 text-xs sm:text-sm text-white group-hover:bg-white/30 transition-colors"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.4)" }}
          >
            {t('feature_blocks.learn_more')}
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

  const getGenderSpecificTitle = () => {
    if (profile?.gender === 'male') {
      return t('feature_blocks.men_title');
    } else if (profile?.gender === 'female') {
      return t('feature_blocks.women_title');
    }
    return t('feature_blocks.adult_title');
  };

  const getGenderSpecificDescription = () => {
    if (profile?.gender === 'male') {
      return t('feature_blocks.men_desc');
    } else if (profile?.gender === 'female') {
      return t('feature_blocks.women_desc');
    }
    return t('feature_blocks.adult_desc');
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 sm:mb-12 lg:mb-16"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">
          {t('feature_blocks.heading')}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
          {t('feature_blocks.subheading')}
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.div variants={item}>
          <FeatureBlock 
            icon={Calendar} 
            title={t('feature_blocks.children_title')} 
            link="/children-courses" 
            bgColor="bg-red-400"
            description={t('feature_blocks.children_desc')}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <FeatureBlock 
            icon={CalendarDays} 
            title={getGenderSpecificTitle()}
            link="/women-courses" 
            bgColor="bg-pink-400"
            description={getGenderSpecificDescription()}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <FeatureBlock 
            icon={Video} 
            title={t('feature_blocks.live_title')} 
            link="/live-courses" 
            bgColor="bg-yellow-400"
            description={t('feature_blocks.live_desc')}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <FeatureBlock 
            icon={Users} 
            title={t('feature_blocks.sos_title')} 
            link="/sos-havrouta" 
            bgColor="bg-teal-400"
            description={t('feature_blocks.sos_desc')}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FeatureBlocks;
