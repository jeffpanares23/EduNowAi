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
        
        <!-- Course Data Preview -->
        <div v-if="courseData" class="mt-8 p-6 bg-surface-50 dark:bg-surface-800 rounded-lg">
          <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
            Course Material Preview
          </h3>
          
          <!-- Files -->
          <div v-if="courseData.files && courseData.files.length > 0" class="mb-4">
            <h4 class="font-medium text-surface-700 dark:text-surface-300 mb-2">Uploaded Files:</h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="file in courseData.files" 
                :key="file.name"
                class="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm"
              >
                {{ file.name }}
              </span>
            </div>
          </div>
          
          <!-- Links -->
          <div v-if="courseData.links" class="mb-4">
            <h4 class="font-medium text-surface-700 dark:text-surface-300 mb-2">Added Links:</h4>
            <div class="flex items-center space-x-2">
              <LinkIcon class="h-4 w-4 text-primary-500" />
              <span class="text-sm text-surface-900 dark:text-surface-100">{{ courseData.links }}</span>
            </div>
          </div>
          
          <!-- Description -->
          <div v-if="courseData.description" class="mb-4">
            <h4 class="font-medium text-surface-700 dark:text-surface-300 mb-2">Description:</h4>
            <p class="text-sm text-surface-900 dark:text-surface-100">{{ courseData.description }}</p>
          </div>
        </div>
      </div>

      <!-- Progress Indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-surface-700 dark:text-surface-300">
            Question {{ currentQuestion + 1 }} of {{ questions.length }}
          </span>
          <span class="text-sm text-surface-500 dark:text-surface-400">
            {{ Math.round(((currentQuestion + 1) / questions.length) * 100) }}%
          </span>
        </div>
        <div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
          <div 
            class="bg-primary-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Question Card -->
      <div class="card p-8 mb-8">
        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-100 mb-6">
          {{ questions[currentQuestion].question }}
        </h2>
        
        <!-- Answer Options -->
        <div class="space-y-4">
          <div
            v-for="(option, index) in questions[currentQuestion].options"
            :key="index"
            class="flex items-center p-4 border border-surface-200 dark:border-surface-700 rounded-lg hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 cursor-pointer transition-all"
            :class="{ 'border-primary-500 bg-primary-50 dark:bg-primary-900': answers[currentQuestion] === index }"
            @click="selectAnswer(index)"
          >
            <div class="flex items-center h-5">
              <input
                :id="`option-${index}`"
                type="radio"
                :name="`question-${currentQuestion}`"
                :value="index"
                :checked="answers[currentQuestion] === index"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300"
                @change="selectAnswer(index)"
              />
            </div>
            <div class="ml-3">
              <label :for="`option-${index}`" class="text-sm font-medium text-surface-900 dark:text-surface-100 cursor-pointer">
                {{ option }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between">
        <button
          v-if="currentQuestion > 0"
          class="btn-outline"
          @click="previousQuestion"
        >
          Previous
        </button>
        <div v-else></div>
        
        <button
          v-if="currentQuestion < questions.length - 1"
          class="btn-primary"
          :disabled="answers[currentQuestion] === undefined"
          @click="nextQuestion"
        >
          Next
        </button>
        <button
          v-else
          class="btn-primary"
          :disabled="answers[currentQuestion] === undefined"
          @click="completeAssessment"
        >
          Complete Assessment
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LinkIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

// Assessment state
const currentQuestion = ref(0)
const answers = reactive<number[]>([])
const courseData = ref<any>(null)

// Load course data on mount
onMounted(() => {
  const storedData = sessionStorage.getItem('trialCourseData')
  if (storedData) {
    courseData.value = JSON.parse(storedData)
  }
})

// Assessment questions
const questions = [
  {
    question: "How familiar are you with the core concepts in your uploaded material?",
    options: [
      "Complete beginner - I'm new to this topic",
      "Some familiarity - I've heard of these concepts before",
      "Moderately familiar - I understand the basics",
      "Very familiar - I have good knowledge of this area"
    ]
  },
  {
    question: "What's your primary learning goal?",
    options: [
      "Get a general overview of the topic",
      "Understand specific concepts deeply",
      "Prepare for an exam or certification",
      "Apply knowledge in a practical project"
    ]
  },
  {
    question: "How do you prefer to learn new concepts?",
    options: [
      "Step-by-step explanations with examples",
      "Visual diagrams and infographics",
      "Interactive exercises and practice",
      "Real-world case studies and applications"
    ]
  },
  {
    question: "What's your experience level with similar topics?",
    options: [
      "No prior experience",
      "Basic understanding from other courses",
      "Intermediate knowledge from work/study",
      "Advanced understanding from multiple sources"
    ]
  },
  {
    question: "How much time can you dedicate to learning?",
    options: [
      "15-30 minutes per session",
      "30-60 minutes per session",
      "1-2 hours per session",
      "More than 2 hours per session"
    ]
  }
]

const selectAnswer = (index: number) => {
  answers[currentQuestion.value] = index
}

const nextQuestion = () => {
  if (currentQuestion.value < questions.length - 1) {
    currentQuestion.value++
  }
}

const previousQuestion = () => {
  if (currentQuestion.value > 0) {
    currentQuestion.value--
  }
}

const completeAssessment = () => {
  // Store assessment results
  sessionStorage.setItem('trialAssessmentResults', JSON.stringify(answers))
  
  // Redirect to learning preferences
  router.push('/trial/preferences')
}
</script>
