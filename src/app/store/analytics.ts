import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SessionMetrics, Plan } from '@/app/types'

export const useAnalyticsStore = defineStore('analytics', () => {
  const metrics = ref<SessionMetrics[]>([])
  const isLoading = ref(false)

  const globalMetrics = computed(() => {
    const global = metrics.value.find(m => !m.itemId)
    if (global) return global

    // Aggregate from all item-specific metrics
    const aggregated: SessionMetrics = {
      totalStudyMin: 0,
      quizzesTaken: 0,
      avgScore: 0,
      weakTags: [],
      masteryByTag: {},
      streakDays: 0
    }

    metrics.value.forEach(metric => {
      aggregated.totalStudyMin += metric.totalStudyMin
      aggregated.quizzesTaken += metric.quizzesTaken
      aggregated.streakDays = Math.max(aggregated.streakDays, metric.streakDays)
      
      // Aggregate scores
      if (metric.avgScore > 0) {
        aggregated.avgScore = (aggregated.avgScore + metric.avgScore) / 2
      }
      
      // Merge weak tags
      metric.weakTags.forEach(tag => {
        if (!aggregated.weakTags.includes(tag)) {
          aggregated.weakTags.push(tag)
        }
      })
      
      // Merge mastery by tag
      Object.entries(metric.masteryByTag).forEach(([tag, mastery]) => {
        aggregated.masteryByTag[tag] = Math.max(
          aggregated.masteryByTag[tag] || 0,
          mastery
        )
      })
    })

    return aggregated
  })

  const getItemMetrics = (itemId: string) => {
    return metrics.value.find(m => m.itemId === itemId)
  }

  const updateMetrics = (itemId: string | undefined, updates: Partial<SessionMetrics>) => {
    const existingIndex = metrics.value.findIndex(m => m.itemId === itemId)
    
    if (existingIndex !== -1) {
      metrics.value[existingIndex] = { ...metrics.value[existingIndex], ...updates }
    } else {
      const newMetrics: SessionMetrics = {
        itemId,
        totalStudyMin: 0,
        quizzesTaken: 0,
        avgScore: 0,
        weakTags: [],
        masteryByTag: {},
        streakDays: 0,
        ...updates
      }
      metrics.value.push(newMetrics)
    }
  }

  const recordQuizCompletion = (itemId: string | undefined, score: number, tags: string[]) => {
    const currentMetrics = metrics.value.find(m => m.itemId === itemId)
    
    if (currentMetrics) {
      currentMetrics.quizzesTaken += 1
      currentMetrics.avgScore = (currentMetrics.avgScore + score) / 2
      
      // Update mastery for answered tags
      tags.forEach(tag => {
        const currentMastery = currentMetrics.masteryByTag[tag] || 0
        const masteryIncrease = Math.min(10, score / 10) // Increase based on score
        currentMetrics.masteryByTag[tag] = Math.min(100, currentMastery + masteryIncrease)
      })
    } else {
      const masteryByTag: Record<string, number> = {}
      tags.forEach(tag => {
        masteryByTag[tag] = Math.min(100, score / 10)
      })
      
      updateMetrics(itemId, {
        quizzesTaken: 1,
        avgScore: score,
        masteryByTag
      })
    }
  }

  const recordStudyTime = (itemId: string | undefined, minutes: number) => {
    const currentMetrics = metrics.value.find(m => m.itemId === itemId)
    
    if (currentMetrics) {
      currentMetrics.totalStudyMin += minutes
    } else {
      updateMetrics(itemId, {
        totalStudyMin: minutes
      })
    }
  }

  const recordFlashcardReview = (itemId: string | undefined, tag: string, correct: boolean) => {
    const currentMetrics = metrics.value.find(m => m.itemId === itemId)
    
    if (currentMetrics) {
      const currentMastery = currentMetrics.masteryByTag[tag] || 0
      const masteryChange = correct ? 2 : -1
      currentMetrics.masteryByTag[tag] = Math.max(0, Math.min(100, currentMastery + masteryChange))
    } else {
      const masteryByTag: Record<string, number> = {}
      masteryByTag[tag] = correct ? 2 : 0
      
      updateMetrics(itemId, {
        masteryByTag
      })
    }
  }

  const getStudyTimeTrends = (days: number = 14) => {
    // Mock data for study time trends
    const trends = []
    const now = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      trends.push({
        date: date.toISOString().split('T')[0],
        minutes: Math.floor(Math.random() * 120) + 10 // Mock data
      })
    }
    
    return trends
  }

  const getQuizScoreTrends = (days: number = 14) => {
    // Mock data for quiz score trends
    const trends = []
    const now = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      trends.push({
        date: date.toISOString().split('T')[0],
        avgScore: Math.floor(Math.random() * 40) + 60 // Mock data: 60-100
      })
    }
    
    return trends
  }

  const getMasteryHeatmap = () => {
    const allTags = new Set<string>()
    metrics.value.forEach(metric => {
      Object.keys(metric.masteryByTag).forEach(tag => allTags.add(tag))
    })
    
    const heatmap: Record<string, number> = {}
    allTags.forEach(tag => {
      const tagMetrics = metrics.value
        .map(m => m.masteryByTag[tag] || 0)
        .filter(score => score > 0)
      
      if (tagMetrics.length > 0) {
        heatmap[tag] = tagMetrics.reduce((sum, score) => sum + score, 0) / tagMetrics.length
      }
    })
    
    return heatmap
  }

  const getWeakestTags = (limit: number = 3) => {
    const heatmap = getMasteryHeatmap()
    return Object.entries(heatmap)
      .sort(([, a], [, b]) => a - b)
      .slice(0, limit)
      .map(([tag, mastery]) => ({ tag, mastery }))
  }

  const getStreakDays = () => {
    return globalMetrics.value.streakDays
  }

  const updateStreak = () => {
    const global = metrics.value.find(m => !m.itemId)
    if (global) {
      global.streakDays += 1
    } else {
      updateMetrics(undefined, { streakDays: 1 })
    }
  }

  return {
    metrics,
    isLoading,
    globalMetrics,
    getItemMetrics,
    updateMetrics,
    recordQuizCompletion,
    recordStudyTime,
    recordFlashcardReview,
    getStudyTimeTrends,
    getQuizScoreTrends,
    getMasteryHeatmap,
    getWeakestTags,
    getStreakDays,
    updateStreak
  }
})
