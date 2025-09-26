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
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-4">
          {{ courseOutline?.title || 'Introduction to Machine Learning' }}
        </h1>
        <div class="flex items-center justify-center space-x-6 text-sm text-surface-600 dark:text-surface-400 mb-4">
          <div class="flex items-center">
            <ClockIcon class="h-4 w-4 mr-1" />
            <span>{{ courseOutline?.totalDuration || '3h 30min total' }}</span>
          </div>
          <div class="flex items-center">
            <AcademicCapIcon class="h-4 w-4 mr-1" />
            <span>Intermediate</span>
          </div>
        </div>
        <p class="text-lg text-surface-600 dark:text-surface-400 max-w-3xl mx-auto">
          {{ courseOutline?.description || 'Your personalized learning journey has been created based on your uploaded material and preferences.' }}
        </p>
      </div>

      <!-- Course Navigation -->
      <div class="mb-8">
        <div class="border-b border-surface-200 dark:border-surface-700">
          <nav class="-mb-px flex space-x-8">
            <button
              :class="activeTab === 'outline' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300 dark:text-surface-400 dark:hover:text-surface-300'"
              class="py-2 px-1 border-b-2 font-medium text-sm"
              @click="activeTab = 'outline'"
            >
              Course Outline
            </button>
            <button
              :class="activeTab === 'sample' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300 dark:text-surface-400 dark:hover:text-surface-300'"
              class="py-2 px-1 border-b-2 font-medium text-sm"
              @click="activeTab = 'sample'"
            >
              Sample Lesson
            </button>
            <button
              :class="activeTab === 'practice' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300 dark:text-surface-400 dark:hover:text-surface-300'"
              class="py-2 px-1 border-b-2 font-medium text-sm"
              @click="activeTab = 'practice'"
            >
              Practice Question
            </button>
          </nav>
        </div>
      </div>

      <!-- Course Outline Tab -->
      <div v-if="activeTab === 'outline'" class="card p-8">
        <div class="flex items-center mb-6">
          <BookOpenIcon class="h-6 w-6 text-primary-600 mr-3" />
          <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            Learning Outline
          </h2>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p class="text-surface-600 dark:text-surface-400">Generating your personalized course outline...</p>
        </div>

        <!-- Dynamic Course Outline -->
        <div v-else-if="courseOutline" class="space-y-6">
          <!-- Learning Objectives -->
          <div v-if="courseOutline.objectives" class="mb-8">
            <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">Learning Objectives</h3>
            <ul class="space-y-2">
              <li v-for="objective in courseOutline.objectives" :key="objective" class="flex items-start">
                <CheckIcon class="h-5 w-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                <span class="text-surface-700 dark:text-surface-300">{{ objective }}</span>
              </li>
            </ul>
          </div>

          <!-- Modules -->
          <div v-for="(module, moduleIndex) in courseOutline.modules" :key="moduleIndex" class="border border-surface-200 dark:border-surface-700 rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                     :class="moduleIndex === 0 ? 'bg-primary-100 dark:bg-primary-900' : 
                             moduleIndex === 1 ? 'bg-success-100 dark:bg-success-900' : 
                             'bg-warn-100 dark:bg-warn-900'">
                  <span class="font-semibold text-sm"
                        :class="moduleIndex === 0 ? 'text-primary-600 dark:text-primary-400' : 
                                moduleIndex === 1 ? 'text-success-600 dark:text-success-400' : 
                                'text-warn-600 dark:text-warn-400'">
                    {{ moduleIndex + 1 }}
                  </span>
                </div>
                <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  {{ module.title }}
                </h3>
              </div>
              <span class="text-sm text-surface-500 dark:text-surface-400">{{ module.lessons?.length || 0 }} lessons</span>
            </div>
            
            <p v-if="module.description" class="text-sm text-surface-600 dark:text-surface-400 mb-4 ml-11">
              {{ module.description }}
            </p>
            
            <div v-if="module.lessons" class="ml-11 space-y-3">
              <div v-for="lesson in module.lessons" :key="lesson.title" class="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <div>
                  <h4 class="font-medium text-surface-900 dark:text-surface-100">{{ lesson.title }}</h4>
                  <p class="text-sm text-surface-600 dark:text-surface-400">{{ lesson.description }}</p>
                </div>
                <span class="text-sm text-surface-500 dark:text-surface-400">{{ lesson.duration }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Fallback Content -->
        <div v-else class="space-y-6">
          <div class="border border-surface-200 dark:border-surface-700 rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3">
                  <span class="text-primary-600 dark:text-primary-400 font-semibold text-sm">1</span>
                </div>
                <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  Introduction & Fundamentals
                </h3>
              </div>
              <span class="text-sm text-surface-500 dark:text-surface-400">3 lessons</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sample Lesson Tab -->
      <div v-if="activeTab === 'sample'" class="card p-8">
        <div class="flex items-center mb-6">
          <PlayIcon class="h-6 w-6 text-success-600 mr-3" />
          <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            Sample Lesson Preview
          </h2>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p class="text-surface-600 dark:text-surface-400">Generating your personalized lesson...</p>
        </div>
        
        <!-- Dynamic Sample Lesson -->
        <div v-else-if="sampleLesson" class="bg-surface-50 dark:bg-surface-800 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
            {{ courseOutline?.modules?.[0]?.lessons?.[0]?.title || 'Key Concepts in Machine Learning' }}
          </h3>
          
          <div v-if="sampleLesson.introduction" class="mb-4">
            <p class="text-surface-700 dark:text-surface-300">{{ sampleLesson.introduction }}</p>
          </div>
          
          <div v-if="sampleLesson.content" class="mb-4">
            <p class="text-surface-700 dark:text-surface-300">{{ sampleLesson.content }}</p>
          </div>
          
          <div v-if="sampleLesson.keyConcepts" class="mb-4">
            <h4 class="font-semibold text-surface-900 dark:text-surface-100 mb-2">Key Concepts:</h4>
            <ul class="list-disc list-inside space-y-1 text-surface-700 dark:text-surface-300">
              <li v-for="concept in sampleLesson.keyConcepts" :key="concept">{{ concept }}</li>
            </ul>
          </div>
          
          <div v-if="sampleLesson.examples" class="mb-4">
            <h4 class="font-semibold text-surface-900 dark:text-surface-100 mb-2">Examples:</h4>
            <ul class="list-disc list-inside space-y-1 text-surface-700 dark:text-surface-300">
              <li v-for="example in sampleLesson.examples" :key="example">{{ example }}</li>
            </ul>
          </div>
          
          <div v-if="sampleLesson.keyInsights" class="bg-primary-50 dark:bg-primary-900 border-l-4 border-primary-500 p-4">
            <h4 class="font-semibold text-primary-900 dark:text-primary-100 mb-2">Key Insights:</h4>
            <ul class="space-y-1">
              <li v-for="insight in sampleLesson.keyInsights" :key="insight" class="text-primary-700 dark:text-primary-300">
                {{ insight }}
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Fallback Content -->
        <div v-else class="bg-surface-50 dark:bg-surface-800 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
            Key Concepts in Machine Learning
          </h3>
          <p class="text-surface-700 dark:text-surface-300 mb-4">
            Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every scenario.
          </p>
          <p class="text-surface-700 dark:text-surface-300 mb-4">
            The three main types of machine learning are:
          </p>
          <ul class="list-disc list-inside space-y-2 text-surface-700 dark:text-surface-300 mb-6">
            <li><strong>Supervised Learning:</strong> Learning with labeled examples</li>
            <li><strong>Unsupervised Learning:</strong> Finding patterns in data without labels</li>
            <li><strong>Reinforcement Learning:</strong> Learning through trial and error</li>
          </ul>
          <div class="bg-primary-50 dark:bg-primary-900 border-l-4 border-primary-500 p-4">
            <p class="text-primary-700 dark:text-primary-300">
              <strong>Key Insight:</strong> The choice of learning type depends on your data and what you want to achieve.
            </p>
          </div>
        </div>
      </div>

      <!-- Practice Question Tab -->
      <div v-if="activeTab === 'practice'" class="card p-8">
        <div class="flex items-center mb-6">
          <QuestionMarkCircleIcon class="h-6 w-6 text-warn-600 mr-3" />
          <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            Practice Question Example
          </h2>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p class="text-surface-600 dark:text-surface-400">Generating your personalized practice question...</p>
        </div>
        
        <!-- Dynamic Practice Question -->
        <div v-else-if="practiceQuestion" class="bg-surface-50 dark:bg-surface-800 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
            {{ practiceQuestion.question }}
          </h3>
          
          <div v-if="practiceQuestion.scenario" class="mb-6">
            <p class="text-surface-700 dark:text-surface-300">{{ practiceQuestion.scenario }}</p>
          </div>
          
          <div class="space-y-3">
            <div v-for="(option, index) in practiceQuestion.options" :key="index" 
                 class="flex items-center p-3 border border-surface-200 dark:border-surface-700 rounded-lg hover:border-primary-400 cursor-pointer">
              <input type="radio" name="practice" class="h-4 w-4 text-primary-600 mr-3" />
              <span class="text-surface-900 dark:text-surface-100">{{ option }}</span>
            </div>
          </div>
          
          <div v-if="practiceQuestion.explanation" class="mt-6 p-4 bg-success-50 dark:bg-success-900 border-l-4 border-success-500">
            <h4 class="font-semibold text-success-900 dark:text-success-100 mb-2">Explanation:</h4>
            <p class="text-success-700 dark:text-success-300">{{ practiceQuestion.explanation }}</p>
          </div>
        </div>
        
        <!-- Fallback Content -->
        <div v-else class="bg-surface-50 dark:bg-surface-800 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
            Which type of machine learning would be most appropriate for the following scenario?
          </h3>
          <p class="text-surface-700 dark:text-surface-300 mb-6">
            You have a dataset of 10,000 emails, each labeled as either "spam" or "not spam". You want to build a system that can automatically classify new incoming emails.
          </p>
          
          <div class="space-y-3">
            <div class="flex items-center p-3 border border-surface-200 dark:border-surface-700 rounded-lg hover:border-primary-400 cursor-pointer">
              <input type="radio" name="practice" class="h-4 w-4 text-primary-600 mr-3" />
              <span class="text-surface-900 dark:text-surface-100">Supervised Learning</span>
            </div>
            <div class="flex items-center p-3 border border-surface-200 dark:border-surface-700 rounded-lg hover:border-primary-400 cursor-pointer">
              <input type="radio" name="practice" class="h-4 w-4 text-primary-600 mr-3" />
              <span class="text-surface-900 dark:text-surface-100">Unsupervised Learning</span>
            </div>
            <div class="flex items-center p-3 border border-surface-200 dark:border-surface-700 rounded-lg hover:border-primary-400 cursor-pointer">
              <input type="radio" name="practice" class="h-4 w-4 text-primary-600 mr-3" />
              <span class="text-surface-900 dark:text-surface-100">Reinforcement Learning</span>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <div class="text-center mt-12">
        <button
          class="btn-primary btn-lg"
          @click="startLearningJourney"
        >
          Start Your Learning Journey →
        </button>
        <p class="text-sm text-surface-500 dark:text-surface-400 mt-4">
          Sign up to save your progress and access the complete course
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ClockIcon,
  AcademicCapIcon,
  BookOpenIcon,
  PlayIcon,
  QuestionMarkCircleIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'
import { aiContentService } from '@/app/services/aiContentService'

const router = useRouter()
const activeTab = ref('outline')

// Dynamic content state
const courseOutline = ref<any>(null)
const sampleLesson = ref<any>(null)
const practiceQuestion = ref<any>(null)
const isLoading = ref(false)

// Load and generate content on mount
onMounted(async () => {
  await generateDynamicContent()
})

const generateDynamicContent = async () => {
  isLoading.value = true
  
  try {
    // Get stored data
    const courseData = JSON.parse(sessionStorage.getItem('trialCourseData') || '{}')
    const assessmentResults = JSON.parse(sessionStorage.getItem('trialAssessmentResults') || '[]')
    const preferences = JSON.parse(sessionStorage.getItem('trialPreferences') || '{}')
    
    console.log('TrialOutline - Retrieved data:', {
      courseData,
      assessmentResults,
      preferences,
      courseDataString: sessionStorage.getItem('trialCourseData'),
      assessmentString: sessionStorage.getItem('trialAssessmentResults'),
      preferencesString: sessionStorage.getItem('trialPreferences')
    })
    
    // Check if we have any meaningful data
    const hasData = courseData.files?.length > 0 || courseData.links || courseData.description
    
    if (!hasData) {
      console.log('No meaningful data found, using enhanced fallback')
      // Use enhanced fallback that still shows some dynamic content
      courseOutline.value = {
        title: "Introduction to Learning",
        description: "A personalized learning experience based on your preferences and assessment results.",
        objectives: [
          "Understand core learning concepts",
          "Apply learning principles effectively",
          "Develop practical skills"
        ],
        modules: [
          {
            title: "Introduction & Fundamentals",
            description: "Core concepts and terminology",
            lessons: [
              {
                title: "Course Overview",
                description: "Learning objectives and course structure",
                duration: "5 minutes",
                type: "theory"
              },
              {
                title: "Key Concepts",
                description: "Core definitions and basic principles",
                duration: "12 minutes",
                type: "theory"
              }
            ]
          }
        ],
        totalDuration: "1 hour 15 minutes"
      }
    } else {
      // Generate course outline using AI
      courseOutline.value = await aiContentService.generateCourseOutline(
        courseData,
        assessmentResults,
        preferences
      )
    }
    
    console.log('Generated course outline:', courseOutline.value)
    
    // Store course outline in session storage for later use
    sessionStorage.setItem('trialCourseOutline', JSON.stringify(courseOutline.value))
    
    // Generate sample lesson
    sampleLesson.value = await aiContentService.generateSampleLesson(courseOutline.value, 0, 0)
    
    // Generate practice question
    practiceQuestion.value = await aiContentService.generatePracticeQuestion(courseOutline.value, 0)
    
  } catch (error) {
    console.error('Error generating content:', error)
    // Fallback to default content
    courseOutline.value = {
      title: "Introduction to Machine Learning",
      description: "A comprehensive introduction to machine learning concepts and applications.",
      objectives: [
        "Understand core machine learning concepts",
        "Learn different types of machine learning",
        "Apply machine learning principles to real-world problems"
      ],
      modules: [
        {
          title: "Introduction & Fundamentals",
          description: "Core concepts and terminology",
          lessons: [
            {
              title: "Course Overview",
              description: "Learning objectives and course structure",
              duration: "5 minutes",
              type: "theory"
            },
            {
              title: "Key Concepts",
              description: "Core definitions and basic principles",
              duration: "12 minutes",
              type: "theory"
            }
          ]
        }
      ],
      totalDuration: "3 hours 30 minutes"
    }
    
    sampleLesson.value = {
      introduction: "Welcome to this lesson on machine learning fundamentals.",
      content: "Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every scenario.",
      keyConcepts: ["Machine Learning", "Artificial Intelligence", "Data-driven decisions"],
      examples: ["Email spam detection", "Recommendation systems", "Image recognition"],
      keyInsights: ["The choice of learning type depends on your data and what you want to achieve."]
    }
    
    practiceQuestion.value = {
      question: "Which type of machine learning would be most appropriate for the following scenario?",
      scenario: "You have a dataset of 10,000 emails, each labeled as either 'spam' or 'not spam'. You want to build a system that can automatically classify new incoming emails.",
      options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning"],
      correctAnswer: 0,
      explanation: "This is supervised learning because you have labeled training data (emails marked as spam or not spam) to train the model."
    }
  } finally {
    isLoading.value = false
  }
}

const startLearningJourney = () => {
  // Redirect to sign up with trial context
  sessionStorage.setItem('trialCompleted', 'true')
  router.push('/sign-up')
}
</script>
