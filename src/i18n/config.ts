
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define translations inline to avoid import issues
const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "teachers": "Find Teachers",
        "courses": "Courses",
        "dashboard": "Dashboard",
        "login": "Login",
        "signup": "Sign Up",
        "logout": "Logout"
      },
      "dashboard": {
        "student": {
          "title": "Student Dashboard"
        },
        "teacher": {
          "title": "Teacher Dashboard"
        },
        "learning_streak": "Learning Streak",
        "my_teachers": "My Teachers",
        "my_courses": "My Courses",
        "course_milestones": "Course Milestones",
        "total_students": "Total Students",
        "active_courses": "Active Courses",
        "avg_progress": "Avg Progress",
        "recent_payouts": "Recent Payouts",
        "teaching_schedule": "Teaching Schedule"
      },
      "common": {
        "progress": "Progress",
        "achieved": "Achieved!",
        "required": "required",
        "best": "Best",
        "days": "days",
        "keep_up": "Keep up the great work!"
      },
      "auth": {
        "select_gender": "Select Gender",
        "gender_male": "Male",
        "gender_female": "Female",
        "language_preference": "Language Preference"
      }
    }
  },
  fr: {
    translation: {
      "nav": {
        "home": "Accueil",
        "teachers": "Trouver des Professeurs",
        "courses": "Cours",
        "dashboard": "Tableau de Bord",
        "login": "Connexion",
        "signup": "Inscription",
        "logout": "Déconnexion"
      },
      "dashboard": {
        "student": {
          "title": "Tableau de Bord Étudiant"
        },
        "teacher": {
          "title": "Tableau de Bord Professeur"
        },
        "learning_streak": "Série d'Apprentissage",
        "my_teachers": "Mes Professeurs",
        "my_courses": "Mes Cours",
        "course_milestones": "Jalons du Cours",
        "total_students": "Total Étudiants",
        "active_courses": "Cours Actifs",
        "avg_progress": "Progrès Moyen",
        "recent_payouts": "Paiements Récents",
        "teaching_schedule": "Horaire d'Enseignement"
      },
      "common": {
        "progress": "Progrès",
        "achieved": "Accompli!",
        "required": "requis",
        "best": "Meilleur",
        "days": "jours",
        "keep_up": "Continuez ce bon travail!"
      },
      "auth": {
        "select_gender": "Sélectionnez le Genre",
        "gender_male": "Homme",
        "gender_female": "Femme",
        "language_preference": "Préférence Linguistique"
      }
    }
  },
  de: {
    translation: {
      "nav": {
        "home": "Startseite",
        "teachers": "Lehrer Finden",
        "courses": "Kurse",
        "dashboard": "Dashboard",
        "login": "Anmelden",
        "signup": "Registrieren",
        "logout": "Abmelden"
      },
      "dashboard": {
        "student": {
          "title": "Studenten Dashboard"
        },
        "teacher": {
          "title": "Lehrer Dashboard"
        },
        "learning_streak": "Lernstreak",
        "my_teachers": "Meine Lehrer",
        "my_courses": "Meine Kurse",
        "course_milestones": "Kurs-Meilensteine",
        "total_students": "Gesamte Studenten",
        "active_courses": "Aktive Kurse",
        "avg_progress": "Durchschn. Fortschritt",
        "recent_payouts": "Letzte Auszahlungen",
        "teaching_schedule": "Unterrichtsplan"
      },
      "common": {
        "progress": "Fortschritt",
        "achieved": "Erreicht!",
        "required": "erforderlich",
        "best": "Beste",
        "days": "Tage",
        "keep_up": "Weiter so!"
      },
      "auth": {
        "select_gender": "Geschlecht Auswählen",
        "gender_male": "Männlich",
        "gender_female": "Weiblich",
        "language_preference": "Sprachpräferenz"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'de'],
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    resources,

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
