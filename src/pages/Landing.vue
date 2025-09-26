<template>
  <div class="bg-white dark:bg-surface-900">
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
            <button
              class="p-2 text-surface-400 hover:text-surface-500 dark:hover:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
              @click="uiStore.toggleDarkMode"
            >
              <SunIcon v-if="uiStore.isDarkMode" class="h-5 w-5" />
              <MoonIcon v-else class="h-5 w-5" />
            </button>
            
            <router-link to="/pricing" class="text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-surface-100">
              Pricing
            </router-link>
            <router-link to="/sign-in" class="btn-outline">
              Sign In
            </router-link>
            <router-link to="/sign-up" class="btn-primary">
              Get Started
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Trial Feature Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-50 to-success-50 dark:from-surface-900 dark:to-surface-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl sm:text-6xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
            Start Creating Your Courses,
            <span class="text-primary-600">Now!</span>
          </h1>
          <p class="mt-6 text-lg leading-8 text-surface-600 dark:text-surface-400 max-w-3xl mx-auto">
            Convert any study material into a personalized learning experience with adaptive lessons, 
            intelligent practice, and real-time feedback.
          </p>
          
          <!-- Course Creation Inputs -->
          <div class="mt-12 max-w-4xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <!-- Upload File Input -->
              <div 
                class="card p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-surface-300 hover:border-primary-400 dark:border-surface-600 dark:hover:border-primary-500"
                :class="{ 'border-primary-500 bg-primary-50 dark:bg-primary-900': isDragOver }"
                @click="triggerFileUpload"
                @dragover.prevent="isDragOver = true"
                @dragleave.prevent="isDragOver = false"
                @drop.prevent="handleFileDrop"
              >
                <input
                  ref="fileInput"
                  type="file"
                  class="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.mp4,.mp3,.wav,.m4a"
                  multiple
                  @change="handleFileSelect"
                />
                <div class="text-center">
                  <CloudArrowUpIcon class="h-12 w-12 text-primary-500 mx-auto mb-4" />
                  <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                    Upload a file here...
                  </h3>
                  <p class="text-sm text-surface-600 dark:text-surface-400 mb-4">
                    PDF, DOC, PPT, MP4, MP3 supported
                  </p>
                  
                  <!-- File Preview -->
                  <div v-if="uploadedFiles.length > 0" class="mt-4 space-y-2">
                    <div 
                      v-for="(file, index) in uploadedFiles" 
                      :key="index"
                      class="flex items-center justify-between p-2 bg-surface-100 dark:bg-surface-700 rounded-lg"
                    >
                      <div class="flex items-center space-x-2">
                        <DocumentIcon class="h-4 w-4 text-primary-500" />
                        <span class="text-sm text-surface-900 dark:text-surface-100 truncate">
                          {{ file.name }}
                        </span>
                        <span class="text-xs text-surface-500 dark:text-surface-400">
                          ({{ formatFileSize(file.size) }})
                        </span>
                      </div>
                      <button
                        @click.stop="removeFile(index)"
                        class="text-error-500 hover:text-error-700 p-1"
                      >
                        <XMarkIcon class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p v-if="uploadedFiles.length === 0" class="text-xs text-surface-500 dark:text-surface-400">
                    Click to browse or drag & drop files
                  </p>
                </div>
              </div>
              
              <!-- Add Link Input -->
              <div class="card p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-surface-300 hover:border-primary-400 dark:border-surface-600 dark:hover:border-primary-500">
                <div class="text-center">
                  <LinkIcon class="h-12 w-12 text-primary-500 mx-auto mb-4" />
                  <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                    Add a link...
                  </h3>
                  <p class="text-sm text-surface-600 dark:text-surface-400 mb-4">
                    YouTube, articles, websites
                  </p>
                  
                  <!-- Link Input -->
                  <div class="space-y-3">
                    <input
                      v-model="courseLinks"
                      type="url"
                      placeholder="https://example.com"
                      class="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-surface-800 dark:border-surface-600 dark:text-surface-100 text-sm"
                    />
                    
                    <!-- Link Preview -->
                    <div v-if="courseLinks.length > 0" class="mt-2">
                      <div class="flex items-center justify-between p-2 bg-surface-100 dark:bg-surface-700 rounded-lg">
                        <div class="flex items-center space-x-2">
                          <LinkIcon class="h-4 w-4 text-primary-500" />
                          <span class="text-sm text-surface-900 dark:text-surface-100 truncate">
                            {{ courseLinks }}
                          </span>
                        </div>
                        <button
                          @click="courseLinks = ''"
                          class="text-error-500 hover:text-error-700 p-1"
                        >
                          <XMarkIcon class="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Description Input -->
            <div class="card p-6 mb-6">
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                Describe what you would like to learn
              </label>
              <textarea
                v-model="courseDescription"
                class="w-full h-32 px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-surface-800 dark:border-surface-600 dark:text-surface-100"
                placeholder="You can tell me what course you want to generate..."
              ></textarea>
            </div>
            
            <!-- Start Trial Button -->
            <button 
              class="btn-primary btn-lg w-full md:w-auto"
              @click="startTrial"
            >
              Start Creating Course
            </button>
          </div>
          
          <!-- Trust indicators -->
          <div class="mt-12 flex items-center justify-center space-x-8 text-surface-500 dark:text-surface-400">
            <div class="flex items-center space-x-2">
              <CheckIcon class="h-5 w-5 text-success-500" />
              <span class="text-sm">No credit card required</span>
            </div>
            <div class="flex items-center space-x-2">
              <CheckIcon class="h-5 w-5 text-success-500" />
              <span class="text-sm">Free trial available</span>
            </div>
            <div class="flex items-center space-x-2">
              <CheckIcon class="h-5 w-5 text-success-500" />
              <span class="text-sm">Instant setup</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-24 bg-surface-50 dark:bg-surface-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
            How It Works
          </h2>
          <p class="mt-4 text-lg text-surface-600 dark:text-surface-400">
            Advanced AI transforms your materials into personalized courses!
          </p>
        </div>

        <div class="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div class="text-center">
            <div class="flex items-center justify-center w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900 rounded-xl">
              <CloudArrowUpIcon class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="mt-6 text-lg font-semibold text-surface-900 dark:text-surface-100">
              1. Upload Content
            </h3>
            <p class="mt-2 text-surface-600 dark:text-surface-400">
              Upload files, add links, or describe what you want to learn. Our AI processes everything.
            </p>
          </div>

          <div class="text-center">
            <div class="flex items-center justify-center w-16 h-16 mx-auto bg-success-100 dark:bg-success-900 rounded-xl">
              <AcademicCapIcon class="w-8 h-8 text-success-600 dark:text-success-400" />
            </div>
            <h3 class="mt-6 text-lg font-semibold text-surface-900 dark:text-surface-100">
              2. Learning Assessment
            </h3>
            <p class="mt-2 text-surface-600 dark:text-surface-400">
              Answer a few questions to gauge your understanding and learning preferences.
            </p>
          </div>

          <div class="text-center">
            <div class="flex items-center justify-center w-16 h-16 mx-auto bg-warn-100 dark:bg-warn-900 rounded-xl">
              <SparklesIcon class="w-8 h-8 text-warn-600 dark:text-warn-400" />
            </div>
            <h3 class="mt-6 text-lg font-semibold text-surface-900 dark:text-surface-100">
              3. Course Generation
            </h3>
            <p class="mt-2 text-surface-600 dark:text-surface-400">
              AI creates a personalized course outline with lessons, practice, and assessments.
            </p>
          </div>

          <div class="text-center">
            <div class="flex items-center justify-center w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900 rounded-xl">
              <TrophyIcon class="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="mt-6 text-lg font-semibold text-surface-900 dark:text-surface-100">
              4. Start Learning
            </h3>
            <p class="mt-2 text-surface-600 dark:text-surface-400">
              Begin your personalized learning journey with adaptive lessons and real-time feedback.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
            Powerful Features
          </h2>
          <p class="mt-4 text-lg text-surface-600 dark:text-surface-400">
            Everything you need to learn more effectively
          </p>
        </div>

        <div class="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div class="flex">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <DocumentTextIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
                Smart Summaries
              </h3>
              <p class="mt-2 text-surface-600 dark:text-surface-400">
                Get key insights and structured outlines from any document, video, or audio file.
              </p>
            </div>
          </div>

          <div class="flex">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <ChatBubbleLeftRightIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
                AI Tutor
              </h3>
              <p class="mt-2 text-surface-600 dark:text-surface-400">
                Ask questions about your content and get detailed answers with source citations.
              </p>
            </div>
          </div>

          <div class="flex">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <PuzzlePieceIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
                Adaptive Quizzes
              </h3>
              <p class="mt-2 text-surface-600 dark:text-surface-400">
                Practice with AI-generated questions that adapt to your learning progress.
              </p>
            </div>
          </div>

          <div class="flex">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <MicrophoneIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
                Voice Mode
              </h3>
              <p class="mt-2 text-surface-600 dark:text-surface-400">
                Study hands-free with voice interactions and audio responses.
              </p>
            </div>
          </div>

          <div class="flex">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <ChartBarIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
                Progress Analytics
              </h3>
              <p class="mt-2 text-surface-600 dark:text-surface-400">
                Track your learning progress and identify areas that need more attention.
              </p>
            </div>
          </div>

          <div class="flex">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <BoltIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
                Spaced Repetition
              </h3>
              <p class="mt-2 text-surface-600 dark:text-surface-400">
                Optimize retention with scientifically-proven spaced repetition flashcards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-primary-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold tracking-tight text-white">
          Ready to Transform Your Learning?
        </h2>
        <p class="mt-4 text-lg text-primary-100">
          Join thousands of students and professionals who learn more effectively with EduNow.AI
        </p>
        <div class="mt-8">
          <router-link to="/sign-up" class="btn-lg inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-600 focus:ring-white">
            Start Learning for Free
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-surface-50 dark:bg-surface-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <div class="flex items-center justify-center space-x-2 mb-4">
            <div class="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">E</span>
            </div>
            <span class="text-xl font-semibold text-surface-900 dark:text-surface-100">
              EduNow.AI
            </span>
          </div>
          <p class="text-surface-600 dark:text-surface-400">
            AI-powered learning platform for the modern student
          </p>
          <div class="mt-6 flex justify-center space-x-6">
            <router-link to="/pricing" class="text-surface-500 hover:text-surface-600 dark:text-surface-400 dark:hover:text-surface-300">
              Pricing
            </router-link>
            <a href="#" class="text-surface-500 hover:text-surface-600 dark:text-surface-400 dark:hover:text-surface-300">
              Privacy
            </a>
            <a href="#" class="text-surface-500 hover:text-surface-600 dark:text-surface-400 dark:hover:text-surface-300">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  CheckIcon,
  CloudArrowUpIcon,
  SparklesIcon,
  AcademicCapIcon,
  TrophyIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PuzzlePieceIcon,
  MicrophoneIcon,
  ChartBarIcon,
  BoltIcon,
  SunIcon,
  MoonIcon,
  LinkIcon,
  DocumentIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { useUiStore } from '@/app/store/ui'

