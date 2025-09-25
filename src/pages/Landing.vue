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

    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl sm:text-6xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
            Learn Anything with
            <span class="text-primary-600">AI-Powered</span>
            <br />
            Study Tools
          </h1>
          <p class="mt-6 text-lg leading-8 text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
            Upload your documents, videos, and audio files. Get instant summaries, practice with AI-generated quizzes, 
            and chat with an AI tutor that knows your content inside out.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <router-link to="/sign-up" class="btn-primary btn-lg">
              Try for Free
            </router-link>
            <router-link to="/pricing" class="btn-outline btn-lg">
              View Pricing
            </router-link>
          </div>
          
          <!-- Trust indicators -->
          <div class="mt-12 flex items-center justify-center space-x-8 text-surface-500 dark:text-surface-400">
            <div class="flex items-center space-x-2">
              <CheckIcon class="h-5 w-5 text-success-500" />
              <span class="text-sm">No credit card required</span>
            </div>
            <div class="flex items-center space-x-2">
              <CheckIcon class="h-5 w-5 text-success-500" />
              <span class="text-sm">Free for 3 documents</span>
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
            Four simple steps to supercharge your learning
          </p>
        </div>

        <div class="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div class="text-center">
            <div class="flex items-center justify-center w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900 rounded-xl">
              <CloudArrowUpIcon class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="mt-6 text-lg font-semibold text-surface-900 dark:text-surface-100">
              1. Upload
            </h3>
            <p class="mt-2 text-surface-600 dark:text-surface-400">
              Upload PDFs, videos, audio files, or paste text. We support all major formats.
            </p>
          </div>

          <div class="text-center">
            <div class="flex items-center justify-center w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900 rounded-xl">
              <SparklesIcon class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="mt-6 text-lg font-semibold text-surface-900 dark:text-surface-100">
              2. Understand
            </h3>
            <p class="mt-2 text-surface-600 dark:text-surface-400">
              Get instant AI-generated summaries and key insights from your content.
            </p>
          </div>

          <div class="text-center">
            <div class="flex items-center justify-center w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900 rounded-xl">
              <AcademicCapIcon class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="mt-6 text-lg font-semibold text-surface-900 dark:text-surface-100">
              3. Practice
            </h3>
            <p class="mt-2 text-surface-600 dark:text-surface-400">
              Test your knowledge with AI-generated quizzes and spaced-repetition flashcards.
            </p>
          </div>

          <div class="text-center">
            <div class="flex items-center justify-center w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900 rounded-xl">
              <TrophyIcon class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="mt-6 text-lg font-semibold text-surface-900 dark:text-surface-100">
              4. Master
            </h3>
            <p class="mt-2 text-surface-600 dark:text-surface-400">
              Track your progress and get personalized recommendations to improve.
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
} from '@heroicons/vue/24/outline'
import { useUiStore } from '@/app/store/ui'

const uiStore = useUiStore()
</script>
