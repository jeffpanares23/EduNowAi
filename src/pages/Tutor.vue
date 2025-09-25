<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Chat Interface -->
        <div class="lg:col-span-3">
          <div class="card h-[600px] flex flex-col">
            <!-- Header -->
            <div class="p-6 border-b border-surface-200 dark:border-surface-700">
              <div class="flex items-center justify-between">
                <div>
                  <h1 class="text-xl font-semibold text-surface-900 dark:text-surface-100">
                    AI Tutor
                  </h1>
                  <p class="text-sm text-surface-600 dark:text-surface-400">
                    Ask questions about your documents
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <!-- Mode toggles -->
                  <div class="flex items-center space-x-2">
                    <label class="text-sm text-surface-600 dark:text-surface-400">Concision:</label>
                    <select 
                      v-model="tutorStore.concisionMode"
                      class="input input-sm"
                      @change="tutorStore.setConcisionMode(($event.target as HTMLSelectElement).value as 'brief' | 'detailed')"
                    >
                      <option value="brief">Brief</option>
                      <option value="detailed">Detailed</option>
                    </select>
                  </div>
                  <div class="flex items-center space-x-2">
                    <label class="text-sm text-surface-600 dark:text-surface-400">Level:</label>
                    <select 
                      v-model="tutorStore.levelMode"
                      class="input input-sm"
                      @change="tutorStore.setLevelMode(($event.target as HTMLSelectElement).value as 'beginner' | 'intermediate' | 'advanced')"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chat Messages -->
            <div class="flex-1 overflow-y-auto p-6 space-y-4">
              <div v-if="tutorStore.currentChat.length === 0" class="text-center py-12">
                <ChatBubbleLeftRightIcon class="h-12 w-12 text-surface-400 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">
                  Start a conversation
                </h3>
                <p class="text-surface-600 dark:text-surface-400 mb-4">
                  Ask me anything about your uploaded documents
                </p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <button
                    v-for="suggestion in tutorStore.getFollowUpSuggestions()"
                    :key="suggestion"
                    class="btn-outline btn-sm"
                    @click="sendMessage(suggestion)"
                  >
                    {{ suggestion }}
                  </button>
                </div>
              </div>

              <div
                v-for="message in tutorStore.currentChat"
                :key="message.id"
                class="flex"
                :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
              >
                <div
                  class="max-w-3xl px-4 py-3 rounded-lg"
                  :class="message.role === 'user' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-900 dark:text-surface-100'"
                >
                  <p class="whitespace-pre-wrap">{{ message.text }}</p>
                  
                  <!-- Citations for assistant messages -->
                  <div v-if="message.role === 'assistant' && message.citedChunks" class="mt-3">
                    <div class="flex flex-wrap gap-1 mb-2">
                      <span
                        v-for="(chunk, index) in message.citedChunks"
                        :key="chunk.id"
                        class="inline-flex items-center px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded cursor-pointer hover:bg-primary-200 dark:hover:bg-primary-800"
                        @click="showSourceViewer(chunk)"
                      >
                        [{{ index + 1 }}]
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Loading indicator -->
              <div v-if="tutorStore.isLoading" class="flex justify-start">
                <div class="bg-surface-100 dark:bg-surface-700 px-4 py-3 rounded-lg">
                  <div class="flex items-center space-x-2">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    <span class="text-surface-600 dark:text-surface-400">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chat Input -->
            <div class="p-6 border-t border-surface-200 dark:border-surface-700">
              <div class="flex items-end space-x-3">
                <!-- Voice mode toggle -->
                <button
                  class="p-2 rounded-lg border border-surface-300 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  :class="tutorStore.isVoiceMode ? 'bg-primary-100 dark:bg-primary-900' : ''"
                  @click="toggleVoiceMode"
                >
                  <MicrophoneIcon class="h-5 w-5 text-surface-600 dark:text-surface-400" />
                </button>

                <!-- Message input -->
                <div class="flex-1">
                  <textarea
                    v-model="messageInput"
                    placeholder="Ask a question about your documents..."
                    class="input resize-none"
                    rows="2"
                    @keydown.enter.prevent="handleSendMessage"
                    @keydown.shift.enter="messageInput += '\n'"
                  ></textarea>
                </div>

                <!-- Send button -->
                <button
                  class="btn-primary"
                  :disabled="!messageInput.trim() || tutorStore.isLoading"
                  @click="handleSendMessage"
                >
                  <PaperAirplaneIcon class="h-4 w-4" />
                </button>
              </div>

              <!-- Voice recording indicator -->
              <div v-if="tutorStore.isRecording" class="mt-3 flex items-center space-x-2 text-warn-600">
                <div class="animate-pulse">
                  <MicrophoneIcon class="h-4 w-4" />
                </div>
                <span class="text-sm">Listening...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Document selector -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
              Select Document
            </h3>
            <div class="space-y-2">
              <button
                v-for="item in libraryStore.items.filter(i => i.status === 'ready')"
                :key="item.id"
                class="w-full text-left p-3 rounded-lg border border-surface-200 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                :class="tutorStore.currentItemId === item.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' : ''"
                @click="tutorStore.setCurrentItem(item.id)"
              >
                <div class="flex items-center space-x-2">
                  <component :is="getItemIcon(item.type)" class="h-4 w-4 text-primary-600" />
                  <span class="text-sm font-medium text-surface-900 dark:text-surface-100">
                    {{ item.title }}
                  </span>
                </div>
                <p class="text-xs text-surface-500 dark:text-surface-400 mt-1">
                  {{ item.type.toUpperCase() }}
                </p>
              </button>
            </div>
          </div>

          <!-- Quick actions -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
              Quick Actions
            </h3>
            <div class="space-y-2">
              <button
                class="w-full btn-outline btn-sm justify-start"
                @click="sendMessage('Summarize the main points')"
              >
                <DocumentTextIcon class="h-4 w-4 mr-2" />
                Summarize
              </button>
              <button
                class="w-full btn-outline btn-sm justify-start"
                @click="sendMessage('Explain the key concepts')"
              >
                <LightBulbIcon class="h-4 w-4 mr-2" />
                Explain Concepts
              </button>
              <button
                class="w-full btn-outline btn-sm justify-start"
                @click="sendMessage('Give me examples')"
              >
                <BeakerIcon class="h-4 w-4 mr-2" />
                Examples
              </button>
              <button
                class="w-full btn-outline btn-sm justify-start"
                @click="tutorStore.clearChat()"
              >
                <TrashIcon class="h-4 w-4 mr-2" />
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Source Viewer Drawer -->
      <SourceViewerDrawer
        :is-open="showSourceDrawer"
        :location="selectedSourceLocation"
        :highlighted-text="selectedSourceText"
        @close="showSourceDrawer = false"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  DocumentTextIcon,
  LightBulbIcon,
  BeakerIcon,
  TrashIcon,
  DocumentIcon,
  PresentationChartLineIcon,
  PlayIcon,
  SpeakerWaveIcon
} from '@heroicons/vue/24/outline'
import type { ContentType, Chunk } from '@/app/types'
import AppLayout from '@/components/AppLayout.vue'
import SourceViewerDrawer from '@/components/SourceViewerDrawer.vue'
import { useTutorStore } from '@/app/store/tutor'
import { useLibraryStore } from '@/app/store/library'
import { getMockData } from '@/mock/seed'

const tutorStore = useTutorStore()
const libraryStore = useLibraryStore()

const messageInput = ref('')
const showSourceDrawer = ref(false)
const selectedSourceLocation = ref<any>(null)
const selectedSourceText = ref('')

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

const handleSendMessage = () => {
  if (!messageInput.value.trim()) return
  
  sendMessage(messageInput.value)
  messageInput.value = ''
}

const sendMessage = (message: string) => {
  tutorStore.sendMessage(message)
}

const toggleVoiceMode = () => {
  if (tutorStore.isVoiceMode) {
    tutorStore.stopVoiceRecording()
  } else {
    tutorStore.startVoiceRecording()
  }
}

const showSourceViewer = (chunk: Chunk) => {
  if (chunk.locations.length > 0) {
    selectedSourceLocation.value = chunk.locations[0]
    selectedSourceText.value = chunk.text
    showSourceDrawer.value = true
  }
}
</script>
