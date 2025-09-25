<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-100">Learning Analytics</h1>
          <p class="text-surface-600 dark:text-surface-400">
            Track your progress and performance
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <select v-model="selectedPeriod" class="input">
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ClockIcon class="h-8 w-8 text-primary-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-surface-500 dark:text-surface-400">Total Study Time</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">
                {{ Math.round(analyticsStore.globalMetrics.totalStudyMin / 60) }}h
              </p>
              <p class="text-xs text-success-600">+15% from last period</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <AcademicCapIcon class="h-8 w-8 text-success-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-surface-500 dark:text-surface-400">Quizzes Taken</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">
                {{ analyticsStore.globalMetrics.quizzesTaken }}
              </p>
              <p class="text-xs text-success-600">+3 this week</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ChartBarIcon class="h-8 w-8 text-warn-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-surface-500 dark:text-surface-400">Average Score</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">
                {{ analyticsStore.globalMetrics.avgScore }}%
              </p>
              <p class="text-xs text-success-600">+5% improvement</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <FireIcon class="h-8 w-8 text-error-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-surface-500 dark:text-surface-400">Study Streak</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">
                {{ analyticsStore.globalMetrics.streakDays }} days
              </p>
              <p class="text-xs text-success-600">Keep it up!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Study Time Chart -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
            Study Time Trends
          </h3>
          <div class="h-64 flex items-end justify-between space-x-2">
            <div
              v-for="(day, index) in studyTimeTrends"
              :key="day.date"
              class="flex-1 bg-primary-200 dark:bg-primary-800 rounded-t hover:bg-primary-300 dark:hover:bg-primary-700 transition-colors cursor-pointer relative group"
              :style="{ height: `${Math.max((day.minutes / maxStudyTime) * 100, 5)}%` }"
            >
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-surface-800 dark:bg-surface-200 text-white dark:text-surface-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {{ day.minutes }}min
              </div>
            </div>
          </div>
          <div class="flex justify-between mt-2 text-xs text-surface-500 dark:text-surface-400">
            <span>{{ formatDate(studyTimeTrends[0]?.date) }}</span>
            <span>{{ formatDate(studyTimeTrends[studyTimeTrends.length - 1]?.date) }}</span>
          </div>
        </div>

        <!-- Quiz Scores Chart -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
            Quiz Performance
          </h3>
          <div class="h-64 flex items-end justify-between space-x-2">
            <div
              v-for="(day, index) in quizScoreTrends"
              :key="day.date"
              class="flex-1 bg-success-200 dark:bg-success-800 rounded-t hover:bg-success-300 dark:hover:bg-success-700 transition-colors cursor-pointer relative group"
              :style="{ height: `${Math.max((day.avgScore / 100) * 100, 5)}%` }"
            >
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-surface-800 dark:bg-surface-200 text-white dark:text-surface-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {{ day.avgScore }}%
              </div>
            </div>
          </div>
          <div class="flex justify-between mt-2 text-xs text-surface-500 dark:text-surface-400">
            <span>{{ formatDate(quizScoreTrends[0]?.date) }}</span>
            <span>{{ formatDate(quizScoreTrends[quizScoreTrends.length - 1]?.date) }}</span>
          </div>
        </div>
      </div>

      <!-- Mastery Heatmap -->
      <div class="card p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
            Topic Mastery
          </h3>
          <div class="flex items-center space-x-2 text-sm text-surface-500 dark:text-surface-400">
            <span>Less</span>
            <div class="flex space-x-1">
              <div class="w-3 h-3 bg-surface-200 dark:bg-surface-700 rounded"></div>
              <div class="w-3 h-3 bg-primary-200 dark:bg-primary-800 rounded"></div>
              <div class="w-3 h-3 bg-primary-400 dark:bg-primary-600 rounded"></div>
              <div class="w-3 h-3 bg-primary-600 dark:bg-primary-500 rounded"></div>
              <div class="w-3 h-3 bg-primary-800 dark:bg-primary-400 rounded"></div>
            </div>
            <span>More</span>
          </div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div
            v-for="[topic, mastery] in Object.entries(masteryHeatmap)"
            :key="topic"
            class="p-4 rounded-lg border border-surface-200 dark:border-surface-600 hover:shadow-md transition-shadow cursor-pointer"
            :style="{ backgroundColor: getMasteryColor(mastery) }"
          >
            <div class="text-sm font-medium text-surface-900 dark:text-surface-100 mb-1">
              {{ topic }}
            </div>
            <div class="text-xs text-surface-600 dark:text-surface-400">
              {{ Math.round(mastery) }}% mastery
            </div>
          </div>
        </div>
      </div>

      <!-- Weak Areas and Recommendations -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
            Areas for Improvement
          </h3>
          <div class="space-y-3">
            <div
              v-for="weak in weakestTags"
              :key="weak.tag"
              class="flex items-center justify-between p-3 bg-warn-50 dark:bg-warn-900 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <ExclamationTriangleIcon class="h-5 w-5 text-warn-600 dark:text-warn-400" />
                <div>
                  <div class="font-medium text-surface-900 dark:text-surface-100">{{ weak.tag }}</div>
                  <div class="text-sm text-surface-600 dark:text-surface-400">{{ Math.round(weak.mastery) }}% mastery</div>
                </div>
              </div>
              <button 
                class="btn-outline btn-sm"
                @click="studyWeakArea(weak.tag)"
              >
                Study This
              </button>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
            Recent Activity
          </h3>
          <div class="space-y-3">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-start space-x-3 p-3 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg"
            >
              <component :is="activity.icon" class="h-5 w-5 text-primary-600 mt-0.5" />
              <div class="flex-1">
                <p class="text-sm text-surface-900 dark:text-surface-100">{{ activity.description }}</p>
                <p class="text-xs text-surface-500 dark:text-surface-400">{{ formatRelativeTime(activity.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  ChartBarIcon,
  ClockIcon,
  AcademicCapIcon,
  FireIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CreditCardIcon
} from '@heroicons/vue/24/outline'
import AppLayout from '@/components/AppLayout.vue'
import { useAnalyticsStore } from '@/app/store/analytics'
import { getMockData } from '@/mock/seed'

const analyticsStore = useAnalyticsStore()
const selectedPeriod = ref(14)

const studyTimeTrends = computed(() => {
  return analyticsStore.getStudyTimeTrends(selectedPeriod.value)
})

const quizScoreTrends = computed(() => {
  return analyticsStore.getQuizScoreTrends(selectedPeriod.value)
})

const masteryHeatmap = computed(() => {
  return analyticsStore.getMasteryHeatmap()
})

const weakestTags = computed(() => {
  return analyticsStore.getWeakestTags(3)
})

const maxStudyTime = computed(() => {
  return Math.max(...studyTimeTrends.value.map(d => d.minutes))
})

const recentActivities = computed(() => {
  return [
    {
      id: '1',
      icon: AcademicCapIcon,
      description: 'Completed quiz on Machine Learning with 85% score',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      icon: CreditCardIcon,
      description: 'Reviewed 15 flashcards on React Fundamentals',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      icon: DocumentTextIcon,
      description: 'Generated summary for Database Design Principles',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    }
  ]
})

onMounted(() => {
  // Load mock data
  const mockData = getMockData()
  if (analyticsStore.metrics.length === 0) {
    mockData.metrics.forEach((metric: any) => {
      analyticsStore.metrics.push(metric)
    })
  }
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    return `${Math.floor(diffInHours / 24)}d ago`
  }
}

const getMasteryColor = (mastery: number) => {
  if (mastery < 20) return 'rgba(156, 163, 175, 0.2)' // surface-400
  if (mastery < 40) return 'rgba(59, 130, 246, 0.2)' // primary-500
  if (mastery < 60) return 'rgba(59, 130, 246, 0.4)' // primary-500
  if (mastery < 80) return 'rgba(59, 130, 246, 0.6)' // primary-500
  return 'rgba(59, 130, 246, 0.8)' // primary-500
}

const studyWeakArea = (tag: string) => {
  // Navigate to study page with tag filter
  // This would be implemented with router navigation
  console.log('Study weak area:', tag)
}
</script>
