<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-900 flex flex-col justify-center items-center px-4">
    <div class="text-center">
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
          <ExclamationTriangleIcon class="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
      
      <h1 class="text-6xl font-bold text-surface-900 dark:text-surface-100 mb-4">
        404
      </h1>
      
      <h2 class="text-2xl font-semibold text-surface-700 dark:text-surface-300 mb-2">
        Page Not Found
      </h2>
      
      <p class="text-surface-600 dark:text-surface-400 mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link to="/" class="btn-primary">
          <HomeIcon class="h-4 w-4 mr-2" />
          Go Home
        </router-link>
        
        <button 
          class="btn-outline"
          @click="$router.go(-1)"
        >
          <ArrowLeftIcon class="h-4 w-4 mr-2" />
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ExclamationTriangleIcon,
  HomeIcon,
  ArrowLeftIcon,
} from '@heroicons/vue/24/outline'
</script>
