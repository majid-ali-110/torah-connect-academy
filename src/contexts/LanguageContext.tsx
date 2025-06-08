
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  isUpdating: boolean;
  error: string | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [isUpdating] = useState(false);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // Always set to French
    i18n.changeLanguage('fr');
    setCurrentLanguage('fr');
  }, [i18n]);

  const setLanguage = async (lang: string) => {
    // Language is fixed to French, no changes allowed
    console.log('Language is fixed to French');
  };

  return (
    <LanguageContext.Provider value={{ language: currentLanguage, setLanguage, t, isUpdating, error }}>
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
