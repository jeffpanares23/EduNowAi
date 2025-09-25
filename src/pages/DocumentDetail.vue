<template>
  <AppLayout>
    <div v-if="!item" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="card p-6">
        <div class="text-center py-12">
          <DocumentIcon class="h-12 w-12 text-surface-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">
            Document Not Found
          </h3>
          <p class="text-surface-600 dark:text-surface-400 mb-4">
            The document you're looking for doesn't exist or has been removed.
          </p>
          <router-link to="/library" class="btn-primary"> Back to Library </router-link>
        </div>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-4">
          <button
            @click="$router.back()"
            class="p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            <ArrowLeftIcon class="h-5 w-5" />
          </button>
          <div>
            <div class="flex items-center space-x-3 mb-2">
              <component :is="getItemIcon(item.type)" class="h-8 w-8 text-primary-600" />
              <div>
                <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-100">
                  {{ item.title }}
                </h1>
                <div
                  class="flex items-center space-x-4 text-sm text-surface-600 dark:text-surface-400"
                >
                  <span>{{ item.type.toUpperCase() }}</span>
                  <span v-if="item.sizeKB">{{ formatFileSize(item.sizeKB) }}</span>
                  <span v-if="item.durationSec">{{ formatDuration(item.durationSec) }}</span>
                  <span>{{ formatDate(item.createdAt) }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getStatusBadgeClasses(item.status)"
              >
                {{ getStatusText(item.status) }}
              </span>
              <div class="flex flex-wrap gap-1">
                <span v-for="tag in item.tags" :key="tag" class="badge-secondary text-xs">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <button
            class="btn-outline"
            @click="$router.push(`/tutor?item=${item.id}`)"
            :disabled="item.status !== 'ready'"
          >
            <ChatBubbleLeftRightIcon class="h-4 w-4 mr-2" />
            Ask AI
          </button>
          <button
            class="btn-outline"
            @click="$router.push(`/study?item=${item.id}`)"
            :disabled="item.status !== 'ready'"
          >
            <AcademicCapIcon class="h-4 w-4 mr-2" />
            Study
          </button>
          <button
            class="btn-primary"
            @click="showSourceViewer = true"
            :disabled="item.status !== 'ready'"
          >
            <EyeIcon class="h-4 w-4 mr-2" />
            View Content
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Document Preview -->
          <div class="card p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
                Document Preview
              </h2>
              <button class="btn-outline btn-sm" @click="showSourceViewer = true">
                <ArrowsPointingOutIcon class="h-4 w-4 mr-1" />
                Full View
              </button>
            </div>

            <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-6 min-h-[300px]">
              <div v-if="item.status === 'processing'" class="text-center py-12">
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"
                ></div>
                <p class="text-surface-600 dark:text-surface-400">Processing document...</p>
              </div>
              <div v-else-if="item.status === 'error'" class="text-center py-12">
                <ExclamationTriangleIcon class="h-8 w-8 text-error-500 mx-auto mb-4" />
                <p class="text-error-600 dark:text-error-400">Error processing document</p>
              </div>
              <div v-else class="prose dark:prose-invert max-w-none">
                <p class="text-surface-700 dark:text-surface-300 leading-relaxed">
                  {{ item.previewText }}
                </p>
                <div class="mt-6 text-center">
                  <button class="btn-outline btn-sm" @click="showSourceViewer = true">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Key Insights -->
          <div class="card p-6">
            <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
              Key Insights
            </h2>

            <div v-if="currentSummary" class="space-y-6">
              <div>
                <h3 class="text-md font-medium text-surface-900 dark:text-surface-100 mb-2">
                  TL;DR
                </h3>
                <p class="text-surface-700 dark:text-surface-300">
                  {{ currentSummary.tldr }}
                </p>
              </div>

              <div>
                <h3 class="text-md font-medium text-surface-900 dark:text-surface-100 mb-2">
                  Key Points
                </h3>
                <ul class="space-y-2">
                  <li
                    v-for="bullet in currentSummary.bullets.slice(0, 5)"
                    :key="bullet"
                    class="flex items-start space-x-2"
                  >
                    <div class="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span class="text-surface-700 dark:text-surface-300">{{ bullet }}</span>
                  </li>
                </ul>
                <button
                  v-if="currentSummary.bullets.length > 5"
                  class="btn-outline btn-sm mt-3"
                  @click="$router.push(`/study?item=${item.id}&tab=summary`)"
                >
                  View All Points
                </button>
              </div>
            </div>

            <div v-else class="text-center py-8">
              <SparklesIcon class="h-8 w-8 text-surface-400 mx-auto mb-3" />
              <p class="text-surface-600 dark:text-surface-400 mb-4">No summary available yet</p>
              <button
                class="btn-primary btn-sm"
                @click="generateSummary"
                :disabled="item.status !== 'ready' || isGeneratingSummary"
              >
                <SparklesIcon class="h-4 w-4 mr-1" />
                {{ isGeneratingSummary ? 'Generating...' : 'Generate Summary' }}
              </button>
            </div>
          </div>

          <!-- Related Content -->
          <div class="card p-6">
            <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
              Related Documents
            </h2>

            <div v-if="relatedItems.length > 0" class="space-y-3">
              <div
                v-for="relatedItem in relatedItems"
                :key="relatedItem.id"
                class="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors cursor-pointer"
                @click="$router.push(`/library/${relatedItem.id}`)"
              >
                <component :is="getItemIcon(relatedItem.type)" class="h-5 w-5 text-primary-600" />
                <div class="flex-1">
                  <h4 class="font-medium text-surface-900 dark:text-surface-100">
                    {{ relatedItem.title }}
                  </h4>
                  <p class="text-sm text-surface-600 dark:text-surface-400">
                    {{ relatedItem.type.toUpperCase() }} • {{ formatDate(relatedItem.createdAt) }}
                  </p>
                </div>
                <ArrowRightIcon class="h-4 w-4 text-surface-400" />
              </div>
            </div>

            <div v-else class="text-center py-8">
              <DocumentIcon class="h-8 w-8 text-surface-400 mx-auto mb-3" />
              <p class="text-surface-600 dark:text-surface-400">No related documents found</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
              Quick Actions
            </h3>
            <div class="space-y-3">
              <button
                class="w-full btn-outline btn-sm justify-start"
                @click="$router.push(`/tutor?item=${item.id}`)"
                :disabled="item.status !== 'ready'"
              >
                <ChatBubbleLeftRightIcon class="h-4 w-4 mr-2" />
                Ask Questions
              </button>
              <button
                class="w-full btn-outline btn-sm justify-start"
                @click="$router.push(`/study?item=${item.id}&tab=quiz`)"
                :disabled="item.status !== 'ready'"
              >
                <AcademicCapIcon class="h-4 w-4 mr-2" />
                Take Quiz
              </button>
              <button
                class="w-full btn-outline btn-sm justify-start"
                @click="$router.push(`/study?item=${item.id}&tab=flashcards`)"
                :disabled="item.status !== 'ready'"
              >
                <CreditCardIcon class="h-4 w-4 mr-2" />
                Study Flashcards
              </button>
              <button
                class="w-full btn-outline btn-sm justify-start"
                @click="downloadDocument"
                :disabled="item.status !== 'ready'"
              >
                <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          </div>

          <!-- Document Stats -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
              Document Stats
            </h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-surface-600 dark:text-surface-400">Chunks</span>
                <span class="font-medium text-surface-900 dark:text-surface-100">
                  {{ documentChunks.length }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-surface-600 dark:text-surface-400">Questions Asked</span>
                <span class="font-medium text-surface-900 dark:text-surface-100">
                  {{ chatHistory.length }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-surface-600 dark:text-surface-400">Study Sessions</span>
                <span class="font-medium text-surface-900 dark:text-surface-100">
                  {{ studySessions }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-surface-600 dark:text-surface-400">Last Accessed</span>
                <span class="font-medium text-surface-900 dark:text-surface-100">
                  {{ formatRelativeTime(item.createdAt) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Tags Management -->
          <div class="card p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">Tags</h3>
              <button class="btn-outline btn-sm" @click="showTagEditor = !showTagEditor">
                <PencilIcon class="h-4 w-4" />
              </button>
            </div>

            <div v-if="showTagEditor" class="mb-4">
              <TagMultiselect
                v-model="editableTags"
                :available-tags="allAvailableTags"
                placeholder="Add tags..."
              />
              <div class="flex justify-end space-x-2 mt-3">
                <button class="btn-outline btn-sm" @click="cancelTagEdit">Cancel</button>
                <button class="btn-primary btn-sm" @click="saveTagEdit">Save</button>
              </div>
            </div>

            <div v-else>
              <div v-if="item.tags.length > 0" class="flex flex-wrap gap-2">
                <span v-for="tag in item.tags" :key="tag" class="badge-secondary">
                  {{ tag }}
                </span>
              </div>
              <p v-else class="text-sm text-surface-600 dark:text-surface-400">No tags assigned</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Source Viewer -->
      <SourceViewerDrawer
        :is-open="showSourceViewer"
        :location="sourceLocation || { type: 'pdf', refId: '', page: 1, timestampSec: 0 }"
        @close="showSourceViewer = false"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  DocumentIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  EyeIcon,
  ArrowsPointingOutIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ArrowRightIcon,
  CreditCardIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  DocumentTextIcon,
  PresentationChartLineIcon,
  PlayIcon,
  SpeakerWaveIcon,
} from '@heroicons/vue/24/outline'
import type { ContentType, IngestedItem, Summary, Chunk } from '@/app/types'
import AppLayout from '@/components/AppLayout.vue'
import SourceViewerDrawer from '@/components/SourceViewerDrawer.vue'
import TagMultiselect from '@/components/TagMultiselect.vue'
import { useLibraryStore } from '@/app/store/library'
import { useStudyStore } from '@/app/store/study'
import { useTutorStore } from '@/app/store/tutor'
import { useUiStore } from '@/app/store/ui'
import { getMockData } from '@/mock/seed'

const route = useRoute()
const router = useRouter()
const libraryStore = useLibraryStore()
const studyStore = useStudyStore()
const tutorStore = useTutorStore()
const uiStore = useUiStore()

const showSourceViewer = ref(false)
const showTagEditor = ref(false)
const isGeneratingSummary = ref(false)
const editableTags = ref<string[]>([])

const itemId = computed(() => route.params.id as string)

const item = computed(() => {
  return libraryStore.getItemById(itemId.value)
})

const currentSummary = computed(() => {
  return studyStore.summaries.find((s) => s.itemId === itemId.value)
})

const documentChunks = computed(() => {
  const mockData = getMockData()
  return mockData.chunks.filter((chunk: any) =>
    chunk.locations.some((loc: any) => loc.itemId === itemId.value)
  )
})

const chatHistory = computed(() => {
  return tutorStore.chatHistory.filter((turn: any) =>
    turn.citedChunks?.some((chunk: any) => chunk.locations.some((loc: any) => loc.itemId === itemId.value))
  )
})

const relatedItems = computed(() => {
  if (!item.value) return []

  return libraryStore.items
    .filter((i) => i.id !== item.value!.id && i.status === 'ready')
    .filter((i) => i.tags.some((tag) => item.value!.tags.includes(tag)))
    .slice(0, 3)
})

const allAvailableTags = computed(() => {
  const tags = new Set<string>()
  libraryStore.items.forEach((item) => {
    item.tags.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags)
})

const sourceLocation = computed(() => {
  if (!item.value) return null

  return {
    type: item.value.type,
    refId: item.value.id,
    page: 1,
    timestampSec: 0
  }
})

const studySessions = computed(() => {
  // Mock calculation - in real app, this would come from analytics
  return Math.floor(Math.random() * 10) + 1
})

onMounted(() => {
  // Load mock data if needed
  if (libraryStore.items.length === 0) {
    const mockData = getMockData()
    mockData.items.forEach((item: any) => libraryStore.addItem(item))
    mockData.summaries.forEach((summary: any) => studyStore.summaries.push(summary))
  }
})

watch(
  () => item.value?.tags,
  (newTags) => {
    if (newTags) {
      editableTags.value = [...newTags]
    }
  },
  { immediate: true }
)

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

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return 'Today'
  } else if (diffInDays === 1) {
    return 'Yesterday'
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

const generateSummary = async () => {
  if (!item.value) return

  isGeneratingSummary.value = true
  try {
    await studyStore.generateSummary(item.value.id)
    uiStore.showSuccess('Summary generated successfully!')
  } catch (error) {
    uiStore.showError('Failed to generate summary')
  } finally {
    isGeneratingSummary.value = false
  }
}

const downloadDocument = () => {
  if (!item.value) return

  // Mock download - in real app, this would trigger actual download
  uiStore.showSuccess('Download started')
}

const saveTagEdit = () => {
  if (!item.value) return

  libraryStore.updateItem(item.value.id, { tags: editableTags.value })
  showTagEditor.value = false
  uiStore.showSuccess('Tags updated successfully')
}

const cancelTagEdit = () => {
  if (item.value) {
    editableTags.value = [...item.value.tags]
  }
  showTagEditor.value = false
}
</script>
