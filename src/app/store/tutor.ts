import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ChatTurn, Chunk } from '@/app/types'

export const useTutorStore = defineStore('tutor', () => {
  const chatHistory = ref<ChatTurn[]>([])
  const isLoading = ref(false)
  const currentItemId = ref<string | null>(null)
  const concisionMode = ref<'brief' | 'detailed'>('detailed')
  const levelMode = ref<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const isVoiceMode = ref(false)
  const isRecording = ref(false)
  const isPlaying = ref(false)

  const currentChat = computed(() => {
    return chatHistory.value.filter(turn => 
      !currentItemId.value || turn.role === 'user' || 
      (turn.role === 'assistant' && turn.citedChunks?.some(chunk => chunk.itemId === currentItemId.value))
    )
  })

  const addUserMessage = (text: string) => {
    const message: ChatTurn = {
      id: Date.now().toString(),
      role: 'user',
      text,
      createdAt: new Date().toISOString()
    }
    chatHistory.value.push(message)
  }

  const addAssistantMessage = (text: string, citedChunks?: Chunk[]) => {
    const message: ChatTurn = {
      id: Date.now().toString(),
      role: 'assistant',
      text,
      citedChunks,
      createdAt: new Date().toISOString()
    }
    chatHistory.value.push(message)
  }

  const sendMessage = async (message: string) => {
    if (!message.trim()) return

    addUserMessage(message)
    isLoading.value = true

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock response with citations
      const mockResponse = generateMockResponse(message, concisionMode.value, levelMode.value)
      const mockCitations = generateMockCitations()
      
      addAssistantMessage(mockResponse, mockCitations)
    } catch (error) {
      console.error('Failed to send message:', error)
      addAssistantMessage('Sorry, I encountered an error. Please try again.')
    } finally {
      isLoading.value = false
    }
  }

  const generateMockResponse = (query: string, concision: 'brief' | 'detailed', level: 'beginner' | 'intermediate' | 'advanced'): string => {
    const responses = {
      brief: {
        beginner: 'Based on the material, here\'s a simple explanation...',
        intermediate: 'The key concept here is...',
        advanced: 'This involves complex interactions between...'
      },
      detailed: {
        beginner: 'Let me break this down step by step. First, we need to understand that...',
        intermediate: 'This is an important concept that builds on several foundational ideas...',
        advanced: 'The theoretical framework underlying this concept involves multiple interconnected systems...'
      }
    }
    
    return responses[concision][level] + ` (responding to: "${query}")`
  }

  const generateMockCitations = (): Chunk[] => {
    return [
      {
        id: '1',
        itemId: currentItemId.value || '1',
        text: 'This is a relevant excerpt from the source material...',
        locations: [{ type: 'pdf', refId: '1', page: 5 }],
        embeddingSim: 0.85,
        topic: 'Introduction'
      },
      {
        id: '2',
        itemId: currentItemId.value || '1',
        text: 'Another relevant passage that supports the answer...',
        locations: [{ type: 'pdf', refId: '1', page: 12 }],
        embeddingSim: 0.78,
        topic: 'Core Concepts'
      }
    ]
  }

  const startVoiceRecording = () => {
    isRecording.value = true
    isVoiceMode.value = true
    
    // Simulate recording for 3-5 seconds
    setTimeout(() => {
      isRecording.value = false
      // Mock transcription
      const mockTranscription = 'Can you explain the main concepts from chapter 3?'
      addUserMessage(mockTranscription)
    }, 3000)
  }

  const stopVoiceRecording = () => {
    isRecording.value = false
  }

  const playLastResponse = () => {
    const lastAssistantMessage = [...chatHistory.value]
      .reverse()
      .find(turn => turn.role === 'assistant')
    
    if (lastAssistantMessage) {
      isPlaying.value = true
      // Simulate TTS playback
      setTimeout(() => {
        isPlaying.value = false
      }, 2000)
    }
  }

  const setCurrentItem = (itemId: string | null) => {
    currentItemId.value = itemId
  }

  const setConcisionMode = (mode: 'brief' | 'detailed') => {
    concisionMode.value = mode
  }

  const setLevelMode = (mode: 'beginner' | 'intermediate' | 'advanced') => {
    levelMode.value = mode
  }

  const clearChat = () => {
    chatHistory.value = []
  }

  const getFollowUpSuggestions = (): string[] => {
    return [
      'Can you explain this in simpler terms?',
      'What are the practical applications?',
      'How does this relate to what we learned earlier?',
      'Can you give me an example?'
    ]
  }

  return {
    chatHistory,
    isLoading,
    currentItemId,
    concisionMode,
    levelMode,
    isVoiceMode,
    isRecording,
    isPlaying,
    currentChat,
    sendMessage,
    startVoiceRecording,
    stopVoiceRecording,
    playLastResponse,
    setCurrentItem,
    setConcisionMode,
    setLevelMode,
    clearChat,
    getFollowUpSuggestions
  }
})
