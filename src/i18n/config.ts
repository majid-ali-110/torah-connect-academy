
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
      },
      "home": {
        "faq_title": "Frequently Asked Questions",
        "faq_who_title": "Who is this site for?",
        "faq_who_content": "For anyone wanting to set aside time for study in their day: whether men, women or even children (help with school or bar mitzvah preparation)",
        "faq_courses_title": "What types of courses are offered?",
        "faq_courses_content": "Interactive live courses with a Rabbi on the desired subject",
        "how_it_works_title": "How does it work?",
        "how_step1": "Search for a course or Rabbi.",
        "how_step2": "Choose the desired Rabbi.",
        "how_step3": "Register for a video conference appointment.",
        "testimonials_title": "User Testimonials",
        "testimonial1": "I always had trouble finding time to study Torah, but thanks to this platform, I was able to dedicate 20 minutes a day to study. I can now schedule my study sessions with a Rabbi at my convenience, and I am very satisfied with how it has helped me balance my life and spiritual growth.",
        "testimonial1_author": "David F.",
        "testimonial2": "As a parent, I have seen a real improvement in my child's Torah learning thanks to the help of the Rabbis available on the platform. My child now has access to personalized lessons and advice, which has made all the difference in their studies.",
        "testimonial2_author": "Michael S.",
        "testimonial3": "Being a student in Spain, without community, I was struggling with my Torah learning. However, this platform allowed me to connect with a Rabbi and schedule regular study sessions. Not only have I progressed in my studies, but I have also formed a friendship with my Rabbi, who has given me valuable advice for succeeding in life.",
        "testimonial3_author": "Jonathan C."
      },
      "footer": {
        "description": "Connection platform between students and Torah teachers for interactive online courses.",
        "quick_links": "Quick Links",
        "rabbis_directory": "Rabbis Directory",
        "students_section": "Students/Children Section",
        "women_section": "Women's Section",
        "online_beit_midrash": "Online Beit Midrash",
        "resources": "Resources",
        "faq": "FAQ",
        "blog": "Blog",
        "contact": "Contact",
        "tech_support": "Technical Support",
        "legal": "Legal",
        "terms": "Terms of Use",
        "privacy": "Privacy Policy",
        "cookies": "Cookie Policy",
        "rights_reserved": "All rights reserved."
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
      },
      "home": {
        "faq_title": "Foire aux Questions",
        "faq_who_title": "Pour qui s'adresse ce site?",
        "faq_who_content": "Pour toutes personnes désirant fixer un moment d'étude dans sa journée: que ça soit homme, femme ou même enfants (aide à l'école ou préparation a la bar mitsva)",
        "faq_courses_title": "Quels types de cours sont proposés ?",
        "faq_courses_content": "Des cours interactif en direct avec un Rav sur la matière désirée",
        "how_it_works_title": "Comment ça marche ?",
        "how_step1": "Rechercher un cours ou un Rav.",
        "how_step2": "Choisir le Rav souhaité.",
        "how_step3": "S'inscrire pour un rendez-vous en visioconférence.",
        "testimonials_title": "Témoignages des utilisateurs",
        "testimonial1": "« J'ai toujours eu mal à trouver le temps d'étudier la Torah, mais grâce à cette plateforme, j'ai pu consacrer 20 minutes par jour à l'étude. Je peux désormais planifier mes sessions d'étude avec un Rav à ma convenance, et je suis très satisfait de la façon dont cela m'a aidé à équilibrer ma vie et ma croissance spirituelle. »",
        "testimonial1_author": "David F.",
        "testimonial2": "« En tant que parent, j'ai constaté une réelle amélioration dans l'apprentissage de la Torah de mon enfant grâce à l'aide des Rabbins disponibles sur la plateforme. Mon enfant a désormais accès à des leçons personnalisées et à des conseils, ce qui a fait toute la différence dans ses études. »",
        "testimonial2_author": "Michael S.",
        "testimonial3": "« Étant étudiant en Espagne, sans communauté, j'avais du mal avec mon apprentissage de la Torah. Cependant, cette plateforme m'a permis de me connecter avec un Rav et de planifier des sessions d'étude régulières. Non seulement j'ai progressé dans mes études, mais j'ai également formé une amitié avec mon Rav, qui m'a donné de précieux conseils pour réussir dans la vie. »",
        "testimonial3_author": "Jonathan C."
      },
      "footer": {
        "description": "Plateforme de connexion entre étudiants et enseignants de Torah pour des cours interactifs en ligne.",
        "quick_links": "Liens rapides",
        "rabbis_directory": "Annuaire des Rabbanim",
        "students_section": "Section pour élèves/enfants",
        "women_section": "Section pour femmes",
        "online_beit_midrash": "Beit Hamidrash en ligne",
        "resources": "Ressources",
        "faq": "FAQ",
        "blog": "Blog",
        "contact": "Contact",
        "tech_support": "Support technique",
        "legal": "Légal",
        "terms": "Conditions d'utilisation",
        "privacy": "Politique de confidentialité",
        "cookies": "Politique de cookies",
        "rights_reserved": "Tous droits réservés."
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
      },
      "home": {
        "faq_title": "Häufig Gestellte Fragen",
        "faq_who_title": "Für wen ist diese Seite?",
        "faq_who_content": "Für alle, die Zeit zum Studieren in ihren Tag einbauen möchten: seien es Männer, Frauen oder sogar Kinder (Hilfe in der Schule oder Bar-Mizwa-Vorbereitung)",
        "faq_courses_title": "Welche Art von Kursen werden angeboten?",
        "faq_courses_content": "Interaktive Live-Kurse mit einem Rabbi zu dem gewünschten Thema",
        "how_it_works_title": "Wie funktioniert es?",
        "how_step1": "Nach einem Kurs oder Rabbi suchen.",
        "how_step2": "Den gewünschten Rabbi auswählen.",
        "how_step3": "Für einen Videokonferenz-Termin anmelden.",
        "testimonials_title": "Nutzerbewertungen",
        "testimonial1": "Ich hatte immer Probleme, Zeit für das Tora-Studium zu finden, aber dank dieser Plattform konnte ich 20 Minuten pro Tag dem Studium widmen. Ich kann jetzt meine Studiensitzungen mit einem Rabbi nach meinen Wünschen planen und bin sehr zufrieden damit, wie es mir geholfen hat, mein Leben und spirituelles Wachstum in Einklang zu bringen.",
        "testimonial1_author": "David F.",
        "testimonial2": "Als Elternteil habe ich eine echte Verbesserung im Tora-Lernen meines Kindes dank der Hilfe der auf der Plattform verfügbaren Rabbis festgestellt. Mein Kind hat jetzt Zugang zu personalisierten Lektionen und Beratung, was den entscheidenden Unterschied in seinen Studien gemacht hat.",
        "testimonial2_author": "Michael S.",
        "testimonial3": "Als Student in Spanien, ohne Gemeinde, hatte ich Schwierigkeiten mit meinem Tora-Lernen. Diese Plattform ermöglichte es mir jedoch, mich mit einem Rabbi zu verbinden und regelmäßige Studiensitzungen zu planen. Ich habe nicht nur in meinen Studien Fortschritte gemacht, sondern auch eine Freundschaft mit meinem Rabbi geknüpft, der mir wertvolle Ratschläge für den Erfolg im Leben gegeben hat.",
        "testimonial3_author": "Jonathan C."
      },
      "footer": {
        "description": "Verbindungsplattform zwischen Studenten und Tora-Lehrern für interaktive Online-Kurse.",
        "quick_links": "Schnelle Links",
        "rabbis_directory": "Rabbi-Verzeichnis",
        "students_section": "Schüler-/Kinderbereich",
        "women_section": "Frauenbereich",
        "online_beit_midrash": "Online Beit Midrash",
        "resources": "Ressourcen",
        "faq": "FAQ",
        "blog": "Blog",
        "contact": "Kontakt",
        "tech_support": "Technischer Support",
        "legal": "Rechtliches",
        "terms": "Nutzungsbedingungen",
        "privacy": "Datenschutzrichtlinie",
        "cookies": "Cookie-Richtlinie",
        "rights_reserved": "Alle Rechte vorbehalten."
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