const uiStore = useUiStore()
const router = useRouter()

// File upload state
const fileInput = ref<HTMLInputElement>()
const uploadedFiles = ref<File[]>([])
const isDragOver = ref(false)
const courseLinks = ref('')

// Trial workflow state
const courseDescription = ref('')

// File upload methods
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const files = Array.from(target.files)
    validateAndAddFiles(files)
  }
}

const handleFileDrop = (event: DragEvent) => {
  isDragOver.value = false
  if (event.dataTransfer?.files) {
    const files = Array.from(event.dataTransfer.files)
    validateAndAddFiles(files)
  }
}

const validateAndAddFiles = (files: File[]) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'video/mp4',
    'audio/mpeg',
    'audio/wav',
    'audio/mp4'
  ]
  
  const maxSize = 50 * 1024 * 1024 // 50MB
  
  files.forEach(file => {
    if (!allowedTypes.includes(file.type)) {
      uiStore.showError(`File type not supported: ${file.name}`)
      return
    }
    
    if (file.size > maxSize) {
      uiStore.showError(`File too large: ${file.name} (max 50MB)`)
      return
    }
    
    // Check if file already exists
    if (!uploadedFiles.value.some(f => f.name === file.name && f.size === file.size)) {
      uploadedFiles.value.push(file)
    }
  })
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const startTrial = () => {
  // Validate inputs
  if (uploadedFiles.value.length === 0 && !courseLinks.value && !courseDescription.value.trim()) {
    uiStore.showError('Please upload a file, add a link, or describe what you want to learn')
    return
  }
  
  // Store the course data in session storage for the trial flow
  const courseData = {
    files: uploadedFiles.value.map(f => ({ name: f.name, size: f.size, type: f.type })),
    links: courseLinks.value,
    description: courseDescription.value
  }
  
  sessionStorage.setItem('trialCourseData', JSON.stringify(courseData))
  
  // Redirect to learning assessment
  router.push('/trial/assessment')
}
</script>
