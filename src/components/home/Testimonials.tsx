
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Testimonials = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50">
      <h2 className="text-3xl font-bold mb-10 text-center">{t('home.testimonials_title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-700 mb-4">
            {t('home.testimonial1')}
          </p>
          <p className="font-semibold">{t('home.testimonial1_author')}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-700 mb-4">
            {t('home.testimonial2')}
          </p>
          <p className="font-semibold">{t('home.testimonial2_author')}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-700 mb-4">
            {t('home.testimonial3')}
          </p>
          <p className="font-semibold">{t('home.testimonial3_author')}</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
