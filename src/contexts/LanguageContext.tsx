import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    // Set language from user profile if available
    if (profile?.preferred_language && profile.preferred_language !== currentLanguage) {
      i18n.changeLanguage(profile.preferred_language);
      setCurrentLanguage(profile.preferred_language);
    }
  }, [profile?.preferred_language, i18n, currentLanguage]);

  const setLanguage = async (lang: string) => {
    // Change language in i18next
    await i18n.changeLanguage(lang);
    setCurrentLanguage(lang); // Update state to trigger re-render
    
    // Update user profile if logged in
    if (user && profile) {
      try {
        await supabase
          .from('profiles')
          .update({ preferred_language: lang })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error updating language preference:', error);
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ language: currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
