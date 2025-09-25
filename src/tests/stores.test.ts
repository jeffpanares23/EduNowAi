import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/app/store/auth'
import { useLibraryStore } from '@/app/store/library'
import { useStudyStore } from '@/app/store/study'
import { useAnalyticsStore } from '@/app/store/analytics'
import type { IngestedItem, MCQ, Flashcard, SessionMetrics, ContentType, QuizSession } from '@/app/types'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with no user', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('should sign in successfully', async () => {
    const store = useAuthStore()
    const result = await store.signIn('test@example.com', 'password')
    
    expect(result).toBe(true)
    expect(store.user).toBeTruthy()
    expect(store.user?.email).toBe('test@example.com')
    expect(store.isAuthenticated).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  it('should sign up successfully', async () => {
    const store = useAuthStore()
    const result = await store.signUp('John Doe', 'john@example.com', 'password')
    
    expect(result).toBe(true)
    expect(store.user).toBeTruthy()
    expect(store.user?.name).toBe('John Doe')
    expect(store.user?.email).toBe('john@example.com')
    expect(store.isAuthenticated).toBe(true)
  })

  it('should sign out successfully', () => {
    const store = useAuthStore()
    store.user = { id: '1', name: 'Test', email: 'test@example.com', planId: 'free' }
    
    store.signOut()
    
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
  })

  it('should update user plan', () => {
    const store = useAuthStore()
    store.user = { id: '1', name: 'Test', email: 'test@example.com', planId: 'free' }
    
    store.updatePlan('pro')
    
    expect(store.user?.planId).toBe('pro')
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })
})

describe('Library Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty items', () => {
    const store = useLibraryStore()
    expect(store.items).toEqual([])
    expect(store.filteredItems).toEqual([])
  })

  it('should add item', () => {
    const store = useLibraryStore()
    const item: IngestedItem = {
      id: '1',
      title: 'Test Document',
      type: 'pdf' as ContentType,
      createdAt: new Date().toISOString(),
      tags: ['test'],
      previewText: 'Test content',
      status: 'ready'
    }
    
    store.addItem(item)
    
    expect(store.items).toHaveLength(1)
    expect(store.items[0]).toEqual(item)
  })

  it('should filter items by search query', () => {
    const store = useLibraryStore()
    const items: IngestedItem[] = [
      {
        id: '1',
        title: 'Machine Learning Guide',
        type: 'pdf' as ContentType,
        createdAt: new Date().toISOString(),
        tags: ['ml'],
        previewText: 'Learn about machine learning',
        status: 'ready'
      },
      {
        id: '2',
        title: 'React Tutorial',
        type: 'youtube',
        createdAt: new Date().toISOString(),
        tags: ['react'],
        previewText: 'Learn React basics',
        status: 'ready'
      }
    ]
    
    items.forEach(item => store.addItem(item))
    store.setSearchQuery('machine learning')
    
    expect(store.filteredItems).toHaveLength(1)
    expect(store.filteredItems[0].title).toBe('Machine Learning Guide')
  })

  it('should filter items by type', () => {
    const store = useLibraryStore()
    const items: IngestedItem[] = [
      {
        id: '1',
        title: 'PDF Document',
        type: 'pdf' as ContentType,
        createdAt: new Date().toISOString(),
        tags: ['test'],
        previewText: 'PDF content',
        status: 'ready'
      },
      {
        id: '2',
        title: 'Video Tutorial',
        type: 'youtube',
        createdAt: new Date().toISOString(),
        tags: ['video'],
        previewText: 'Video content',
        status: 'ready'
      }
    ]
    
    items.forEach(item => store.addItem(item))
    store.setSelectedType('pdf')
    
    expect(store.filteredItems).toHaveLength(1)
    expect(store.filteredItems[0].type).toBe('pdf')
  })

  it('should update item tags', () => {
    const store = useLibraryStore()
    const item: IngestedItem = {
      id: '1',
      title: 'Test Document',
      type: 'pdf' as ContentType,
      createdAt: new Date().toISOString(),
      tags: ['old'],
      previewText: 'Test content',
      status: 'ready'
    }
    
    store.addItem(item)
    store.updateItemTags('1', ['new', 'updated'])
    
    expect(store.items[0].tags).toEqual(['new', 'updated'])
  })

  it('should delete item', () => {
    const store = useLibraryStore()
    const item: IngestedItem = {
      id: '1',
      title: 'Test Document',
      type: 'pdf' as ContentType,
      createdAt: new Date().toISOString(),
      tags: ['test'],
      previewText: 'Test content',
      status: 'ready'
    }
    
    store.addItem(item)
    expect(store.items).toHaveLength(1)
    
    store.deleteItem('1')
    expect(store.items).toHaveLength(0)
  })
})

