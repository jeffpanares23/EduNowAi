<template>
  <button
    class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-colors focus-ring"
    :class="chipClasses"
    @click="$emit('click', location)"
  >
    <component :is="iconComponent" class="h-3 w-3" />
    <span>{{ displayText }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  DocumentTextIcon,
  PresentationChartLineIcon,
  PlayIcon,
  SpeakerWaveIcon,
  DocumentIcon,
} from '@heroicons/vue/24/outline'
import type { SourceLocation } from '@/app/types'

const props = defineProps<{
  location: SourceLocation
  variant?: 'default' | 'primary' | 'secondary'
}>()

defineEmits<{
  click: [location: SourceLocation]
}>()

const iconComponent = computed(() => {
  switch (props.location.type) {
    case 'pdf':
      return DocumentTextIcon
    case 'slides':
      return PresentationChartLineIcon
    case 'youtube':
      return PlayIcon
    case 'audio':
      return SpeakerWaveIcon
    case 'text':
      return DocumentIcon
    default:
      return DocumentIcon
  }
})

const displayText = computed(() => {
  const { type, page, timestampSec } = props.location
  
  if (page !== undefined) {
    return `${type.toUpperCase()} p.${page}`
  }
  
  if (timestampSec !== undefined) {
    const minutes = Math.floor(timestampSec / 60)
    const seconds = timestampSec % 60
    return `${type.toUpperCase()} ${minutes}:${seconds.toString().padStart(2, '0')}`
  }
  
  return type.toUpperCase()
})

const chipClasses = computed(() => {
  const variant = props.variant || 'default'
  
  const baseClasses = 'hover:shadow-sm'
  
  switch (variant) {
    case 'primary':
      return `${baseClasses} bg-primary-100 text-primary-800 hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-200 dark:hover:bg-primary-800`
    case 'secondary':
      return `${baseClasses} bg-surface-100 text-surface-700 hover:bg-surface-200 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600`
    default:
      return `${baseClasses} bg-surface-50 text-surface-600 hover:bg-surface-100 border border-surface-200 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-surface-700 dark:border-surface-600`
  }
})
</script>
