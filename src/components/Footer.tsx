
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-100 py-10 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">E-team.torah</h3>
            <p className="text-gray-600 mb-4">
              {t('footer.description')}
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.quick_links')}</h3>
            <ul className="space-y-2">
              <li><Link to="/rabbanim" className="text-gray-600 hover:text-torah-600">{t('footer.rabbis_directory')}</Link></li>
              <li><Link to="/eleves" className="text-gray-600 hover:text-torah-600">{t('footer.students_section')}</Link></li>
              <li><Link to="/femmes" className="text-gray-600 hover:text-torah-600">{t('footer.women_section')}</Link></li>
              <li><Link to="/beit-hamidrash" className="text-gray-600 hover:text-torah-600">{t('footer.online_beit_midrash')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-600 hover:text-torah-600">{t('footer.faq')}</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-torah-600">{t('footer.blog')}</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-torah-600">{t('footer.contact')}</Link></li>
              <li><Link to="/support" className="text-gray-600 hover:text-torah-600">{t('footer.tech_support')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li><Link to="/conditions" className="text-gray-600 hover:text-torah-600">{t('footer.terms')}</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-torah-600">{t('footer.privacy')}</Link></li>
              <li><Link to="/cookies" className="text-gray-600 hover:text-torah-600">{t('footer.cookies')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} E-team.torah. {t('footer.rights_reserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
