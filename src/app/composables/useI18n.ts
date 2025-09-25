import { ref, computed } from 'vue'

export interface Locale {
  code: string
  name: string
  flag: string
}

export interface Translations {
  [key: string]: string | Translations
}

const currentLocale = ref<string>('en')

const locales: Locale[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' }
]

const translations: Record<string, Translations> = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      upload: 'Upload',
      download: 'Download',
      share: 'Share',
      copy: 'Copy',
      paste: 'Paste',
      cut: 'Cut',
      undo: 'Undo',
      redo: 'Redo'
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      name: 'Full Name',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot your password?',
      createAccount: 'Create account',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      welcomeBack: 'Welcome back!',
      accountCreated: 'Account created successfully!',
      signedOut: 'Signed out successfully'
    },
    navigation: {
      home: 'Home',
      library: 'Library',
      tutor: 'Tutor',
      study: 'Study',
      analytics: 'Analytics',
      pricing: 'Pricing',
      account: 'Account',
      dashboard: 'Dashboard'
    },
    library: {
      title: 'Library',
      subtitle: 'Manage your documents and learning materials',
      uploadDocument: 'Upload Document',
      recentDocuments: 'Recent Documents',
      allDocuments: 'All Documents',
      documentTypes: 'Document Types',
      tags: 'Tags',
      status: 'Status',
      createdAt: 'Created',
      size: 'Size',
      duration: 'Duration',
      noDocuments: 'No documents yet',
      uploadFirst: 'Upload your first document to get started',
      processing: 'Processing...',
      ready: 'Ready',
      error: 'Error'
    },
    tutor: {
      title: 'AI Tutor',
      subtitle: 'Chat with your AI tutor about your documents',
      askQuestion: 'Ask a question...',
      send: 'Send',
      voiceMode: 'Voice Mode',
      listening: 'Listening...',
      speaking: 'Speaking...',
      sources: 'Sources',
      citations: 'Citations',
      followUpSuggestions: 'Follow-up suggestions',
      concisionMode: 'Concision Mode',
      levelMode: 'Level Mode',
      brief: 'Brief',
      detailed: 'Detailed',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced'
    },
    study: {
      title: 'Study Tools',
      subtitle: 'Practice with quizzes and flashcards',
      quizzes: 'Quizzes',
      flashcards: 'Flashcards',
      summaries: 'Summaries',
      startQuiz: 'Start Quiz',
      generateQuiz: 'Generate Quiz',
      generateFlashcards: 'Generate Flashcards',
      generateSummary: 'Generate Summary',
      questionCount: 'Number of Questions',
      difficulty: 'Difficulty',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      score: 'Score',
      correctAnswers: 'Correct Answers',
      timeSpent: 'Time Spent',
      weakAreas: 'Weak Areas',
      retakeQuiz: 'Retake Quiz',
      studyWeakAreas: 'Study Weak Areas',
      nextCard: 'Next Card',
      showAnswer: 'Show Answer',
      again: 'Again',
      good: 'Good',
      dueCards: 'Due Cards',
      remainingCards: 'Remaining Cards'
    },
    analytics: {
      title: 'Learning Analytics',
      subtitle: 'Track your progress and performance',
      studyTime: 'Study Time',
      quizzesTaken: 'Quizzes Taken',
      averageScore: 'Average Score',
      streak: 'Streak',
      mastery: 'Mastery',
      weakTags: 'Weak Tags',
      studyThis: 'Study This',
      progressChart: 'Progress Chart',
      scoreTrends: 'Score Trends',
      flashcardRetention: 'Flashcard Retention',
      masteryHeatmap: 'Mastery Heatmap',
      last14Days: 'Last 14 Days',
      last30Days: 'Last 30 Days',
      last90Days: 'Last 90 Days'
    },
    pricing: {
      title: 'Pricing',
      subtitle: 'Choose the plan that works best for you',
      free: 'Free',
      pro: 'Pro',
      team: 'Team',
      monthly: '/month',
      yearly: '/year',
      mostPopular: 'Most Popular',
      currentPlan: 'Current Plan',
      upgrade: 'Upgrade',
      downgrade: 'Downgrade',
      contactSales: 'Contact Sales',
      features: 'Features',
      limits: 'Limits',
      documents: 'Documents',
      chatMessages: 'Chat Messages',
      quizQuestions: 'Quiz Questions',
      flashcards: 'Flashcards',
      unlimited: 'Unlimited'
    },
    account: {
      title: 'Account Settings',
      subtitle: 'Manage your profile and preferences',
      profile: 'Profile',
      preferences: 'Preferences',
      billing: 'Billing',
      security: 'Security',
      notifications: 'Notifications',
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      emailNotifications: 'Email Notifications',
      pushNotifications: 'Push Notifications',
      smsNotifications: 'SMS Notifications',
      changePassword: 'Change Password',
      deleteAccount: 'Delete Account',
      exportData: 'Export Data',
      privacySettings: 'Privacy Settings'
    },
    errors: {
      networkError: 'Network error. Please check your connection.',
      serverError: 'Server error. Please try again later.',
      notFound: 'The requested resource was not found.',
      unauthorized: 'You are not authorized to access this resource.',
      forbidden: 'Access to this resource is forbidden.',
      validationError: 'Please check your input and try again.',
      fileTooLarge: 'File is too large. Please choose a smaller file.',
      unsupportedFileType: 'Unsupported file type. Please choose a different file.',
      uploadFailed: 'Upload failed. Please try again.',
      processingFailed: 'Processing failed. Please try again.',
      quizGenerationFailed: 'Quiz generation failed. Please try again.',
      flashcardGenerationFailed: 'Flashcard generation failed. Please try again.',
      summaryGenerationFailed: 'Summary generation failed. Please try again.'
    }
  },
  es: {
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      close: 'Cerrar',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar',
      upload: 'Subir',
      download: 'Descargar',
      share: 'Compartir',
      copy: 'Copiar',
      paste: 'Pegar',
      cut: 'Cortar',
      undo: 'Deshacer',
      redo: 'Rehacer'
    },
    auth: {
      signIn: 'Iniciar Sesión',
      signUp: 'Registrarse',
      signOut: 'Cerrar Sesión',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      name: 'Nombre Completo',
      rememberMe: 'Recordarme',
      forgotPassword: '¿Olvidaste tu contraseña?',
      createAccount: 'Crear cuenta',
      alreadyHaveAccount: '¿Ya tienes una cuenta?',
      dontHaveAccount: '¿No tienes una cuenta?',
      welcomeBack: '¡Bienvenido de vuelta!',
      accountCreated: '¡Cuenta creada exitosamente!',
      signedOut: 'Sesión cerrada exitosamente'
    },
    navigation: {
      home: 'Inicio',
      library: 'Biblioteca',
      tutor: 'Tutor',
      study: 'Estudiar',
      analytics: 'Analíticas',
      pricing: 'Precios',
      account: 'Cuenta',
      dashboard: 'Panel'
    }
  }
}

export function useI18n() {
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.')
    let value: any = translations[currentLocale.value]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
    
    // Replace parameters
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match
      })
    }
    
    return value
  }

  const setLocale = (locale: string) => {
    if (locales.find(l => l.code === locale)) {
      currentLocale.value = locale
      localStorage.setItem('locale', locale)
    }
  }

  const initializeLocale = () => {
    const stored = localStorage.getItem('locale')
    if (stored && locales.find(l => l.code === stored)) {
      currentLocale.value = stored
    } else {
      // Default to browser language
      const browserLang = navigator.language.split('-')[0]
      const supportedLang = locales.find(l => l.code === browserLang)
      if (supportedLang) {
        currentLocale.value = browserLang
      }
    }
  }

  return {
    t,
    currentLocale: computed(() => locales.find(locale => locale.code === currentLocale.value) || locales[0]),
    locales,
    setLocale,
    initializeLocale
  }
}

