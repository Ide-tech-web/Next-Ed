import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const translations = {
  fr: {
    // Auth
    login: 'Connexion',
    register: 'Inscription',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    firstName: 'Prénom',
    lastName: 'Nom',
    forgotPassword: 'Mot de passe oublié ?',
    noAccount: 'Pas encore de compte ?',
    haveAccount: 'Déjà un compte ?',
    loginHere: 'Se connecter ici',
    registerHere: 'S\'inscrire ici',
    welcome: 'Bienvenue sur NEXT-ED',
    welcomeSubtitle: 'Tu trouveras ici tous les anciens sujets et cours de ta filière',
    or: 'ou',
    continueWithGoogle: 'Continuer avec Google',
    googleLoginSuccess: 'Connexion Google réussie !',
    checkEmailVerification: 'Veuillez vérifier votre email pour activer votre compte.',
    emailVerified: 'Email vérifié avec succès !',
    verificationFailed: 'Échec de la vérification',
    verifying: 'Vérification en cours...',
    redirectingToLogin: 'Redirection vers la page de connexion...',
    tryAgain: 'Réessayer',
    passwordsDoNotMatch: 'Les mots de passe ne correspondent pas',

    // Navigation
    home: 'Accueil',
    dashboard: 'Tableau de bord',
    myDashboard: 'Mon Tableau de Bord',
    studyHub: 'Espace Études',
    returnBack: 'Retour',

    // Courses
    courses: 'Cours disponibles',
    allCourses: 'Tous les cours',
    noCourses: 'Aucun cours disponible pour le moment',
    searchCourses: 'Rechercher un cours...',
    courseCreated: 'Cours créé avec succès !',
    courseUpdated: 'Cours mis à jour avec succès !',
    courseDeleted: 'Cours supprimé avec succès',
    editCourse: 'Modifier le cours',
    newCourse: 'Nouveau cours',
    createCourse: 'Créer un nouveau cours',
    lessons: 'leçons',
    quiz: 'quiz',

    // Progress
    myProgress: 'Ma Progression',
    progress: 'Progression',
    completedItems: 'Éléments terminés',
    personalStats: 'Statistiques Personnelles',
    completedLessons: 'Leçons terminées',
    completedQuizzes: 'Quiz terminés',
    overallProgress: 'Progression Globale',
    noProgressYet: 'Tu n\'as pas encore commencé de cours. Explore l\'Espace Études !',

    // Questions / Q&A
    questions: 'Questions',
    myQuestions: 'Mes Questions',
    askQuestion: 'Poser une question',
    newQuestion: 'Nouvelle question',
    askQuestionBtn: '➕ Poser une question',
    cancelBtn: '✕ Annuler',
    questionPlaceholder: 'Décrivez votre question en détail...',
    sendQuestion: 'Envoyer la question',
    courseOptional: 'Cours (optionnel)',
    selectCourse: '-- Sélectionner un cours --',
    yourQuestion: 'Votre question',
    noQuestionsYet: 'Vous n\'avez pas encore posé de questions',
    questionsHelp: 'Posez vos questions et recevez de l\'aide de vos professeurs',
    viewResponse: 'Voir la réponse',
    responses: 'Réponse(s)',
    noResponseYet: 'Aucune réponse pour le moment',
    close: 'Fermer',
    thread: 'Fil de discussion',
    showThread: 'Voir le fil',
    hideThread: 'Masquer le fil',

    // Admin Q&A
    studentQuestions: 'Questions des Étudiants',
    pending: 'En attente',
    answered: 'Répondues',
    all: 'Toutes',
    noPendingQuestions: 'Aucune question en attente',
    noQuestions: 'Aucune question',
    reply: 'Répondre',
    replyToQuestion: 'Répondre à la question',
    studentQuestion: 'Question de l\'étudiant:',
    yourResponse: 'Votre réponse',
    responsePlaceholder: 'Écrivez votre réponse détaillée...',
    sendResponse: 'Envoyer la réponse',
    sending: 'Envoi...',
    responseSent: 'Réponse envoyée avec succès !',
    responseError: 'Erreur lors de l\'envoi de la réponse',
    questionSent: 'Question posée avec succès !',
    questionError: 'Erreur lors de la soumission de la question',
    from: 'De',
    courseId: 'Cours ID',
    answeredStatus: '✓ Répondue',
    pendingStatus: '⏳ En attente',

    // Admin Dashboard
    adminDashboard: 'Tableau de bord Admin',
    welcomeAdmin: 'Bienvenue',
    quickActions: 'Actions rapides',
    manageCourses: 'Gérer les cours',
    createManageCourses: 'Créer et gérer les cours',
    uploadResources: 'Uploader des ressources',
    uploadResourcesDesc: 'Notes, TD, Examens',
    manageStudents: 'Gérer les Étudiants',
    manageStudentsDesc: 'Voir progression et supprimer',
    staffManagement: 'Gestion du Personnel',
    staffManagementDesc: 'Délégués et Administrateurs',
    answerQuestions: 'Répondre aux questions',
    answerQuestionsDesc: 'en attente',
    homeLink: 'Accueil',
    homeLinkDesc: 'Retour à la page principale',
    coursesCount: 'Cours',
    studentsCount: 'Étudiants',
    delegatesCount: 'Délégués',
    adminsCount: 'Admins',
    pendingQuestionsCount: 'Questions en attente',
    notesCount: 'Notes',

    // Student Management
    studentManagement: 'Gestion des Étudiants',
    studentManagementDesc: 'Gérez les comptes étudiants et suivez leur progression',
    totalStudents: 'Total Étudiants',
    haveStarted: 'Ont Commencé',
    averageProgress: 'Progression Moyenne',
    searchByNameOrEmail: 'Rechercher par nom ou email...',
    student: 'Étudiant',
    level: 'Niveau',
    registrationDate: 'Date d\'inscription',
    actions: 'Actions',
    deleteBtn: '🗑️ Supprimer',
    deleteConfirm: 'Supprimer le compte de',
    deleteIrreversible: '? Cette action est irréversible.',
    deleteError: 'Erreur lors de la suppression.',
    noStudentsFound: 'Aucun étudiant trouvé',
    viewInfo: '👁️ Voir Infos',
    studentDetails: 'Détails de l\'Étudiant',
    courseProgression: 'Progression des Cours',
    lesson: 'Leçon',
    score: 'Score',
    completedAt: 'Terminé le',
    noCompletedItems: 'Aucun élément terminé',

    // Staff Management
    staff: 'Personnel',

    // Level Selection
    selectLevel: 'Choisissez Votre Niveau',
    selectLevelDesc: 'Accédez aux cours, exercices et examens adaptés à votre année d\'études',
    firstYear: 'Première Année',
    secondYear: 'Deuxième Année',
    thirdYear: 'Troisième Année',
    firstYearDesc: 'Fondamentaux et introduction aux sciences informatiques',
    secondYearDesc: 'Approfondissement des concepts et développement pratique',
    thirdYearDesc: 'Spécialisation et projets avancés',

    // Upload & Resources
    upload: 'Uploader',
    file: 'Fichier',
    title: 'Titre',
    description: 'Description',
    manageResources: 'Gérer les ressources',
    notes: 'Notes de cours',
    exercises: 'T.P & Exercices',
    exams: 'Examens (CC/SN)',
    course: 'Cours associé',
    uploadSuccess: 'Ressource uploadée avec succès !',
    download: 'Télécharger',

    // Actions
    submit: 'Soumettre',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    create: 'Créer',
    search: 'Rechercher',
    save: 'Enregistrer',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ceci ?',
    logout: 'Déconnexion',
    allLevels: 'Tous les niveaux',

    // Passwords
    passwordsDoNotMatch: 'Les mots de passe ne correspondent pas',

    // Misc
    quickStats: 'Statistiques rapides',
    activeSystem: 'Système opérationnel',
    results: 'résultats',
    clearSearch: 'Effacer la recherche',
    loading: 'Chargement...',
    markComplete: '✓ Marquer comme terminé',
    completed: '✅ Terminé',

    // Delegate
    delegateCourses: 'Cours',
    delegateUpload: 'Uploader',
    delegateQuestions: 'Questions',
  },
  en: {
    // Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    forgotPassword: 'Forgot password?',
    noAccount: 'Don\'t have an account yet?',
    haveAccount: 'Already have an account?',
    loginHere: 'Login here',
    registerHere: 'Register here',
    welcome: 'Welcome to NEXT-ED',
    welcomeSubtitle: 'Find all past papers and courses for your major here',
    or: 'or',
    continueWithGoogle: 'Continue with Google',
    googleLoginSuccess: 'Google Login Successful!',
    checkEmailVerification: 'Please check your email to verify your account.',
    emailVerified: 'Email verified successfully!',
    verificationFailed: 'Verification Failed',
    verifying: 'Verifying...',
    redirectingToLogin: 'Redirecting to login...',
    tryAgain: 'Try Again',
    passwordsDoNotMatch: 'Passwords do not match',

    // Navigation
    home: 'Home',
    dashboard: 'Dashboard',
    myDashboard: 'My Dashboard',
    studyHub: 'Study Hub',
    returnBack: 'Back',

    // Courses
    courses: 'Available Courses',
    allCourses: 'All Courses',
    noCourses: 'No courses available at the moment',
    searchCourses: 'Search for a course...',
    courseCreated: 'Course created successfully!',
    courseUpdated: 'Course updated successfully!',
    courseDeleted: 'Course deleted successfully',
    editCourse: 'Edit Course',
    newCourse: 'New Course',
    createCourse: 'Create New Course',
    lessons: 'lessons',
    quiz: 'quiz',

    // Progress
    myProgress: 'My Progress',
    progress: 'Progress',
    completedItems: 'Completed Items',
    personalStats: 'Personal Statistics',
    completedLessons: 'Completed Lessons',
    completedQuizzes: 'Completed Quizzes',
    overallProgress: 'Overall Progress',
    noProgressYet: 'You haven\'t started any courses yet. Explore the Study Hub!',

    // Questions / Q&A
    questions: 'Questions',
    myQuestions: 'My Questions',
    askQuestion: 'Ask a question',
    newQuestion: 'New Question',
    askQuestionBtn: '➕ Ask a question',
    cancelBtn: '✕ Cancel',
    questionPlaceholder: 'Describe your question in detail...',
    sendQuestion: 'Send question',
    courseOptional: 'Course (optional)',
    selectCourse: '-- Select a course --',
    yourQuestion: 'Your question',
    noQuestionsYet: 'You haven\'t asked any questions yet',
    questionsHelp: 'Ask your questions and receive help from your professors',
    viewResponse: 'View response',
    responses: 'Response(s)',
    noResponseYet: 'No response yet',
    close: 'Close',
    thread: 'Thread',
    showThread: 'Show thread',
    hideThread: 'Hide thread',

    // Admin Q&A
    studentQuestions: 'Student Questions',
    pending: 'Pending',
    answered: 'Answered',
    all: 'All',
    noPendingQuestions: 'No pending questions',
    noQuestions: 'No questions',
    reply: 'Reply',
    replyToQuestion: 'Reply to question',
    studentQuestion: 'Student\'s question:',
    yourResponse: 'Your response',
    responsePlaceholder: 'Write your detailed response...',
    sendResponse: 'Send response',
    sending: 'Sending...',
    responseSent: 'Response sent successfully!',
    responseError: 'Error sending the response',
    questionSent: 'Question submitted successfully!',
    questionError: 'Error submitting the question',
    from: 'From',
    courseId: 'Course ID',
    answeredStatus: '✓ Answered',
    pendingStatus: '⏳ Pending',

    // Admin Dashboard
    adminDashboard: 'Admin Dashboard',
    welcomeAdmin: 'Welcome',
    quickActions: 'Quick Actions',
    manageCourses: 'Manage Courses',
    createManageCourses: 'Create and manage courses',
    uploadResources: 'Upload Resources',
    uploadResourcesDesc: 'Notes, TP, Exams',
    manageStudents: 'Manage Students',
    manageStudentsDesc: 'View progress and delete',
    staffManagement: 'Staff Management',
    staffManagementDesc: 'Delegates and Administrators',
    answerQuestions: 'Answer Questions',
    answerQuestionsDesc: 'pending',
    homeLink: 'Home',
    homeLinkDesc: 'Back to the main page',
    coursesCount: 'Courses',
    studentsCount: 'Students',
    delegatesCount: 'Delegates',
    adminsCount: 'Admins',
    pendingQuestionsCount: 'Pending Questions',
    notesCount: 'Notes',

    // Student Management
    studentManagement: 'Student Management',
    studentManagementDesc: 'Manage student accounts and track their progress',
    totalStudents: 'Total Students',
    haveStarted: 'Have Started',
    averageProgress: 'Average Progress',
    searchByNameOrEmail: 'Search by name or email...',
    student: 'Student',
    level: 'Level',
    registrationDate: 'Registration Date',
    actions: 'Actions',
    deleteBtn: '🗑️ Delete',
    deleteConfirm: 'Delete account of',
    deleteIrreversible: '? This action is irreversible.',
    deleteError: 'Error during deletion.',
    noStudentsFound: 'No students found',
    viewInfo: '👁️ View Info',
    studentDetails: 'Student Details',
    courseProgression: 'Course Progression',
    lesson: 'Lesson',
    score: 'Score',
    completedAt: 'Completed on',
    noCompletedItems: 'No completed items',

    // Staff Management
    staff: 'Staff',

    // Level Selection
    selectLevel: 'Choose Your Level',
    selectLevelDesc: 'Access courses, exercises and exams suited to your year of study',
    firstYear: 'First Year',
    secondYear: 'Second Year',
    thirdYear: 'Third Year',
    firstYearDesc: 'Fundamentals and introduction to computer science',
    secondYearDesc: 'Deepening concepts and practical development',
    thirdYearDesc: 'Specialization and advanced projects',

    // Upload & Resources
    upload: 'Upload',
    file: 'File',
    title: 'Title',
    description: 'Description',
    manageResources: 'Manage Resources',
    notes: 'Course Notes',
    exercises: 'P.E & Exercises',
    exams: 'Exams (CC/SN)',
    course: 'Associated Course',
    uploadSuccess: 'Resource uploaded successfully!',
    download: 'Download',

    // Actions
    submit: 'Submit',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    save: 'Save',
    confirmDelete: 'Are you sure you want to delete this?',
    logout: 'Logout',
    allLevels: 'All Levels',

    // Passwords
    passwordsDoNotMatch: 'Passwords do not match',

    // Misc
    quickStats: 'Quick Stats',
    activeSystem: 'System Active',
    results: 'results',
    clearSearch: 'Clear search',
    loading: 'Loading...',
    markComplete: '✓ Mark as completed',
    completed: '✅ Completed',

    // Delegate
    delegateCourses: 'Courses',
    delegateUpload: 'Upload',
    delegateQuestions: 'Questions',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'fr';
  });

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLang = prev === 'fr' ? 'en' : 'fr';
      localStorage.setItem('language', newLang);
      return newLang;
    });
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
