<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-in-out duration-500"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-500"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-surface-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel class="pointer-events-auto w-screen max-w-md">
                <div class="flex h-full flex-col overflow-y-scroll bg-white dark:bg-surface-900 shadow-xl">
                  <div class="px-4 py-6 sm:px-6">
                    <div class="flex items-start justify-between">
                      <DialogTitle class="text-base font-semibold leading-6 text-surface-900 dark:text-surface-100">
                        Source Viewer
                      </DialogTitle>
                      <div class="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          class="rounded-md bg-white dark:bg-surface-900 text-surface-400 hover:text-surface-500 dark:hover:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          @click="$emit('close')"
                        >
                          <span class="sr-only">Close panel</span>
                          <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="relative flex-1 px-4 sm:px-6">
                    <!-- Source information -->
                    <div class="mb-6">
                      <div class="flex items-center space-x-2 mb-2">
                        <component :is="sourceIcon" class="h-5 w-5 text-surface-400" />
                        <span class="text-sm font-medium text-surface-900 dark:text-surface-100">
                          {{ sourceTitle }}
                        </span>
                      </div>
                      <SourceChip :location="location" variant="secondary" />
                    </div>

                    <!-- Content viewer -->
                    <div class="space-y-4">
                      <!-- PDF/Slides viewer -->
                      <div v-if="location.type === 'pdf' || location.type === 'slides'" class="space-y-4">
                        <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
                          <div class="flex items-center justify-between mb-3">
                            <h4 class="text-sm font-medium text-surface-900 dark:text-surface-100">
                              Page {{ location.page || 1 }}
                            </h4>
                            <div class="flex items-center space-x-2">
                              <button
                                class="btn-sm btn-outline"
                                :disabled="(location.page || 1) <= 1"
                                @click="navigatePage(-1)"
                              >
                                <ChevronLeftIcon class="h-4 w-4" />
                              </button>
                              <button
                                class="btn-sm btn-outline"
                                @click="navigatePage(1)"
                              >
                                <ChevronRightIcon class="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          <!-- Mock page content -->
                          <div class="bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded p-4 min-h-[300px]">
                            <div class="space-y-3 text-sm text-surface-700 dark:text-surface-300">
                              <p class="font-semibold">{{ mockPageTitle }}</p>
                              <p>{{ mockPageContent }}</p>
                              <div class="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-400 p-3 rounded">
                                <p class="text-primary-800 dark:text-primary-200 font-medium">
                                  Highlighted Content
                                </p>
                                <p class="text-primary-700 dark:text-primary-300 mt-1">
                                  {{ highlightedText }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Video/Audio viewer -->
                      <div v-else-if="location.type === 'youtube' || location.type === 'audio'" class="space-y-4">
                        <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
                          <div class="flex items-center justify-between mb-3">
                            <h4 class="text-sm font-medium text-surface-900 dark:text-surface-100">
                              {{ location.type === 'youtube' ? 'Video' : 'Audio' }} Timestamp
                            </h4>
                            <span class="text-sm text-surface-500 dark:text-surface-400">
                              {{ formatTimestamp(location.timestampSec || 0) }}
                            </span>
                          </div>
                          
                          <!-- Mock media player -->
                          <div class="bg-surface-900 rounded-lg p-8 text-center">
                            <component 
                              :is="location.type === 'youtube' ? PlayIcon : SpeakerWaveIcon" 
                              class="h-12 w-12 text-surface-400 mx-auto mb-4" 
                            />
                            <p class="text-white text-sm mb-4">
                              Mock {{ location.type === 'youtube' ? 'Video' : 'Audio' }} Player
                            </p>
                            <button class="btn-primary btn-sm">
                              <PlayIcon class="h-4 w-4 mr-2" />
                              Play from {{ formatTimestamp(location.timestampSec || 0) }}
                            </button>
                          </div>
                          
                          <!-- Timeline -->
                          <div class="mt-4">
                            <div class="flex items-center space-x-2">
                              <span class="text-xs text-surface-500 dark:text-surface-400">0:00</span>
                              <div class="flex-1 bg-surface-200 dark:bg-surface-700 rounded-full h-2 relative">
                                <div 
                                  class="bg-primary-500 h-2 rounded-full"
                                  :style="{ width: `${((location.timestampSec || 0) / mockDuration) * 100}%` }"
                                ></div>
                                <div 
                                  class="absolute top-0 w-3 h-3 bg-primary-600 rounded-full transform -translate-y-0.5 -translate-x-1.5"
                                  :style="{ left: `${((location.timestampSec || 0) / mockDuration) * 100}%` }"
                                ></div>
                              </div>
                              <span class="text-xs text-surface-500 dark:text-surface-400">
                                {{ formatTimestamp(mockDuration) }}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Transcript section -->
                        <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
                          <h4 class="text-sm font-medium text-surface-900 dark:text-surface-100 mb-3">
                            Transcript
                          </h4>
                          <div class="space-y-2 text-sm text-surface-700 dark:text-surface-300">
                            <p class="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-400 p-2 rounded">
                              <strong>{{ formatTimestamp(location.timestampSec || 0) }}:</strong>
                              {{ highlightedText }}
                            </p>
                            <p>Additional context from the transcript...</p>
                          </div>
                        </div>
                      </div>

                      <!-- Text viewer -->
                      <div v-else class="space-y-4">
                        <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
                          <h4 class="text-sm font-medium text-surface-900 dark:text-surface-100 mb-3">
                            Text Content
                          </h4>
                          <div class="prose prose-sm dark:prose-invert max-w-none">
                            <div class="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-400 p-3 rounded">
                              <p class="text-primary-800 dark:text-primary-200">
                                {{ highlightedText }}
                              </p>
                            </div>
                            <p class="mt-3 text-surface-700 dark:text-surface-300">
                              Additional context from the document...
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  SpeakerWaveIcon,
  DocumentTextIcon,
  PresentationChartLineIcon,
  DocumentIcon,
} from '@heroicons/vue/24/outline'
import type { SourceLocation } from '@/app/types'
import SourceChip from './SourceChip.vue'

const props = defineProps<{
  isOpen: boolean
  location: SourceLocation
  highlightedText?: string
}>()

defineEmits<{
  close: []
  navigate: [location: SourceLocation]
}>()

const sourceIcon = computed(() => {
  switch (props.location.type) {
    case 'pdf':
      return DocumentTextIcon
    case 'slides':
      return PresentationChartLineIcon
    case 'youtube':
      return PlayIcon
    case 'audio':
      return SpeakerWaveIcon
    default:
      return DocumentIcon
  }
})

const sourceTitle = computed(() => {
  return `${props.location.type.toUpperCase()} Source`
})

const mockPageTitle = computed(() => {
  return `Chapter ${props.location.page || 1}: Sample Content`
})

const mockPageContent = computed(() => {
  return `This is mock content for page ${props.location.page || 1}. In a real implementation, this would show the actual content from the document.`
})

const mockDuration = 3600 // 1 hour in seconds

const formatTimestamp = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const navigatePage = (direction: number) => {
  const newPage = Math.max(1, (props.location.page || 1) + direction)
  const newLocation: SourceLocation = {
    ...props.location,
    page: newPage
  }
  // In a real app, this would emit the navigation event
  console.log('Navigate to page:', newPage)
}
</script>
