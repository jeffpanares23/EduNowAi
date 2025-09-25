<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 transform translate-y-2"
    enter-to-class="opacity-100 transform translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 transform translate-y-0"
    leave-to-class="opacity-0 transform translate-y-2"
  >
    <div
      class="max-w-sm w-full bg-white dark:bg-surface-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <CheckCircleIcon
              v-if="toast.type === 'success'"
              class="h-6 w-6 text-success-400"
              aria-hidden="true"
            />
            <XCircleIcon
              v-else-if="toast.type === 'error'"
              class="h-6 w-6 text-error-400"
              aria-hidden="true"
            />
            <ExclamationTriangleIcon
              v-else-if="toast.type === 'warning'"
              class="h-6 w-6 text-warn-400"
              aria-hidden="true"
            />
            <InformationCircleIcon
              v-else
              class="h-6 w-6 text-primary-400"
              aria-hidden="true"
            />
          </div>
          <div class="ml-3 flex-1 min-w-0 pt-0.5">
            <p class="text-sm font-medium text-surface-900 dark:text-surface-100 break-words">
              {{ toast.message }}
            </p>
          </div>
          <div class="ml-3 flex-shrink-0 flex">
            <button
              class="bg-white dark:bg-surface-800 rounded-md inline-flex text-surface-400 hover:text-surface-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 p-1"
              @click="$emit('close')"
            >
              <span class="sr-only">Close</span>
              <XMarkIcon class="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import type { Toast } from '@/app/types'

defineProps<{
  toast: Toast
}>()

defineEmits<{
  close: []
}>()
</script>
