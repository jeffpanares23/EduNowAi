<template>
  <div class="min-h-screen bg-white dark:bg-surface-900">
    <!-- Header -->
    <header class="bg-white dark:bg-surface-900 shadow-sm">
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
            <router-link to="/sign-up" class="btn-primary">
              Sign Up
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-4">
          Let me know what you've learned so far...
        </h1>
        <p class="text-lg text-surface-600 dark:text-surface-400">
          I'll ask a few questions to gauge your understanding of the topic and your learning preferences and style.
        </p>
      </div>

      <!-- Tab Navigation -->
      <div class="mb-8">
        <div class="border-b border-surface-200 dark:border-surface-700">
          <nav class="-mb-px flex space-x-8">
            <button
              class="py-2 px-1 border-b-2 border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300 dark:text-surface-400 dark:hover:text-surface-300"
            >
              Learning Assessment
            </button>
            <button
              class="py-2 px-1 border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
            >
              Learning Preferences & Style
            </button>
          </nav>
        </div>
      </div>

      <!-- Preferences Form -->
      <div class="space-y-8">
        <!-- Learning Pace -->
        <div class="card p-8">
          <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-6">
            How quickly would you like to progress through the material?
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="(option, index) in paceOptions"
              :key="index"
              class="flex items-center p-4 border border-surface-200 dark:border-surface-700 rounded-lg hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 cursor-pointer transition-all"
              :class="{ 'border-primary-500 bg-primary-50 dark:bg-primary-900': preferences.pace === index }"
              @click="selectPace(index)"
            >
              <div class="flex items-center h-5">
                <input
                  :id="`pace-${index}`"
                  type="radio"
                  name="pace"
                  :value="index"
                  :checked="preferences.pace === index"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300"
                />
              </div>
              <div class="ml-3">
                <label :for="`pace-${index}`" class="text-sm font-medium text-surface-900 dark:text-surface-100 cursor-pointer">
                  {{ option }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Teaching Style -->
        <div class="card p-8">
          <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-6">
            What kind of explanations work best for you?
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="(option, index) in teachingStyleOptions"
              :key="index"
              class="flex items-center p-4 border border-surface-200 dark:border-surface-700 rounded-lg hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 cursor-pointer transition-all"
              :class="{ 'border-primary-500 bg-primary-50 dark:bg-primary-900': preferences.teachingStyle === index }"
              @click="selectTeachingStyle(index)"
            >
              <div class="flex items-center h-5">
                <input
                  :id="`teaching-${index}`"
                  type="radio"
                  name="teachingStyle"
                  :value="index"
                  :checked="preferences.teachingStyle === index"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300"
                />
              </div>
              <div class="ml-3">
                <label :for="`teaching-${index}`" class="text-sm font-medium text-surface-900 dark:text-surface-100 cursor-pointer">
                  {{ option }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Session Length -->
        <div class="card p-8">
          <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-6">
            How long should each learning session be?
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="(option, index) in sessionLengthOptions"
              :key="index"
              class="flex items-center p-4 border border-surface-200 dark:border-surface-700 rounded-lg hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 cursor-pointer transition-all"
              :class="{ 'border-primary-500 bg-primary-50 dark:bg-primary-900': preferences.sessionLength === index }"
              @click="selectSessionLength(index)"
            >
              <div class="flex items-center h-5">
                <input
                  :id="`session-${index}`"
                  type="radio"
                  name="sessionLength"
                  :value="index"
                  :checked="preferences.sessionLength === index"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300"
                />
              </div>
              <div class="ml-3">
                <label :for="`session-${index}`" class="text-sm font-medium text-surface-900 dark:text-surface-100 cursor-pointer">
                  {{ option }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between mt-12">
        <button
          class="btn-outline"
          @click="goBack"
        >
          Back to Assessment
        </button>
        
        <button
          class="btn-primary"
          :disabled="!isFormComplete"
          @click="savePreferences"
        >
          Continue to Course Outline
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Preferences state
const preferences = reactive({
  pace: undefined as number | undefined,
  teachingStyle: undefined as number | undefined,
  sessionLength: undefined as number | undefined
})

// Options
const paceOptions = [
  "Slow & Steady",
  "Moderate Pace", 
  "Fast Track"
]

const teachingStyleOptions = [
  "Visual",
  "Text-based",
  "Interactive"
]

const sessionLengthOptions = [
  "Short (15-30 min)",
  "Medium (30-60 min)",
  "Long (60+ min)"
]

// Computed
const isFormComplete = computed(() => {
  return preferences.pace !== undefined && 
         preferences.teachingStyle !== undefined && 
         preferences.sessionLength !== undefined
})

// Methods
const selectPace = (index: number) => {
  preferences.pace = index
}

const selectTeachingStyle = (index: number) => {
  preferences.teachingStyle = index
}

const selectSessionLength = (index: number) => {
  preferences.sessionLength = index
}

const goBack = () => {
  router.push('/trial/assessment')
}

const savePreferences = () => {
  // Store preferences
  sessionStorage.setItem('trialPreferences', JSON.stringify(preferences))
  
  // Redirect to course outline
  router.push('/trial/outline')
}
</script>
