
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, BookOpen, Users, Star } from 'lucide-react';

const Footer = () => {
  const { profile } = useAuth();
  const { t } = useLanguage();

  // Dynamic gender-based section
  const getGenderSpecificSection = () => {
    if (profile?.gender === 'female') {
      return {
        title: "Section Femmes",
        link: "/women-courses",
        icon: <Star className="w-4 h-4" />
      };
    } else if (profile?.gender === 'male') {
      return {
        title: "Section Hommes", 
        link: "/men-courses",
        icon: <Users className="w-4 h-4" />
      };
    } else {
      return {
        title: "Cours pour Tous",
        link: "/courses",
        icon: <BookOpen className="w-4 h-4" />
      };
    }
  };

  const genderSection = getGenderSpecificSection();

  const quickLinks = [
    { name: t('footer.courses'), path: '/find-teachers' },
    { name: 'Live Courses', path: '/live-courses' },
    { name: genderSection.title, path: genderSection.link },
    { name: t('footer.children'), path: '/children-courses' },
    { name: t('footer.partners'), path: '/find-partner' }
  ];

  const handleSectionClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    
    // Scroll to top first for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Navigate after a short delay
    setTimeout(() => {
      window.location.href = path;
    }, 300);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <a
                    href={link.path}
                    onClick={(e) => handleSectionClick(e, link.path)}
                    className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Gender-specific Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              {genderSection.icon}
              <span className="ml-2">{genderSection.title}</span>
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={genderSection.link}
                  onClick={(e) => handleSectionClick(e, genderSection.link)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  Cours spécialisés
                </a>
              </li>
              <li>
                <a
                  href="/find-teachers"
                  onClick={(e) => handleSectionClick(e, '/find-teachers')}
                  className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  Trouver un enseignant
                </a>
              </li>
              <li>
                <a
                  href="/beit-hamidrash"
                  onClick={(e) => handleSectionClick(e, '/beit-hamidrash')}
                  className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  Beit HaMidrash
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              {t('footer.support')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/faq"
                  onClick={(e) => handleSectionClick(e, '/faq')}
                  className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {t('footer.faq')}
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleSectionClick(e, '/contact')}
                  className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {t('footer.contact')}
                </a>
              </li>
              <li>
                <a
                  href="/support"
                  onClick={(e) => handleSectionClick(e, '/support')}
                  className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/conditions"
                  onClick={(e) => handleSectionClick(e, '/conditions')}
                  className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {t('footer.terms')}
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => handleSectionClick(e, '/privacy')}
                  className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a
                  href="/cookies"
                  onClick={(e) => handleSectionClick(e, '/cookies')}
                  className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {t('footer.cookies')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Torah Study Platform. {t('footer.rights')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
