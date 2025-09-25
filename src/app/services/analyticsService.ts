import type { SessionMetrics, Plan } from '@/app/types'

export class AnalyticsService {
  async getMetrics(itemId?: string): Promise<SessionMetrics> {
    await this.delay(600)
    
    if (itemId) {
      return this.mockItemMetrics.find(m => m.itemId === itemId) || this.getDefaultMetrics()
    }
    
    return this.mockGlobalMetrics
  }

  async getTrends(days: number = 14): Promise<{
    studyTime: Array<{ date: string; minutes: number }>
    quizScores: Array<{ date: string; avgScore: number }>
    flashcardReviews: Array<{ date: string; reviews: number }>
  }> {
    await this.delay(800)
    
    const trends = {
      studyTime: [] as Array<{ date: string; minutes: number }>,
      quizScores: [] as Array<{ date: string; avgScore: number }>,
      flashcardReviews: [] as Array<{ date: string; reviews: number }>
    }
    
    const now = new Date()
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      trends.studyTime.push({
        date: dateStr,
        minutes: Math.floor(Math.random() * 120) + 10
      })
      
      trends.quizScores.push({
        date: dateStr,
        avgScore: Math.floor(Math.random() * 40) + 60
      })
      
      trends.flashcardReviews.push({
        date: dateStr,
        reviews: Math.floor(Math.random() * 20) + 5
      })
    }
    
    return trends
  }

  async getMasteryHeatmap(): Promise<Record<string, number>> {
    await this.delay(400)
    
    return {
      'machine-learning': 75,
      'react': 68,
      'database': 82,
      'python': 71,
      'javascript': 85,
      'ai': 73,
      'statistics': 66,
      'frontend': 79,
      'sql': 77,
      'design': 70
    }
  }

  async getWeakestTags(limit: number = 3): Promise<Array<{ tag: string; mastery: number }>> {
    await this.delay(300)
    
    const heatmap = await this.getMasteryHeatmap()
    return Object.entries(heatmap)
      .sort(([, a], [, b]) => a - b)
      .slice(0, limit)
      .map(([tag, mastery]) => ({ tag, mastery }))
  }

  async updateMetrics(itemId: string | undefined, updates: Partial<SessionMetrics>): Promise<void> {
    await this.delay(200)
    
    if (itemId) {
      const existingIndex = this.mockItemMetrics.findIndex(m => m.itemId === itemId)
      if (existingIndex !== -1) {
        this.mockItemMetrics[existingIndex] = { ...this.mockItemMetrics[existingIndex], ...updates }
      } else {
        this.mockItemMetrics.push({ ...this.getDefaultMetrics(), itemId, ...updates })
      }
    } else {
      this.mockGlobalMetrics = { ...this.mockGlobalMetrics, ...updates }
    }
  }

  private getDefaultMetrics(): SessionMetrics {
    return {
      totalStudyMin: 0,
      quizzesTaken: 0,
      avgScore: 0,
      weakTags: [],
      masteryByTag: {},
      streakDays: 0
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private mockGlobalMetrics: SessionMetrics = {
    totalStudyMin: 450,
    quizzesTaken: 12,
    avgScore: 78,
    weakTags: ['statistics', 'advanced-algorithms'],
    masteryByTag: {
      'machine-learning': 75,
      'react': 68,
      'database': 82,
      'python': 71,
      'javascript': 85
    },
    streakDays: 7
  }

  private mockItemMetrics: SessionMetrics[] = [
    {
      itemId: '1',
      totalStudyMin: 120,
      quizzesTaken: 3,
      avgScore: 82,
      weakTags: ['neural-networks'],
      masteryByTag: {
        'machine-learning': 80,
        'ai': 75,
        'statistics': 70
      },
      streakDays: 5
    },
    {
      itemId: '2',
      totalStudyMin: 90,
      quizzesTaken: 2,
      avgScore: 85,
      weakTags: ['hooks'],
      masteryByTag: {
        'react': 85,
        'javascript': 90,
        'frontend': 80
      },
      streakDays: 3
    }
  ]
}

export class BillingService {
  async getPlans(): Promise<Plan[]> {
    await this.delay(500)
    
    return [
      {
        id: 'free',
        name: 'Free',
        priceMonthly: 0,
        features: [
          'Up to 3 documents',
          '50 chat messages per day',
          'Basic quizzes (10 questions max)',
          'Standard flashcards',
          'Basic analytics'
        ],
        limits: {
          documents: 3,
          chatMessages: 50,
          quizQuestions: 10,
          flashcards: 100
        }
      },
      {
        id: 'pro',
        name: 'Pro',
        priceMonthly: 19,
        features: [
          'Unlimited documents',
          'Unlimited chat messages',
          'Advanced quizzes (unlimited questions)',
          'Spaced repetition flashcards',
          'Advanced analytics',
          'Voice mode',
          'Export capabilities',
          'Priority support'
        ],
        limits: {
          documents: 'unlimited',
          chatMessages: 'unlimited',
          quizQuestions: 'unlimited',
          flashcards: 'unlimited'
        }
      },
      {
        id: 'team',
        name: 'Team',
        priceMonthly: 49,
        features: [
          'Everything in Pro',
          'Team collaboration',
          'Shared libraries',
          'Admin dashboard',
          'Usage analytics',
          'Custom integrations',
          'Dedicated support'
        ],
        limits: {
          documents: 'unlimited',
          chatMessages: 'unlimited',
          quizQuestions: 'unlimited',
          flashcards: 'unlimited',
          teamMembers: 10
        }
      }
    ]
  }

  async upgradePlan(planId: Plan['id']): Promise<boolean> {
    await this.delay(1000)
    // Mock successful upgrade
    return true
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
