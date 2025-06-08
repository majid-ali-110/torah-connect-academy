import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set language from user profile if available
    if (profile?.preferred_language && profile.preferred_language !== currentLanguage) {
      i18n.changeLanguage(profile.preferred_language);
      setCurrentLanguage(profile.preferred_language);
    }
  }, [profile?.preferred_language, i18n]); // Removed currentLanguage to prevent potential infinite loops

  const setLanguage = async (lang: string) => {
    setIsUpdating(true);
    setError(null);
    
    try {
      // Change language in i18next
      await i18n.changeLanguage(lang);
      setCurrentLanguage(lang); // Update state to trigger re-render
      
      // Update user profile if logged in
      if (user && profile) {
        try {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ preferred_language: lang })
            .eq('id', user.id);
            
          if (updateError) {
            console.error('Error updating language preference:', updateError);
            setError('Failed to save preference to profile');
          }
        } catch (err) {
          console.error('Error updating language preference:', err);
          setError('Failed to save preference to profile');
        }
      }
    } catch (err) {
      console.error('Error changing language:', err);
      setError('Failed to change language');
    } finally {
      setIsUpdating(false);
    }
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
