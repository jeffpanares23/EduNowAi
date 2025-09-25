import type { Summary, MCQ, Flashcard, QuizSubmission } from '@/app/types'

export class StudyService {
  async getSummary(itemId: string): Promise<Summary | null> {
    await this.delay(800)
    return this.mockSummaries.find(s => s.itemId === itemId) || null
  }

  async generateSummary(itemId: string): Promise<Summary> {
    await this.delay(2000)
    
    const summary: Summary = {
      id: `summary-${Date.now()}`,
      itemId,
      bullets: [
        'Key concept 1: Understanding the fundamental principles and their applications',
        'Key concept 2: Practical implementation strategies and best practices',
        'Key concept 3: Advanced techniques and optimization methods',
        'Key concept 4: Common pitfalls and how to avoid them'
      ],
      tldr: 'This document provides a comprehensive overview of the subject matter, covering both theoretical foundations and practical applications.',
      syllabusOutline: [
        'Chapter 1: Introduction and Overview',
        'Chapter 2: Core Concepts and Fundamentals',
        'Chapter 3: Advanced Topics and Techniques',
        'Chapter 4: Practical Applications and Case Studies',
        'Chapter 5: Best Practices and Recommendations'
      ],
      sources: [{ type: 'pdf', refId: itemId, page: 1 }]
    }

    this.mockSummaries.push(summary)
    return summary
  }

  async getMCQs(itemId: string, filters?: {
    difficulty?: 'easy' | 'medium' | 'hard'
    tags?: string[]
    limit?: number
  }): Promise<MCQ[]> {
    await this.delay(600)
    
    let filtered = this.mockMCQs.filter(mcq => mcq.itemId === itemId)
    
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
  }

  async generateQuiz(itemId: string, questionCount: number): Promise<MCQ[]> {
    await this.delay(1500)
    
    const newMCQs: MCQ[] = []
    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard']
    const topics = ['fundamentals', 'applications', 'advanced', 'best-practices']
    
    for (let i = 0; i < questionCount; i++) {
      const mcq: MCQ = {
        id: `mcq-${Date.now()}-${i}`,
        itemId,
        question: `What is the primary purpose of concept ${i + 1} in this context?`,
        options: [
          `Option A: Primary function ${i + 1}`,
          `Option B: Secondary application ${i + 1}`,
          `Option C: Alternative approach ${i + 1}`,
          `Option D: Complementary method ${i + 1}`
        ],
        correctIndex: i % 4,
        explanation: `The correct answer is Option ${String.fromCharCode(65 + (i % 4))} because it best represents the core concept discussed in the material.`,
        source: { 
          type: 'pdf', 
          refId: itemId, 
          page: Math.floor(Math.random() * 10) + 1 
        },
        difficulty: difficulties[i % 3],
        tags: [topics[i % 4]]
      }
      newMCQs.push(mcq)
    }

    this.mockMCQs.push(...newMCQs)
    return newMCQs
  }

  async gradeMCQ(questionId: string, selectedIndex: number): Promise<{
    isCorrect: boolean
    explanation: string
    correctIndex: number
  }> {
    await this.delay(300)
    
    const question = this.mockMCQs.find(q => q.id === questionId)
    if (!question) {
      throw new Error('Question not found')
    }
    
    return {
      isCorrect: selectedIndex === question.correctIndex,
      explanation: question.explanation,
      correctIndex: question.correctIndex
    }
  }

  async getFlashcards(itemId: string): Promise<Flashcard[]> {
    await this.delay(500)
    return this.mockFlashcards.filter(card => card.itemId === itemId)
  }

  async generateFlashcards(itemId: string, cardCount: number): Promise<Flashcard[]> {
    await this.delay(1200)
    
    const newCards: Flashcard[] = []
    const topics = ['definition', 'application', 'example', 'principle']
    
    for (let i = 0; i < cardCount; i++) {
      const card: Flashcard = {
        id: `card-${Date.now()}-${i}`,
        itemId,
        front: `What is the definition of ${topics[i % 4]} ${i + 1}?`,
        back: `${topics[i % 4].charAt(0).toUpperCase() + topics[i % 4].slice(1)} ${i + 1} is defined as a fundamental concept that...`,
        source: { 
          type: 'pdf', 
          refId: itemId, 
          page: Math.floor(Math.random() * 10) + 1 
        },
        ease: 2.5,
        nextReviewAt: new Date().toISOString()
      }
      newCards.push(card)
    }

    this.mockFlashcards.push(...newCards)
    return newCards
  }

  async reviewFlashcard(cardId: string, rating: 'again' | 'hard' | 'good' | 'easy'): Promise<void> {
    await this.delay(200)
    
    const card = this.mockFlashcards.find(c => c.id === cardId)
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
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private mockSummaries: Summary[] = [
    {
      id: 'summary-1',
      itemId: '1',
      bullets: [
        'Machine learning is a subset of AI that enables computers to learn without explicit programming',
        'Three main types: supervised, unsupervised, and reinforcement learning',
        'Key applications include image recognition, natural language processing, and recommendation systems'
      ],
      tldr: 'Machine learning enables computers to learn patterns from data and make predictions or decisions.',
      syllabusOutline: [
        'Introduction to Machine Learning',
        'Types of Learning Algorithms',
        'Data Preprocessing',
        'Model Training and Evaluation',
        'Real-world Applications'
      ],
      sources: [{ type: 'pdf', refId: '1', page: 1 }]
    }
  ]

  private mockMCQs: MCQ[] = [
    {
      id: 'mcq-1',
      itemId: '1',
      question: 'What is the primary goal of supervised learning?',
      options: [
        'To find hidden patterns in unlabeled data',
        'To learn from labeled examples to make predictions',
        'To optimize actions through trial and error',
        'To reduce the dimensionality of data'
      ],
      correctIndex: 1,
      explanation: 'Supervised learning uses labeled training data to learn a mapping from inputs to outputs, enabling predictions on new, unseen data.',
      source: { type: 'pdf', refId: '1', page: 5 },
      difficulty: 'easy',
      tags: ['fundamentals']
    },
    {
      id: 'mcq-2',
      itemId: '2',
      question: 'What does the useState hook return?',
      options: [
        'Only the current state value',
        'Only a function to update state',
        'An array with the current state and a setter function',
        'A promise that resolves to the state'
      ],
      correctIndex: 2,
      explanation: 'useState returns an array with two elements: the current state value and a function to update that state.',
      source: { type: 'youtube', refId: '2', timestampSec: 600 },
      difficulty: 'medium',
      tags: ['hooks']
    }
  ]

  private mockFlashcards: Flashcard[] = [
    {
      id: 'card-1',
      itemId: '1',
      front: 'What is machine learning?',
      back: 'Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed.',
      source: { type: 'pdf', refId: '1', page: 1 },
      ease: 2.5,
      nextReviewAt: new Date().toISOString()
    },
    {
      id: 'card-2',
      itemId: '2',
      front: 'What is a React component?',
      back: 'A React component is a reusable piece of UI that can accept props and maintain its own state. Components are the building blocks of React applications.',
      source: { type: 'youtube', refId: '2', timestampSec: 300 },
      ease: 2.5,
      nextReviewAt: new Date().toISOString()
    }
  ]
}
