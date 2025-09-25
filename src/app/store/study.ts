import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Summary, MCQ, Flashcard, QuizSession, QuizSubmission } from '@/app/types'

export const useStudyStore = defineStore('study', () => {
  const summaries = ref<Summary[]>([])
  const mcqs = ref<MCQ[]>([])
  const flashcards = ref<Flashcard[]>([])
  const currentQuiz = ref<QuizSession | null>(null)
  const currentFlashcardIndex = ref(0)
  const isLoading = ref(false)

  const currentItemSummaries = computed(() => {
    return summaries.value.filter(summary => 
      !currentQuiz.value || summary.itemId === currentQuiz.value.itemId
    )
  })

  const currentItemMCQs = computed(() => {
    return mcqs.value.filter(mcq => 
      !currentQuiz.value || mcq.itemId === currentQuiz.value.itemId
    )
  })

  const currentItemFlashcards = computed(() => {
    return flashcards.value.filter(card => 
      !currentQuiz.value || card.itemId === currentQuiz.value.itemId
    )
  })

  const dueFlashcards = computed(() => {
    const now = new Date()
    return flashcards.value.filter(card => 
      new Date(card.nextReviewAt) <= now
    )
  })

  const getSummary = async (itemId: string): Promise<Summary | null> => {
    isLoading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      return summaries.value.find(s => s.itemId === itemId) || null
    } finally {
      isLoading.value = false
    }
  }

  const getMCQs = async (itemId: string, filters?: {
    difficulty?: 'easy' | 'medium' | 'hard'
    tags?: string[]
    limit?: number
  }): Promise<MCQ[]> => {
    isLoading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      
      let filtered = mcqs.value.filter(mcq => mcq.itemId === itemId)
      
      if (filters?.difficulty) {
        filtered = filtered.filter(mcq => mcq.difficulty === filters.difficulty)
      }
      
      if (filters?.tags && filters.tags.length > 0) {
        filtered = filtered.filter(mcq => 
          filters.tags!.some(tag => mcq.tags.includes(tag))
        )
      }
      
      if (filters?.limit) {
        filtered = filtered.slice(0, filters.limit)
      }
      
      return filtered
    } finally {
      isLoading.value = false
    }
  }

  const getFlashcards = async (itemId: string): Promise<Flashcard[]> => {
    isLoading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      return flashcards.value.filter(card => card.itemId === itemId)
    } finally {
      isLoading.value = false
    }
  }

  const startQuiz = async (itemId: string, options: {
    difficulty?: 'easy' | 'medium' | 'hard'
    tags?: string[]
    questionCount: number
  }): Promise<QuizSession> => {
    const questions = await getMCQs(itemId, {
      difficulty: options.difficulty,
      tags: options.tags,
      limit: options.questionCount
    })

    const session: QuizSession = {
      id: Date.now().toString(),
      itemId,
      questions,
      submissions: [],
      startedAt: new Date().toISOString()
    }

    currentQuiz.value = session
    return session
  }

  const submitQuizAnswer = (questionId: string, selectedIndex: number): boolean => {
    if (!currentQuiz.value) return false

    const question = currentQuiz.value.questions.find(q => q.id === questionId)
    if (!question) return false

    const isCorrect = selectedIndex === question.correctIndex
    const submission: QuizSubmission = {
      questionId,
      selectedIndex,
      isCorrect,
      timeSpent: 0 // Mock time tracking
    }

    currentQuiz.value.submissions.push(submission)
    return isCorrect
  }

  const completeQuiz = (): number => {
    if (!currentQuiz.value) return 0

    const correctAnswers = currentQuiz.value.submissions.filter(s => s.isCorrect).length
    const totalQuestions = currentQuiz.value.questions.length
    const score = Math.round((correctAnswers / totalQuestions) * 100)

    currentQuiz.value.completedAt = new Date().toISOString()
    currentQuiz.value.score = score

    return score
  }

  const getQuizResults = () => {
    if (!currentQuiz.value) return null

    const correctAnswers = currentQuiz.value.submissions.filter(s => s.isCorrect).length
    const totalQuestions = currentQuiz.value.questions.length
    const score = Math.round((correctAnswers / totalQuestions) * 100)

    // Get weak tags from incorrect answers
    const incorrectSubmissions = currentQuiz.value.submissions.filter(s => !s.isCorrect)
    const weakTags = new Set<string>()
    
    incorrectSubmissions.forEach(submission => {
      const question = currentQuiz.value!.questions.find(q => q.id === submission.questionId)
      if (question) {
        question.tags.forEach(tag => weakTags.add(tag))
      }
    })

    return {
      score,
      totalQuestions,
      correctAnswers,
      weakTags: Array.from(weakTags),
      timeSpent: Date.now() - new Date(currentQuiz.value.startedAt).getTime()
    }
  }

  const reviewFlashcard = (cardId: string, rating: 'again' | 'hard' | 'good' | 'easy') => {
    const card = flashcards.value.find(c => c.id === cardId)
    if (!card) return

    // Simplified SM-2 algorithm
    const easeMap = {
      again: Math.max(1.3, card.ease - 0.2),
      hard: Math.max(1.3, card.ease - 0.15),
      good: card.ease,
      easy: card.ease + 0.15
    }

    const intervalMap = {
      again: 1,
      hard: Math.max(1, Math.round(card.ease * 0.5)),
      good: Math.max(1, Math.round(card.ease)),
      easy: Math.max(1, Math.round(card.ease * 1.3))
    }

    card.ease = easeMap[rating]
    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + intervalMap[rating])
    card.nextReviewAt = nextReview.toISOString()

    // Move to next card
    currentFlashcardIndex.value = (currentFlashcardIndex.value + 1) % dueFlashcards.value.length
  }

  const getCurrentFlashcard = (): Flashcard | null => {
    const dueCards = dueFlashcards.value
    if (dueCards.length === 0) return null
    return dueCards[currentFlashcardIndex.value] || null
  }

  const generateSummary = async (itemId: string): Promise<Summary> => {
    isLoading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const summary: Summary = {
        id: Date.now().toString(),
        itemId,
        bullets: [
          'Key concept 1: Understanding the fundamental principles',
          'Key concept 2: Application in real-world scenarios',
          'Key concept 3: Advanced techniques and methodologies'
        ],
        tldr: 'This document covers the essential concepts and their practical applications.',
        syllabusOutline: [
          'Chapter 1: Introduction',
          'Chapter 2: Core Concepts',
          'Chapter 3: Advanced Topics',
          'Chapter 4: Practical Applications'
        ],
        sources: [{ type: 'pdf', refId: itemId, page: 1 }]
      }

      summaries.value.push(summary)
      return summary
    } finally {
      isLoading.value = false
    }
  }

  const generateQuiz = async (itemId: string, questionCount: number): Promise<MCQ[]> => {
    isLoading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newMCQs: MCQ[] = []
      for (let i = 0; i < questionCount; i++) {
        const mcq: MCQ = {
          id: `mcq-${Date.now()}-${i}`,
          itemId,
          question: `Sample question ${i + 1} about the content?`,
          options: [
            'Option A: First possible answer',
            'Option B: Second possible answer',
            'Option C: Third possible answer',
            'Option D: Fourth possible answer'
          ],
          correctIndex: i % 4,
          explanation: `This is the correct answer because...`,
          source: { type: 'pdf', refId: itemId, page: Math.floor(Math.random() * 10) + 1 },
          difficulty: ['easy', 'medium', 'hard'][i % 3] as 'easy' | 'medium' | 'hard',
          tags: (['concept', 'application', 'theory'][i % 3] ? [['concept', 'application', 'theory'][i % 3]] : ['general']) as string[]
        }
        newMCQs.push(mcq)
      }

      mcqs.value.push(...newMCQs)
      return newMCQs
    } finally {
      isLoading.value = false
    }
  }

  const generateFlashcards = async (itemId: string, cardCount: number): Promise<Flashcard[]> => {
    isLoading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      const newCards: Flashcard[] = []
      for (let i = 0; i < cardCount; i++) {
        const card: Flashcard = {
          id: `card-${Date.now()}-${i}`,
          itemId,
          front: `What is the definition of concept ${i + 1}?`,
          back: `Concept ${i + 1} is defined as...`,
          source: { type: 'pdf', refId: itemId, page: Math.floor(Math.random() * 10) + 1 },
          ease: 2.5,
          nextReviewAt: new Date().toISOString()
        }
        newCards.push(card)
      }

      flashcards.value.push(...newCards)
      return newCards
    } finally {
      isLoading.value = false
    }
  }

  return {
    summaries,
    mcqs,
    flashcards,
    currentQuiz,
    currentFlashcardIndex,
    isLoading,
    currentItemSummaries,
    currentItemMCQs,
    currentItemFlashcards,
    dueFlashcards,
    getSummary,
    getMCQs,
    getFlashcards,
    startQuiz,
    submitQuizAnswer,
    completeQuiz,
    getQuizResults,
    reviewFlashcard,
    getCurrentFlashcard,
    generateSummary,
    generateQuiz,
    generateFlashcards
  }
})
