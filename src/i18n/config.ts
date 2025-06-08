
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      // Navigation
      home: "Accueil",
      findTeachers: "Trouver Professeurs",
      courses: "Cours",
      womenCourses: "Cours pour Femmes",
      childrenCourses: "Cours pour Enfants",
      liveCourses: "Cours en Direct",
      findPartner: "Trouver Partenaire",
      beitMidrash: "Beit Midrash",
      rabbisDirectory: "Annuaire Rabbins",
      contact: "Contact",
      support: "Support",
      profile: "Profil",
      dashboard: "Tableau de Bord",
      chat: "Messages",
      signIn: "Se Connecter",
      signUp: "S'Inscrire",
      signOut: "Se Déconnecter",

      // Hero Section
      heroTitle: "Trouvez Votre Partenaire d'Étude Torah Parfait",
      heroSubtitle: "Connectez-vous avec des enseignants Torah expérimentés pour des expériences d'apprentissage personnalisées",
      findTeachersButton: "Trouver des Professeurs",
      studyPartnersButton: "Partenaires d'Étude",
      searchPlaceholder: "Rechercher par matière, nom de professeur, ou mots-clés...",
      searchButton: "Rechercher",
      findTeachersOrPartners: "Trouvez des Professeurs ou Partenaires d'Étude",

      // Feature Blocks
      exploreServices: "Explorez Nos Services",
      servicesDescription: "Trouvez l'expérience d'apprentissage parfaite adaptée à vos besoins et préférences",
      findTeacherTitle: "Trouver un Professeur",
      findTeacherDesc: "Connectez-vous avec des rabbins et enseignants qualifiés",
      liveCoursesTitle: "Cours en Direct",
      liveCoursesDesc: "Participez à des sessions d'apprentissage en direct",
      childrenCoursesTitle: "Cours pour Enfants",
      childrenCoursesDesc: "Programmes spécialement conçus pour les jeunes apprenants",
      studyPartnerTitle: "Partenaire d'Étude",
      studyPartnerDesc: "Trouvez des partenaires pour étudier ensemble",

      // Study Partner Section
      findStudyPartner: "Trouvez Votre Partenaire d'Étude",
      studyPartnerDescription: "Connectez-vous avec d'autres étudiants pour un apprentissage collaboratif et un soutien mutuel",
      studyGroups: "Groupes d'Étude",
      studyGroupsDesc: "Rejoignez des groupes d'étude avec des étudiants de votre niveau",
      collaborativeLearning: "Sessions d'apprentissage collaboratif",
      peerTeaching: "Enseignement entre pairs",
      sharedSchedules: "Horaires d'étude partagés",
      discussionForums: "Forums de Discussion",
      discussionForumsDesc: "Participez à des discussions enrichissantes sur vos études",
      askQuestions: "Posez des questions et obtenez des réponses",
      shareInsights: "Partagez vos idées et découvertes",
      buildFriendships: "Construisez des amitiés durables",
      flexibleScheduling: "Planification Flexible",
      flexibleSchedulingDesc: "Trouvez des partenaires qui correspondent à votre disponibilité",
      coordinateStudyTimes: "Coordonnez les horaires d'étude",
      weeklyGroupSessions: "Sessions de groupe hebdomadaires",
      emergencyStudyHelp: "Aide d'étude d'urgence",
      findStudyPartnersButton: "Trouver des Partenaires d'Étude",

      // Subject Cards
      findTeacherBySubject: "Trouver un professeur par matière",
      teachers: "professeurs",
      noSubjectsAvailable: "Aucune matière avec professeurs disponible pour le moment.",

      // Profile
      personalInformation: "Informations Personnelles",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email",
      phone: "Téléphone",
      location: "Localisation",
      bio: "Biographie",
      experience: "Expérience",
      subjects: "Matières",
      languages: "Langues",
      audiences: "Public",
      hourlyRate: "Tarif Horaire",
      saveChanges: "Sauvegarder les Modifications",
      profileUpdated: "Profil mis à jour avec succès",
      updateError: "Erreur lors de la mise à jour du profil",

      // Find Teachers
      searchTeachers: "Rechercher des Professeurs",
      searchBySubject: "Rechercher par matière, nom ou localisation...",
      filterBySubject: "Filtrer par Matière",
      allSubjects: "Toutes les Matières",
      filterByAudience: "Filtrer par Public",
      allAudiences: "Tous les Publics",
      noTeachersFound: "Aucun professeur trouvé",
      loading: "Chargement...",
      perHour: "par heure",
      viewProfile: "Voir le Profil",
      yearsExperience: "ans d'expérience",

      // Common
      yes: "Oui",
      no: "Non",
      cancel: "Annuler",
      save: "Sauvegarder",
      edit: "Modifier",
      delete: "Supprimer",
      confirm: "Confirmer",
      close: "Fermer",
      next: "Suivant",
      previous: "Précédent",
      submit: "Soumettre",
      search: "Rechercher",
      filter: "Filtrer",
      sort: "Trier",
      date: "Date",
      time: "Heure",
      status: "Statut",
      price: "Prix",
      duration: "Durée",
      description: "Description",
      title: "Titre",
      name: "Nom",
      category: "Catégorie",
      type: "Type",
      level: "Niveau",
      beginner: "Débutant",
      intermediate: "Intermédiaire",
      advanced: "Avancé",
      all: "Tous",
      male: "Hommes",
      female: "Femmes",
      children: "Enfants",
      adults: "Adultes",
      families: "Familles",
      young: "Jeunes",

      // Dashboard
      welcome: "Bon retour",
      manageTeachingActivities: "Gérez vos activités d'enseignement",
      learningDashboard: "Voici votre tableau de bord d'apprentissage",
      totalStudents: "Total Étudiants",
      noStudentsYet: "Aucun étudiant pour le moment",
      messages: "Messages",
      viewMessages: "Voir les Messages",
      thisMonth: "Ce Mois",
      revenue: "Revenus",
      upcomingClasses: "Cours Prochains",
      today: "Aujourd'hui",
      teachingHoursTracking: "Suivi des Heures d'Enseignement",
      studyHoursTracking: "Suivi des Heures d'Étude",
      todaysSchedule: "Planning d'Aujourd'hui",
      noClassesToday: "Aucun cours programmé pour aujourd'hui",
      recentActivity: "Activité Récente",
      noRecentActivity: "Aucune activité récente",
      upcomingCourses: "Cours Prochains",
      noScheduledClasses: "Aucun cours programmé",
      learningProgress: "Progrès d'Apprentissage",
      startLearningToday: "Commencez votre parcours d'apprentissage aujourd'hui!",

      // Study Hours Tracker
      totalStudyTime: "Temps d'Étude Total",
      lastSession: "Dernière Session",
      noSessionsYet: "Aucune session encore",
      sessionsCompleted: "Sessions Terminées",
      recentStudySessions: "Sessions d'Étude Récentes",
      noStudySessionsYet: "Aucune session d'étude encore",
      generalStudy: "Étude Générale",
      with: "avec",
      noDate: "Aucune date",

      // Video Call
      meetingNotFound: "Réunion non trouvée",
      returnToDashboard: "Retour au Tableau de Bord",

      // Errors and Messages
      authenticationRequired: "Authentification requise",
      unauthorized: "Non autorisé",
      errorOccurred: "Une erreur s'est produite",
      success: "Succès",
      error: "Erreur",
      warning: "Avertissement",
      info: "Information",
      loadingError: "Erreur de chargement",
      networkError: "Erreur réseau",
      serverError: "Erreur serveur",
      notFound: "Non trouvé",
      accessDenied: "Accès refusé",
      sessionExpired: "Session expirée",
      invalidInput: "Entrée invalide",
      requiredField: "Champ requis",
      emailInvalid: "Email invalide",
      passwordTooShort: "Mot de passe trop court",
      passwordsDoNotMatch: "Les mots de passe ne correspondent pas",

      // Time and Date
      minutes: "minutes",
      hours: "heures",
      days: "jours",
      weeks: "semaines",
      months: "mois",
      years: "années",
      ago: "il y a",
      morning: "matin",
      afternoon: "après-midi",
      evening: "soir",
      night: "nuit",
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
      sunday: "Dimanche",
      january: "Janvier",
      february: "Février",
      march: "Mars",
      april: "Avril",
      may: "Mai",
      june: "Juin",
      july: "Juillet",
      august: "Août",
      september: "Septembre",
      october: "Octobre",
      november: "Novembre",
      december: "Décembre"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // Force French as default
    fallbackLng: 'fr',
    supportedLngs: ['fr'], // Only support French
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage'], // Only check localStorage, ignore browser language
      caches: ['localStorage'],
    },
  });

export default i18n;
