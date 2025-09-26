<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-900">
    <!-- Header -->
    <header class="bg-white dark:bg-surface-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center space-x-2">
            <div class="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">E</span>
            </div>
            <span class="text-xl font-semibold text-surface-900 dark:text-surface-100">
              EduNow.AI
            </span>
          </div>
          
          <div class="flex items-center space-x-4">
            <button
              class="p-2 text-surface-400 hover:text-surface-500 dark:hover:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
              @click="uiStore.toggleDarkMode"
            >
              <SunIcon v-if="uiStore.isDarkMode" class="h-5 w-5" />
              <MoonIcon v-else class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Welcome Section -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-success-100 dark:bg-success-900 rounded-full mb-6">
          <CheckCircleIcon class="h-8 w-8 text-success-600 dark:text-success-400" />
        </div>
        <h1 class="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-4">
          Welcome to EduNow.AI!
        </h1>
        <p class="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          You've successfully created your account. Now choose a plan to unlock the full potential of AI-powered learning.
        </p>
      </div>

      <!-- Trial Summary -->
      <div v-if="trialData" class="card p-6 mb-8 bg-primary-50 dark:bg-primary-900 border border-primary-200 dark:border-primary-700">
        <div class="flex items-center mb-4">
          <SparklesIcon class="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3" />
          <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100">
            Your Trial Course Preview
          </h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div v-if="trialData.files && trialData.files.length > 0">
            <span class="font-medium text-primary-800 dark:text-primary-200">Files:</span>
            <span class="ml-2 text-primary-700 dark:text-primary-300">{{ trialData.files.length }} uploaded</span>
          </div>
          <div v-if="trialData.links">
            <span class="font-medium text-primary-800 dark:text-primary-200">Links:</span>
            <span class="ml-2 text-primary-700 dark:text-primary-300">1 added</span>
          </div>
          <div v-if="trialData.description">
            <span class="font-medium text-primary-800 dark:text-primary-200">Description:</span>
            <span class="ml-2 text-primary-700 dark:text-primary-300">Provided</span>
          </div>
        </div>
      </div>

      <!-- Pricing Plans -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-center text-surface-900 dark:text-surface-100 mb-4">
          Choose Your Plan
        </h2>
        <p class="text-center text-surface-600 dark:text-surface-400 mb-12">
          Start with a free plan or upgrade for unlimited access
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Free Plan -->
          <div class="card p-8 relative">
            <div class="text-center">
              <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                Free
              </h3>
              <div class="mb-6">
                <span class="text-4xl font-bold text-surface-900 dark:text-surface-100">$0</span>
                <span class="text-surface-600 dark:text-surface-400">/month</span>
              </div>
              
              <ul class="space-y-4 mb-8 text-left">
                <li class="flex items-center">
                  <CheckIcon class="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span class="text-surface-700 dark:text-surface-300">3 documents per month</span>
                </li>
                <li class="flex items-center">
                  <CheckIcon class="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span class="text-surface-700 dark:text-surface-300">Basic AI tutoring</span>
                </li>
                <li class="flex items-center">
                  <CheckIcon class="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span class="text-surface-700 dark:text-surface-300">Study mode</span>
                </li>
                <li class="flex items-center">
                  <CheckIcon class="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span class="text-surface-700 dark:text-surface-300">Basic analytics</span>
                </li>
              </ul>
              
              <button 
                class="btn-outline w-full"
                @click="selectPlan('free')"
              >
                Start Free
              </button>
            </div>
          </div>

          <!-- Pro Plan -->
          <div class="card p-8 relative border-2 border-primary-500">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            
            <div class="text-center">
              <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                Pro
              </h3>
              <div class="mb-6">
                <span class="text-4xl font-bold text-surface-900 dark:text-surface-100">$19</span>
                <span class="text-surface-600 dark:text-surface-400">/month</span>
              </div>
              
              <ul class="space-y-4 mb-8 text-left">
                <li class="flex items-center">
                  <CheckIcon class="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span class="text-surface-700 dark:text-surface-300">Unlimited documents</span>
                </li>
                <li class="flex items-center">
                  <CheckIcon class="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span class="text-surface-700 dark:text-surface-300">Advanced AI tutoring</span>
                </li>
                <li class="flex items-center">
                  <CheckIcon class="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span class="text-surface-700 dark:text-surface-300">All study modes</span>
                </li>
                <li class="flex items-center">
                  <CheckIcon class="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span class="text-surface-700 dark:text-surface-300">Advanced analytics</span>
                </li>
                <li class="flex items-center">
                  <CheckIcon class="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span class="text-surface-700 dark:text-surface-300">Priority support</span>
                </li>
              </ul>
              
              <button 
                class="btn-primary w-full"
                @click="selectPlan('pro')"
              >
                Choose Pro
              </button>
            </div>
          </div>

          <!-- Team Plan -->
          <div class="card p-8 relative">
            <div class="text-center">
              <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                Team
              </h3>
              <div class="mb-6">
                <span class="text-4xl font-bold text-surface-900 dark:text-surface-100">$49</span>
                <span class="text-surface-600 dark:text-surface-400">/month</span>
              </div>
              
              <ul class="space-y-4 mb-8 text-left">
                <li class="flex items-center">
                  <CheckIcon class="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span class="text-surface-700 dark:text-surface-300">Everything in Pro</span>
                </li>
                <li class="flex items-center">
                  <CheckIcon class="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span class="text-surface-700 dark:text-surface-300">Team collaboration</span>
                </li>
                <li class="flex items-center">
                  <CheckIcon class="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span class="text-surface-700 dark:text-surface-300">Admin dashboard</span>
                </li>
                <li class="flex items-center">
                  <CheckIcon class="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span class="text-surface-700 dark:text-surface-300">Custom integrations</span>
                </li>
                <li class="flex items-center">
                  <CheckIcon class="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span class="text-surface-700 dark:text-surface-300">24/7 support</span>
                </li>
              </ul>
              
              <button 
                class="btn-outline w-full"
                @click="selectPlan('team')"
              >
                Choose Team
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Skip Option -->
      <div class="text-center">
        <p class="text-surface-600 dark:text-surface-400 mb-4">
          Not ready to choose? You can always upgrade later from your account settings.
        </p>
        <button 
          class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          @click="skipToDashboard"
        >
          Skip for now and go to Dashboard →
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  CheckCircleIcon,
  SparklesIcon,
  CheckIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/vue/24/outline'
import { useUiStore } from '@/app/store/ui'
import { useAuthStore } from '@/app/store/auth'

const router = useRouter()
const uiStore = useUiStore()
const authStore = useAuthStore()

const trialData = ref<any>(null)

// Load trial data on mount
onMounted(() => {
  const storedData = sessionStorage.getItem('trialCourseData')
  if (storedData) {
    trialData.value = JSON.parse(storedData)
  }
})

const selectPlan = (planId: 'free' | 'pro' | 'team') => {
  // Update user's plan in the auth store
  if (authStore.user) {
    authStore.user.planId = planId
  }
  
  // Store plan selection
  sessionStorage.setItem('selectedPlan', planId)
  
  // Show success message
  uiStore.showSuccess(`Welcome to the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan!`)
  
  // Redirect to library to show the trial course
  router.push('/library')
}

const skipToDashboard = () => {
  // Set default free plan
  if (authStore.user) {
    authStore.user.planId = 'free'
  }
  
  sessionStorage.setItem('selectedPlan', 'free')
  uiStore.showInfo('You are now on the Free plan. You can upgrade anytime!')
  router.push('/library')
}
</script>
