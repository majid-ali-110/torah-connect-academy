
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

const LanguageSelector = () => {
  const { language, setLanguage, isUpdating, error } = useLanguage();
  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = async (langCode: string) => {
    if (langCode !== language && !isUpdating) {
      await setLanguage(langCode);
    }
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 px-0 hover:bg-gray-100 transition-colors"
            aria-label="Select language"
            disabled={isUpdating}
          >
            <motion.div
              whileHover={{ scale: isUpdating ? 1 : 1.1 }}
              whileTap={{ scale: isUpdating ? 1 : 0.9 }}
              className="flex items-center"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
            </motion.div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 bg-white border shadow-lg">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              disabled={isUpdating}
              className={`flex items-center gap-2 cursor-pointer ${
                language === lang.code ? 'bg-gray-100' : ''
              } ${isUpdating ? 'opacity-50' : ''}`}
            >
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <span>{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
                {language === lang.code && (
                  <span className="text-xs text-green-600">✓</span>
                )}
              </motion.div>
            </DropdownMenuItem>
          ))}
          {error && (
            <div className="px-2 py-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>Offline mode</span>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