describe('Study Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty data', () => {
    const store = useStudyStore()
    expect(store.summaries).toEqual([])
    expect(store.mcqs).toEqual([])
    expect(store.flashcards).toEqual([])
  })

  it('should start quiz with questions', async () => {
    const store = useStudyStore()
    const mockMCQs: MCQ[] = [
      {
        id: '1',
        itemId: 'doc1',
        question: 'What is machine learning?',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        explanation: 'ML is...',
        source: { type: 'pdf' as ContentType, refId: 'doc1', page: 1 },
        difficulty: 'easy',
        tags: ['ml']
      }
    ]
    
    store.mcqs.push(...mockMCQs)
    const session = await store.startQuiz('doc1', { questionCount: 1 })
    
    expect(session.questions).toHaveLength(1)
    expect(session.itemId).toBe('doc1')
    expect(session.submissions).toEqual([])
  })

  it('should submit quiz answer correctly', () => {
    const store = useStudyStore()
    const session: QuizSession = {
      id: '1',
      itemId: 'doc1',
      questions: [{
        id: 'q1',
        itemId: 'doc1',
        question: 'Test question?',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 1,
        explanation: 'Explanation',
        source: { type: 'pdf' as ContentType, refId: 'doc1', page: 1 },
        difficulty: 'easy' as const,
        tags: ['test']
      }],
      submissions: [],
      startedAt: new Date().toISOString()
    }
    
    store.currentQuiz = session
    
    const result = store.submitQuizAnswer('q1', 1)
    
    expect(result).toBe(true)
    expect(session.submissions).toHaveLength(1)
    expect(session.submissions[0].isCorrect).toBe(true)
  })

  it('should complete quiz and calculate score', () => {
    const store = useStudyStore()
    const session: QuizSession = {
      id: '1',
      itemId: 'doc1',
      questions: [
        { id: 'q1', itemId: 'doc1', question: 'Q1?', options: ['A', 'B'], correctIndex: 0, explanation: '', source: { type: 'pdf' as ContentType, refId: 'doc1' }, difficulty: 'easy' as const, tags: [] },
        { id: 'q2', itemId: 'doc1', question: 'Q2?', options: ['A', 'B'], correctIndex: 1, explanation: '', source: { type: 'pdf' as ContentType, refId: 'doc1' }, difficulty: 'easy' as const, tags: [] }
      ],
      submissions: [
        { questionId: 'q1', selectedIndex: 0, isCorrect: true, timeSpent: 10 },
        { questionId: 'q2', selectedIndex: 0, isCorrect: false, timeSpent: 15 }
      ],
      startedAt: new Date().toISOString()
    }
    
    store.currentQuiz = session
    
    const score = store.completeQuiz()
    
    expect(score).toBe(50) // 1 out of 2 correct
    expect(session.score).toBe(50)
    expect(session.completedAt).toBeTruthy()
  })

  it('should review flashcard and update ease', () => {
    const store = useStudyStore()
    const card: Flashcard = {
      id: '1',
      itemId: 'doc1',
      front: 'What is ML?',
      back: 'Machine Learning',
      source: { type: 'pdf' as ContentType, refId: 'doc1', page: 1 },
      ease: 2.5,
      nextReviewAt: new Date().toISOString()
    }
    
    store.flashcards.push(card)
    const originalEase = card.ease
    const originalNextReview = card.nextReviewAt
    
    store.reviewFlashcard('1', 'good')
    
    expect(card.ease).toBe(originalEase) // Should stay the same for 'good'
    expect(card.nextReviewAt).not.toBe(originalNextReview)
  })

  it('should generate summary', async () => {
    const store = useStudyStore()
    const summary = await store.generateSummary('doc1')
    
    expect(summary).toBeTruthy()
    expect(summary.itemId).toBe('doc1')
    expect(summary.bullets).toHaveLength(4)
    expect(summary.tldr).toBeTruthy()
    expect(summary.syllabusOutline).toHaveLength(5)
    expect(store.summaries).toContain(summary)
  })
})

describe('Analytics Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty metrics', () => {
    const store = useAnalyticsStore()
    expect(store.metrics).toEqual([])
  })

  it('should record quiz completion', () => {
    const store = useAnalyticsStore()
    store.recordQuizCompletion('doc1', 85, ['ml', 'ai'])
    
    const metrics = store.getItemMetrics('doc1')
    expect(metrics).toBeTruthy()
    expect(metrics?.quizzesTaken).toBe(1)
    expect(metrics?.avgScore).toBe(85)
    expect(metrics?.masteryByTag.ml).toBeGreaterThan(0)
    expect(metrics?.masteryByTag.ai).toBeGreaterThan(0)
  })

  it('should record study time', () => {
    const store = useAnalyticsStore()
    store.recordStudyTime('doc1', 30)
    
    const metrics = store.getItemMetrics('doc1')
    expect(metrics?.totalStudyMin).toBe(30)
  })

  it('should record flashcard review', () => {
    const store = useAnalyticsStore()
    store.recordFlashcardReview('doc1', 'ml', true)
    
    const metrics = store.getItemMetrics('doc1')
    expect(metrics?.masteryByTag.ml).toBe(2)
  })

  it('should aggregate global metrics', () => {
    const store = useAnalyticsStore()
    
    // Add item-specific metrics
    store.updateMetrics('doc1', {
      totalStudyMin: 60,
      quizzesTaken: 2,
      avgScore: 80,
      masteryByTag: { ml: 70, ai: 60 },
      streakDays: 5
    })
    
    store.updateMetrics('doc2', {
      totalStudyMin: 30,
      quizzesTaken: 1,
      avgScore: 90,
      masteryByTag: { react: 80 },
      streakDays: 3
    })
    
    const global = store.globalMetrics
    
    expect(global.totalStudyMin).toBe(90)
    expect(global.quizzesTaken).toBe(3)
    expect(global.streakDays).toBe(5)
    expect(global.masteryByTag.ml).toBe(70)
    expect(global.masteryByTag.react).toBe(80)
  })

  it('should get weakest tags', async () => {
    const store = useAnalyticsStore()
    
    // Mock mastery heatmap
    store.updateMetrics('doc1', {
      masteryByTag: { ml: 30, ai: 50, react: 80 }
    })
    
    const weakest = await store.getWeakestTags(2)
    
    expect(weakest).toHaveLength(2)
    expect(weakest[0].tag).toBe('ml') // Lowest mastery
    expect(weakest[1].tag).toBe('ai')
  })
})

