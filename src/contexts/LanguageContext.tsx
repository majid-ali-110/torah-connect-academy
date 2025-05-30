
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.teachers': 'Find Teachers',
    'nav.courses': 'Courses',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.logout': 'Logout',
    'dashboard.student.title': 'Student Dashboard',
    'dashboard.teacher.title': 'Teacher Dashboard',
    'dashboard.learning_streak': 'Learning Streak',
    'dashboard.my_teachers': 'My Teachers',
    'dashboard.my_courses': 'My Courses',
    'dashboard.course_milestones': 'Course Milestones',
    'dashboard.total_students': 'Total Students',
    'dashboard.active_courses': 'Active Courses',
    'dashboard.avg_progress': 'Avg Progress',
    'dashboard.recent_payouts': 'Recent Payouts',
    'dashboard.teaching_schedule': 'Teaching Schedule',
    'common.progress': 'Progress',
    'common.achieved': 'Achieved!',
    'common.required': 'required',
    'common.best': 'Best',
    'common.days': 'days',
    'common.keep_up': 'Keep up the great work!',
    'auth.select_gender': 'Select Gender',
    'auth.gender_male': 'Male',
    'auth.gender_female': 'Female',
    'auth.language_preference': 'Language Preference'
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.teachers': 'Trouver des Professeurs',
    'nav.courses': 'Cours',
    'nav.dashboard': 'Tableau de Bord',
    'nav.login': 'Connexion',
    'nav.signup': 'Inscription',
    'nav.logout': 'Déconnexion',
    'dashboard.student.title': 'Tableau de Bord Étudiant',
    'dashboard.teacher.title': 'Tableau de Bord Professeur',
    'dashboard.learning_streak': 'Série d\'Apprentissage',
    'dashboard.my_teachers': 'Mes Professeurs',
    'dashboard.my_courses': 'Mes Cours',
    'dashboard.course_milestones': 'Jalons du Cours',
    'dashboard.total_students': 'Total Étudiants',
    'dashboard.active_courses': 'Cours Actifs',
    'dashboard.avg_progress': 'Progrès Moyen',
    'dashboard.recent_payouts': 'Paiements Récents',
    'dashboard.teaching_schedule': 'Horaire d\'Enseignement',
    'common.progress': 'Progrès',
    'common.achieved': 'Accompli!',
    'common.required': 'requis',
    'common.best': 'Meilleur',
    'common.days': 'jours',
    'common.keep_up': 'Continuez ce bon travail!',
    'auth.select_gender': 'Sélectionnez le Genre',
    'auth.gender_male': 'Homme',
    'auth.gender_female': 'Femme',
    'auth.language_preference': 'Préférence Linguistique'
  },
  de: {
    'nav.home': 'Startseite',
    'nav.teachers': 'Lehrer Finden',
    'nav.courses': 'Kurse',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Anmelden',
    'nav.signup': 'Registrieren',
    'nav.logout': 'Abmelden',
    'dashboard.student.title': 'Studenten Dashboard',
    'dashboard.teacher.title': 'Lehrer Dashboard',
    'dashboard.learning_streak': 'Lernstreak',
    'dashboard.my_teachers': 'Meine Lehrer',
    'dashboard.my_courses': 'Meine Kurse',
    'dashboard.course_milestones': 'Kurs-Meilensteine',
    'dashboard.total_students': 'Gesamte Studenten',
    'dashboard.active_courses': 'Aktive Kurse',
    'dashboard.avg_progress': 'Durchschn. Fortschritt',
    'dashboard.recent_payouts': 'Letzte Auszahlungen',
    'dashboard.teaching_schedule': 'Unterrichtsplan',
    'common.progress': 'Fortschritt',
    'common.achieved': 'Erreicht!',
    'common.required': 'erforderlich',
    'common.best': 'Beste',
    'common.days': 'Tage',
    'common.keep_up': 'Weiter so!',
    'auth.select_gender': 'Geschlecht Auswählen',
    'auth.gender_male': 'Männlich',
    'auth.gender_female': 'Weiblich',
    'auth.language_preference': 'Sprachpräferenz'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const [language, setLanguageState] = useState(() => {
    // Get language from localStorage first, then profile, then default to 'en'
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || profile?.preferred_language || 'en';
  });

  useEffect(() => {
    if (profile?.preferred_language && profile.preferred_language !== language) {
      setLanguageState(profile.preferred_language);
    }
  }, [profile?.preferred_language, language]);

  const setLanguage = async (lang: string) => {
    setLanguageState(lang);
    
    // Store in localStorage
    localStorage.setItem('language', lang);
    
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

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
