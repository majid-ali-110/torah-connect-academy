
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define translations inline to avoid import issues
const resources = {
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
      "admin": {
        "dashboard_title": "Tableau de Bord Admin",
        "dashboard_subtitle": "Gérer les enseignants, utilisateurs et paramètres système",
        "teacher_approval": "Approbation Enseignant",
        "pending_teachers": "Approbations Enseignants en Attente",
        "no_pending_teachers": "Aucun enseignant en attente d'approbation",
        "teacher_approved": "Enseignant Approuvé",
        "teacher_approved_desc": "L'enseignant a été approuvé avec succès",
        "teacher_rejected": "Enseignant Rejeté",
        "teacher_rejected_desc": "La candidature d'enseignant a été rejetée",
        "approval_notes": "Notes d'Approbation (Optionnel)",
        "notes_placeholder": "Ajouter des notes sur cette décision d'approbation...",
        "approve": "Approuver",
        "reject": "Rejeter",
        "review": "Examiner",
        "status_pending": "En Attente",
        "status_approved": "Approuvé",
        "status_rejected": "Rejeté",
        "fetch_teachers_error": "Échec de récupération des enseignants",
        "approval_error": "Échec d'approbation de l'enseignant",
        "rejection_error": "Échec de rejet de l'enseignant",
        "total_users": "Total Utilisateurs",
        "pending_approvals": "Approbations en Attente",
        "approved_teachers": "Enseignants Approuvés",
        "system_status": "État du Système",
        "coming_soon": "Bientôt disponible",
        "teachers_awaiting": "Enseignants en attente d'approbation",
        "active_teachers": "Enseignants actifs",
        "online": "En Ligne",
        "all_systems": "Tous les systèmes opérationnels"
      },
      "common": {
        "progress": "Progrès",
        "achieved": "Accompli!",
        "required": "requis",
        "best": "Meilleur",
        "days": "jours",
        "keep_up": "Continuez ce bon travail!",
        "loading": "Chargement...",
        "error": "Erreur",
        "cancel": "Annuler",
        "save": "Sauvegarder",
        "edit": "Modifier",
        "delete": "Supprimer",
        "bio": "Biographie",
        "subjects": "Matières",
        "experience": "Expérience",
        "search": "Rechercher",
        "filter": "Filtrer",
        "all": "Tous",
        "no_results": "Aucun résultat trouvé",
        "view_profile": "Voir le profil",
        "contact": "Contacter",
        "book_lesson": "Réserver un cours",
        "join_meeting": "Rejoindre la réunion",
        "start_meeting": "Démarrer la réunion",
        "end_meeting": "Terminer la réunion"
      },
      "auth": {
        "select_gender": "Sélectionnez le Genre",
        "gender_male": "Homme",
        "gender_female": "Femme",
        "language_preference": "Préférence Linguistique",
        "account_pending": "Votre compte enseignant est en attente d'approbation",
        "pending_message": "Veuillez attendre qu'un administrateur examine votre candidature",
        "account_rejected": "Votre candidature d'enseignant n'a pas été approuvée",
        "contact_admin": "Veuillez contacter le support pour plus d'informations"
      },
      "teachers": {
        "find_teachers": "Trouver des Professeurs",
        "no_teachers_found": "Aucun professeur trouvé",
        "clear_filters": "Effacer les filtres",
        "search_placeholder": "Rechercher des professeurs...",
        "filter_by_subject": "Filtrer par matière",
        "filter_by_language": "Filtrer par langue",
        "filter_by_audience": "Filtrer par public",
        "hourly_rate": "Tarif horaire",
        "per_hour": "/heure",
        "years_experience": "ans d'expérience",
        "rating": "Note",
        "reviews": "avis"
      },
      "courses": {
        "find_courses": "Trouver des Cours",
        "no_courses_found": "Aucun cours trouvé",
        "course_details": "Détails du cours",
        "instructor": "Instructeur",
        "duration": "Durée",
        "level": "Niveau",
        "price": "Prix",
        "free": "Gratuit",
        "enroll_now": "S'inscrire maintenant",
        "course_overview": "Aperçu du cours"
      },
      "profile": {
        "edit_profile": "Modifier le profil",
        "personal_info": "Informations personnelles",
        "contact_info": "Informations de contact",
        "professional_info": "Informations professionnelles",
        "preferences": "Préférences",
        "save_changes": "Sauvegarder les modifications",
        "cancel_changes": "Annuler les modifications"
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
      },
      "subjects": {
        "torah": "Torah",
        "talmud": "Talmud",
        "mishna": "Mishna",
        "halakha": "Halakha",
        "tanakh": "Tanakh",
        "chassidut": "Hassidisme",
        "kabbalah": "Kabbale",
        "mussar": "Mussar",
        "hebrew": "Hébreu",
        "aramaic": "Araméen",
        "jewish_history": "Histoire juive",
        "philosophy": "Philosophie",
        "ethics": "Éthique",
        "liturgy": "Liturgie"
      },
      "languages": {
        "french": "Français",
        "hebrew": "Hébreu",
        "english": "Anglais",
        "yiddish": "Yiddish",
        "spanish": "Espagnol",
        "german": "Allemand",
        "russian": "Russe"
      },
      "audience": {
        "men": "Hommes",
        "women": "Femmes",
        "children": "Enfants",
        "teenagers": "Adolescents",
        "adults": "Adultes",
        "seniors": "Seniors",
        "beginners": "Débutants",
        "intermediate": "Intermédiaire",
        "advanced": "Avancé"
      },
      "gender": {
        "male": "Homme",
        "female": "Femme",
        "other": "Autre",
        "prefer_not_to_say": "Préfère ne pas dire"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'fr',
    lng: 'fr',
    supportedLngs: ['fr'],
    
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
