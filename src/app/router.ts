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
    next({ name: 'Dashboard' })
    return
  }

  // Redirect to dashboard if accessing root while authenticated
  if (to.name === 'Landing' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
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
