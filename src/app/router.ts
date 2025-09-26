import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/app/store/auth'
import { useUiStore } from '@/app/store/ui'

// Import pages
import Landing from '@/pages/Landing.vue'
import SignIn from '@/pages/SignIn.vue'
import SignUp from '@/pages/SignUp.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Library from '@/pages/Library.vue'
import DocumentDetail from '@/pages/DocumentDetail.vue'
import Tutor from '@/pages/Tutor.vue'
import Study from '@/pages/Study.vue'
import Analytics from '@/pages/Analytics.vue'
import Pricing from '@/pages/Pricing.vue'
import Account from '@/pages/Account.vue'
import NotFound from '@/pages/NotFound.vue'

// Import trial pages
import TrialAssessment from '@/pages/TrialAssessment.vue'
import TrialPreferences from '@/pages/TrialPreferences.vue'
import TrialOutline from '@/pages/TrialOutline.vue'
import SubscriptionSelection from '@/pages/SubscriptionSelection.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Public routes
    {
      path: '/',
      name: 'Landing',
      component: Landing,
      meta: { 
        requiresAuth: false,
        title: 'EduNow.AI - AI-Powered Learning Platform'
      }
    },
    {
      path: '/sign-in',
      name: 'SignIn',
      component: SignIn,
      meta: { 
        requiresAuth: false,
        title: 'Sign In - EduNow.AI'
      }
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp,
      meta: { 
        requiresAuth: false,
        title: 'Sign Up - EduNow.AI'
      }
    },
    {
      path: '/pricing',
      name: 'Pricing',
      component: Pricing,
      meta: { 
        requiresAuth: false,
        title: 'Pricing - EduNow.AI'
      }
    },

    // Trial routes
    {
      path: '/trial/assessment',
      name: 'TrialAssessment',
      component: TrialAssessment,
      meta: { 
        requiresAuth: false,
        title: 'Learning Assessment - EduNow.AI'
      }
    },
    {
      path: '/trial/preferences',
      name: 'TrialPreferences',
      component: TrialPreferences,
      meta: { 
        requiresAuth: false,
        title: 'Learning Preferences - EduNow.AI'
      }
    },
    {
      path: '/trial/outline',
      name: 'TrialOutline',
      component: TrialOutline,
      meta: { 
        requiresAuth: false,
        title: 'Course Outline - EduNow.AI'
      }
    },
    {
      path: '/subscription-selection',
      name: 'SubscriptionSelection',
      component: SubscriptionSelection,
      meta: { 
        requiresAuth: true,
        title: 'Choose Your Plan - EduNow.AI'
      }
    },

    // Protected routes
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { 
        requiresAuth: true,
        title: 'Dashboard - EduNow.AI'
      }
    },
    {
      path: '/library',
      name: 'Library',
      component: Library,
      meta: { 
        requiresAuth: true,
        title: 'Library - EduNow.AI'
      }
    },
    {
      path: '/library/:id',
      name: 'DocumentDetail',
      component: DocumentDetail,
      meta: { 
        requiresAuth: true,
        title: 'Document Details - EduNow.AI'
      }
    },
    {
      path: '/tutor',
      name: 'Tutor',
      component: Tutor,
      meta: { 
        requiresAuth: true,
        title: 'AI Tutor - EduNow.AI'
      }
    },
    {
      path: '/study',
      name: 'Study',
      component: Study,
      meta: { 
        requiresAuth: true,
        title: 'Study - EduNow.AI'
      }
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: Analytics,
      meta: { 
        requiresAuth: true,
        title: 'Analytics - EduNow.AI'
      }
    },
    {
      path: '/account',
      name: 'Account',
      component: Account,
      meta: { 
        requiresAuth: true,
        title: 'Account - EduNow.AI'
      }
    },

    // Catch all route
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: {
        title: 'Page Not Found - EduNow.AI'
      }
    }
  ]
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const uiStore = useUiStore()

  // Set page title
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // Check authentication requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    uiStore.showError('Please sign in to access this page')
    next({ 
      name: 'SignIn', 
      query: { redirect: to.fullPath } 
    })
    return
  }

  // Redirect authenticated users away from auth pages
  if (authStore.isAuthenticated && ['SignIn', 'SignUp'].includes(to.name as string)) {
    // Check if user came from trial workflow
    const trialCompleted = sessionStorage.getItem('trialCompleted')
    const selectedPlan = sessionStorage.getItem('selectedPlan')
    
    if (trialCompleted === 'true' && !selectedPlan) {
      next({ name: 'SubscriptionSelection' })
      return
    }
    
    // For trial users who have completed the workflow, redirect to library
    if (trialCompleted === 'true' && selectedPlan) {
      next({ name: 'Library' })
      return
    }
    
    next({ name: 'Dashboard' })
    return
  }

  // Redirect to dashboard if accessing root while authenticated
  if (to.name === 'Landing' && authStore.isAuthenticated) {
    // Check if user came from trial workflow
    const trialCompleted = sessionStorage.getItem('trialCompleted')
    const selectedPlan = sessionStorage.getItem('selectedPlan')
    
    if (trialCompleted === 'true' && selectedPlan) {
      next({ name: 'Library' })
      return
    }
    
    next({ name: 'Dashboard' })
    return
  }

  // Check if user needs to select subscription plan
  if (authStore.isAuthenticated && to.name === 'Dashboard') {
    const trialCompleted = sessionStorage.getItem('trialCompleted')
    const selectedPlan = sessionStorage.getItem('selectedPlan')
    
    if (trialCompleted === 'true' && !selectedPlan) {
      next({ name: 'SubscriptionSelection' })
      return
    }
  }

  next()
})

// Handle navigation errors
router.onError((error) => {
  console.error('Router error:', error)
  const uiStore = useUiStore()
  uiStore.showError('Navigation error occurred')
})

export default router
