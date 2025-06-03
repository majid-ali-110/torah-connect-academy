
import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
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
  const { language, setLanguage } = useLanguage();
  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 px-0 hover:bg-gray-100 transition-colors"
          aria-label="Select language"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center"
          >
            <Globe className="h-4 w-4" />
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32 bg-white border shadow-lg">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-2 cursor-pointer ${
              language === lang.code ? 'bg-gray-100' : ''
            }`}
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span>{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
            </motion.div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
