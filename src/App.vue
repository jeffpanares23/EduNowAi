<template>
  <div id="app" class="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors">
    <!-- Toast notifications -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <Toast
        v-for="toast in uiStore.toasts"
        :key="toast.id"
        :toast="toast"
        @close="uiStore.removeToast(toast.id)"
      />
    </div>

    <!-- Dialog modals -->
    <Dialog
      v-for="dialog in uiStore.dialogs"
      :key="dialog.id"
      :dialog="dialog"
    />

    <!-- Main app content -->
    <router-view />

    <!-- Loading overlay -->
    <div
      v-if="uiStore.isLoading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-surface-800 rounded-lg p-6">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span class="text-surface-900 dark:text-surface-100">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/app/store/auth'
import { useUiStore } from '@/app/store/ui'
import { useI18n } from '@/app/composables/useI18n'
import Toast from '@/components/Toast.vue'
import Dialog from '@/components/Dialog.vue'
import { initializeMockData } from '@/mock/seed'

const authStore = useAuthStore()
const uiStore = useUiStore()
const { initializeLocale } = useI18n()

onMounted(() => {
  // Initialize theme
  uiStore.initializeTheme()
  
  // Initialize auth from localStorage
  authStore.initializeAuth()
  
  // Initialize i18n
  initializeLocale()
  
  // Initialize mock data
  initializeMockData()
})
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-surface-100 dark:bg-surface-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-surface-400 dark:bg-surface-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-surface-500 dark:bg-surface-500;
}

/* Focus styles */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-surface-900;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.fade-in {
  animation: fadeIn 0.2s ease-out;
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

/* Skeleton loading */
.skeleton {
  @apply animate-pulse bg-surface-200 dark:bg-surface-700 rounded;
}

/* Code highlighting */
.hljs {
  @apply bg-surface-100 dark:bg-surface-800 rounded p-4 text-sm overflow-x-auto;
}
</style>
