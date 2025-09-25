<template>
  <div
    class="relative border-2 border-dashed rounded-lg p-6 transition-colors"
    :class="[
      isDragOver 
        ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' 
        : 'border-surface-300 dark:border-surface-600',
      isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary-400 hover:bg-surface-50 dark:hover:bg-surface-800'
    ]"
    @drop="handleDrop"
    @dragover="handleDragOver"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @click="!isDisabled && openFileDialog()"
  >
    <div class="text-center">
      <CloudArrowUpIcon class="mx-auto h-12 w-12 text-surface-400" />
      <div class="mt-4">
        <p class="text-sm font-medium text-surface-900 dark:text-surface-100">
          {{ isDragOver ? 'Drop files here' : 'Upload documents' }}
        </p>
        <p class="text-sm text-surface-500 dark:text-surface-400">
          Drag and drop files here, or click to browse
        </p>
        <p class="text-xs text-surface-400 dark:text-surface-500 mt-2">
          Supports PDF, PowerPoint, videos, audio, and text files
        </p>
      </div>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      multiple
      class="hidden"
      :accept="acceptedFileTypes"
      :disabled="isDisabled"
      @change="handleFileSelect"
    />

    <!-- Upload progress overlay -->
    <div
      v-if="isUploading"
      class="absolute inset-0 bg-white/90 dark:bg-surface-900/90 rounded-lg flex items-center justify-center"
    >
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-2 text-sm font-medium text-surface-900 dark:text-surface-100">
          Uploading files...
        </p>
      </div>
    </div>
  </div>

  <!-- File preview list -->
  <div v-if="uploadedFiles.length > 0" class="mt-4 space-y-2">
    <h4 class="text-sm font-medium text-surface-900 dark:text-surface-100">
      Uploaded Files
    </h4>
    <div class="space-y-2">
      <div
        v-for="file in uploadedFiles"
        :key="file.id"
        class="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800 rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <component :is="getFileIcon(file.type)" class="h-5 w-5 text-surface-400" />
          <div>
            <p class="text-sm font-medium text-surface-900 dark:text-surface-100">
              {{ file.title }}
            </p>
            <p class="text-xs text-surface-500 dark:text-surface-400">
              {{ file.type.toUpperCase() }} • {{ formatFileSize(file.sizeKB) }}
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getStatusBadgeClasses(file.status)"
          >
            {{ getStatusText(file.status) }}
          </span>
          <button
            class="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
            @click="removeFile(file.id)"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  PresentationChartLineIcon,
  PlayIcon,
  SpeakerWaveIcon,
  DocumentIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import type { IngestedItem, ContentType } from '@/app/types'

const props = withDefaults(defineProps<{
  maxFiles?: number
  maxFileSizeMB?: number
  disabled?: boolean
}>(), {
  maxFiles: 10,
  maxFileSizeMB: 100,
  disabled: false
})

const emit = defineEmits<{
  upload: [files: File[]]
  remove: [fileId: string]
}>()

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const isUploading = ref(false)
const uploadedFiles = ref<IngestedItem[]>([])

const isDisabled = computed(() => props.disabled || isUploading.value)

const acceptedFileTypes = computed(() => {
  return '.pdf,.ppt,.pptx,.mp4,.mov,.avi,.mp3,.wav,.txt,.md,.doc,.docx'
})

const openFileDialog = () => {
  fileInput.value?.click()
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (!isDisabled.value) {
    isDragOver.value = true
  }
}

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault()
  if (!isDisabled.value) {
    isDragOver.value = true
  }
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  // Only set to false if leaving the dropzone entirely
  if (!(e.currentTarget as Element)?.contains(e.relatedTarget as Node)) {
    isDragOver.value = false
  }
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
  
  if (isDisabled.value) return
  
  const files = Array.from(e.dataTransfer?.files || [])
  processFiles(files)
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  processFiles(files)
  
  // Clear the input
  target.value = ''
}

const processFiles = async (files: File[]) => {
  if (files.length === 0) return
  
  // Validate file count
  if (uploadedFiles.value.length + files.length > props.maxFiles) {
    alert(`Cannot upload more than ${props.maxFiles} files`)
    return
  }
  
  // Validate file sizes
  const oversizedFiles = files.filter(file => file.size > props.maxFileSizeMB * 1024 * 1024)
  if (oversizedFiles.length > 0) {
    alert(`Some files exceed the ${props.maxFileSizeMB}MB limit`)
    return
  }
  
  isUploading.value = true
  
  try {
    // Simulate upload process
    for (const file of files) {
      const mockItem: IngestedItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: file.name.replace(/\.[^/.]+$/, ''),
        type: getContentType(file),
        createdAt: new Date().toISOString(),
        sizeKB: Math.round(file.size / 1024),
        tags: [],
        previewText: `Preview text for ${file.name}...`,
        status: 'processing'
      }
      
      uploadedFiles.value.push(mockItem)
      
      // Simulate processing delay
      setTimeout(() => {
        const item = uploadedFiles.value.find(f => f.id === mockItem.id)
        if (item) {
          item.status = 'ready'
        }
      }, 2000 + Math.random() * 1000)
    }
    
    emit('upload', files)
  } catch (error) {
    console.error('Upload failed:', error)
    alert('Upload failed. Please try again.')
  } finally {
    isUploading.value = false
  }
}

const getContentType = (file: File): ContentType => {
  const extension = file.name.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'pdf':
      return 'pdf'
    case 'ppt':
    case 'pptx':
      return 'slides'
    case 'mp4':
    case 'mov':
    case 'avi':
      return 'youtube' // Using youtube type for all videos
    case 'mp3':
    case 'wav':
      return 'audio'
    default:
      return 'text'
  }
}

const getFileIcon = (type: ContentType) => {
  switch (type) {
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
}

const getStatusText = (status: IngestedItem['status']) => {
  switch (status) {
    case 'processing':
      return 'Processing...'
    case 'ready':
      return 'Ready'
    case 'error':
      return 'Error'
    default:
      return 'Unknown'
  }
}

const getStatusBadgeClasses = (status: IngestedItem['status']) => {
  switch (status) {
    case 'processing':
      return 'bg-warn-100 text-warn-800 dark:bg-warn-900 dark:text-warn-200'
    case 'ready':
      return 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
    case 'error':
      return 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200'
    default:
      return 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200'
  }
}

const formatFileSize = (sizeKB?: number) => {
  if (!sizeKB) return 'Unknown size'
  
  if (sizeKB < 1024) {
    return `${sizeKB} KB`
  } else {
    return `${(sizeKB / 1024).toFixed(1)} MB`
  }
}

const removeFile = (fileId: string) => {
  uploadedFiles.value = uploadedFiles.value.filter(f => f.id !== fileId)
  emit('remove', fileId)
}
</script>
