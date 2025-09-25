<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-100">Library</h1>
          <p class="text-surface-600 dark:text-surface-400">
            Manage your documents and learning materials
          </p>
        </div>
        <button class="btn-primary" @click="showUpload = true">
          <CloudArrowUpIcon class="h-4 w-4 mr-2" />
          Upload
        </button>
      </div>

      <!-- Upload section -->
      <div v-if="showUpload" class="mb-8">
        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
              Upload Documents
            </h2>
            <button 
              class="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
              @click="showUpload = false"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>
          <UploadDropzone
            :disabled="false"
            @upload="handleUpload"
            @remove="handleRemove"
          />
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-400" />
              <input
                v-model="libraryStore.searchQuery"
                type="text"
                placeholder="Search documents..."
                class="input pl-10"
                @input="libraryStore.setSearchQuery(($event.target as HTMLInputElement).value)"
              />
            </div>
          </div>
          
          <!-- Type filter -->
          <select 
            v-model="libraryStore.selectedType"
            class="input w-full sm:w-48"
            @change="libraryStore.setSelectedType(($event.target as HTMLSelectElement).value as ContentType | 'all')"
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF</option>
            <option value="slides">Slides</option>
            <option value="youtube">Video</option>
            <option value="audio">Audio</option>
            <option value="text">Text</option>
          </select>
          
          <!-- Tag filter -->
          <div class="w-full sm:w-64">
            <TagMultiselect
              v-model="libraryStore.selectedTags"
              :available-tags="libraryStore.allTags"
              placeholder="Filter by tags..."
            />
          </div>
        </div>
      </div>

      <!-- Library content -->
      <div v-if="libraryStore.filteredItems.length === 0" class="card p-6">
        <div class="text-center py-12">
          <BookOpenIcon class="h-12 w-12 text-surface-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">
            {{ libraryStore.items.length === 0 ? 'Your Library' : 'No documents found' }}
          </h3>
          <p class="text-surface-600 dark:text-surface-400 mb-4">
            {{ libraryStore.items.length === 0 
              ? 'Upload documents to get started with AI-powered learning' 
              : 'Try adjusting your search or filters' }}
          </p>
          <button v-if="libraryStore.items.length === 0" class="btn-primary" @click="showUpload = true">
            Upload Your First Document
          </button>
          <button v-else class="btn-outline" @click="clearFilters">
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Document grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in libraryStore.filteredItems"
          :key="item.id"
          class="card p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          @click="$router.push(`/library/${item.id}`)"
        >
          <!-- Document header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <component :is="getItemIcon(item.type)" class="h-8 w-8 text-primary-600" />
              <div>
                <h3 class="font-semibold text-surface-900 dark:text-surface-100 group-hover:text-primary-600 transition-colors">
                  {{ item.title }}
                </h3>
                <p class="text-sm text-surface-500 dark:text-surface-400">
                  {{ formatDate(item.createdAt) }}
                </p>
              </div>
            </div>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getStatusBadgeClasses(item.status)"
            >
              {{ getStatusText(item.status) }}
            </span>
          </div>

          <!-- Document info -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-surface-600 dark:text-surface-400">
              <component :is="getItemIcon(item.type)" class="h-4 w-4 mr-2" />
              {{ item.type.toUpperCase() }}
              <span v-if="item.sizeKB" class="ml-2">
                • {{ formatFileSize(item.sizeKB) }}
              </span>
              <span v-if="item.durationSec" class="ml-2">
                • {{ formatDuration(item.durationSec) }}
              </span>
            </div>
            <p class="text-sm text-surface-600 dark:text-surface-400 line-clamp-2">
              {{ item.previewText }}
            </p>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tag in item.tags.slice(0, 3)"
              :key="tag"
              class="badge-secondary text-xs"
            >
              {{ tag }}
            </span>
            <span v-if="item.tags.length > 3" class="text-xs text-surface-500">
              +{{ item.tags.length - 3 }} more
            </span>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between">
            <div class="flex space-x-2">
              <button
                class="btn-outline btn-sm"
                @click.stop="$router.push(`/tutor?item=${item.id}`)"
                :disabled="item.status !== 'ready'"
              >
                <ChatBubbleLeftRightIcon class="h-4 w-4 mr-1" />
                Ask AI
              </button>
              <button
                class="btn-outline btn-sm"
                @click.stop="$router.push(`/study?item=${item.id}`)"
                :disabled="item.status !== 'ready'"
              >
                <AcademicCapIcon class="h-4 w-4 mr-1" />
                Study
              </button>
            </div>
            <button
              class="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
              @click.stop="deleteItem(item.id)"
            >
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  CloudArrowUpIcon, 
  BookOpenIcon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  TrashIcon,
  DocumentTextIcon,
  PresentationChartLineIcon,
  PlayIcon,
  SpeakerWaveIcon,
  DocumentIcon
} from '@heroicons/vue/24/outline'
import type { ContentType } from '@/app/types'
import AppLayout from '@/components/AppLayout.vue'
import UploadDropzone from '@/components/UploadDropzone.vue'
import TagMultiselect from '@/components/TagMultiselect.vue'
import { useLibraryStore } from '@/app/store/library'
import { useUiStore } from '@/app/store/ui'
import { getMockData } from '@/mock/seed'

const router = useRouter()
const libraryStore = useLibraryStore()
const uiStore = useUiStore()
const showUpload = ref(false)

onMounted(() => {
  // Load mock data if not already loaded
  if (libraryStore.items.length === 0) {
    const mockData = getMockData()
    mockData.items.forEach((item: any) => libraryStore.addItem(item))
  }
})

const getItemIcon = (type: ContentType) => {
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

const getStatusText = (status: string) => {
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

const getStatusBadgeClasses = (status: string) => {
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const formatFileSize = (sizeKB: number) => {
  if (sizeKB < 1024) {
    return `${sizeKB} KB`
  } else {
    return `${(sizeKB / 1024).toFixed(1)} MB`
  }
}

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const handleUpload = (files: File[]) => {
  files.forEach(file => {
    const mockItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: file.name.replace(/\.[^/.]+$/, ''),
      type: getContentType(file),
      createdAt: new Date().toISOString(),
      sizeKB: Math.round(file.size / 1024),
      tags: [],
      previewText: `Preview text for ${file.name}...`,
      status: 'processing' as const
    }
    
    libraryStore.addItem(mockItem)
    
    // Simulate processing
    setTimeout(() => {
      libraryStore.updateItem(mockItem.id, { status: 'ready' })
    }, 2000 + Math.random() * 1000)
  })
  
  uiStore.showSuccess(`${files.length} file(s) uploaded successfully`)
  showUpload.value = false
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
      return 'youtube'
    case 'mp3':
    case 'wav':
      return 'audio'
    default:
      return 'text'
  }
}

const handleRemove = (fileId: string) => {
  libraryStore.deleteItem(fileId)
  uiStore.showSuccess('File removed successfully')
}

const deleteItem = async (itemId: string) => {
  const confirmed = await uiStore.confirm('Are you sure you want to delete this document?')
  if (confirmed) {
    libraryStore.deleteItem(itemId)
    uiStore.showSuccess('Document deleted successfully')
  }
}

const clearFilters = () => {
  libraryStore.clearFilters()
}
</script>
