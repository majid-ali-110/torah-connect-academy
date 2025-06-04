
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const FAQ = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-10">{t('home.faq_title')}</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">{t('home.faq_who_title')}</h3>
          <p className="text-gray-700">
            {t('home.faq_who_content')}
          </p>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2">{t('home.faq_courses_title')}</h3>
          <p className="text-gray-700">
            {t('home.faq_courses_content')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
