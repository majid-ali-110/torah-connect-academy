
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
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set language from user profile if available, otherwise use localStorage or browser default
    const savedLanguage = localStorage.getItem('preferred_language');
    const targetLanguage = profile?.preferred_language || savedLanguage || 'en';
    
    if (targetLanguage !== i18n.language) {
      console.log('LanguageProvider: Setting initial language to:', targetLanguage);
      i18n.changeLanguage(targetLanguage).catch(error => {
        console.error('LanguageProvider: Error setting initial language:', error);
      });
    }
  }, [profile?.preferred_language, i18n]);

  const setLanguage = async (lang: string) => {
    if (isUpdating) return; // Prevent multiple simultaneous updates
    
    setIsUpdating(true);
    setError(null);

    try {
      console.log('LanguageProvider: Changing language to:', lang);
      
      // Change language in i18next first (this should always work)
      await i18n.changeLanguage(lang);
      
      // Save to localStorage as backup
      localStorage.setItem('preferred_language', lang);
      
      // Update user profile if logged in (this might fail if DB is down)
      if (user && profile) {
        try {
          console.log('LanguageProvider: Updating user profile language preference');
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ preferred_language: lang })
            .eq('id', user.id);
          
          if (updateError) {
            console.error('LanguageProvider: Database update failed:', updateError);
            // Don't throw here - the language change in UI still worked
            setError('Language changed locally, but failed to save to your profile. Changes may not persist across devices.');
          } else {
            console.log('LanguageProvider: Successfully updated language preference in database');
          }
        } catch (dbError) {
          console.error('LanguageProvider: Database connection error:', dbError);
          setError('Language changed locally, but couldn\'t connect to save your preference. Changes may not persist across devices.');
        }
      }
    } catch (i18nError) {
      console.error('LanguageProvider: Error changing language:', i18nError);
      setError('Failed to change language. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      language: i18n.language, 
      setLanguage, 
      t, 
      isUpdating, 
      error 
    }}>
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
