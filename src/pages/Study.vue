<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-100">Study Tools</h1>
          <p class="text-surface-600 dark:text-surface-400">
            Practice with quizzes and flashcards
          </p>
        </div>
      </div>

      <!-- Study Mode Tabs -->
      <div class="mb-8">
        <div class="border-b border-surface-200 dark:border-surface-700">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="activeTab === tab.id 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300 dark:text-surface-400 dark:hover:text-surface-200'"
              @click="activeTab = tab.id"
            >
              <component :is="tab.icon" class="h-4 w-4 mr-2 inline" />
              {{ tab.name }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Summary Tab -->
      <div v-if="activeTab === 'summary'" class="space-y-6">
        <div class="card p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
              Document Summaries
            </h2>
            <button 
              class="btn-primary"
              @click="generateSummary"
              :disabled="!selectedItem || studyStore.isLoading"
            >
              <SparklesIcon class="h-4 w-4 mr-2" />
              Generate Summary
            </button>
          </div>
          
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
                  v-for="bullet in currentSummary.bullets"
                  :key="bullet"
                  class="flex items-start space-x-2"
                >
                  <div class="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span class="text-surface-700 dark:text-surface-300">{{ bullet }}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 class="text-md font-medium text-surface-900 dark:text-surface-100 mb-2">
                Syllabus Outline
              </h3>
              <ol class="space-y-1">
                <li 
                  v-for="(item, index) in currentSummary.syllabusOutline"
                  :key="item"
                  class="flex items-start space-x-2"
                >
                  <span class="text-primary-600 font-medium">{{ index + 1 }}.</span>
                  <span class="text-surface-700 dark:text-surface-300">{{ item }}</span>
                </li>
              </ol>
            </div>
          </div>
          
          <div v-else class="text-center py-12">
            <DocumentTextIcon class="h-12 w-12 text-surface-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">
              No Summary Available
            </h3>
            <p class="text-surface-600 dark:text-surface-400">
              Generate a summary to see key insights from your document
            </p>
          </div>
        </div>
      </div>

      <!-- Quiz Tab -->
      <div v-if="activeTab === 'quiz'" class="space-y-6">
        <div v-if="!studyStore.currentQuiz" class="card p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
              Start a Quiz
            </h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Number of Questions
              </label>
              <select v-model="quizSettings.questionCount" class="input">
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="20">20 Questions</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Difficulty
              </label>
              <select v-model="quizSettings.difficulty" class="input">
                <option value="">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Topics
              </label>
              <TagMultiselect
                v-model="quizSettings.tags"
                :available-tags="availableTags"
                placeholder="All topics"
              />
            </div>
          </div>
          
          <div class="flex justify-center">
            <button 
              class="btn-primary"
              @click="startQuiz"
              :disabled="!selectedItem || studyStore.isLoading"
            >
              <AcademicCapIcon class="h-4 w-4 mr-2" />
              Start Quiz
            </button>
          </div>
        </div>
        
        <!-- Quiz in progress -->
        <div v-else-if="!quizCompleted" class="card p-6">
          <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
                Question {{ currentQuestionIndex + 1 }} of {{ studyStore.currentQuiz.questions.length }}
              </h2>
              <span class="text-sm text-surface-500 dark:text-surface-400">
                {{ Math.round(((currentQuestionIndex + 1) / studyStore.currentQuiz.questions.length) * 100) }}% Complete
              </span>
            </div>
            <div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
              <div 
                class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${((currentQuestionIndex + 1) / studyStore.currentQuiz.questions.length) * 100}%` }"
              ></div>
            </div>
          </div>
          
          <div v-if="currentQuestion" class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-surface-900 dark:text-surface-100 mb-4">
                {{ currentQuestion.question }}
              </h3>
              
              <div class="space-y-3">
                <button
                  v-for="(option, index) in currentQuestion.options"
                  :key="index"
                  class="w-full text-left p-4 rounded-lg border transition-colors"
                  :class="selectedAnswer === index 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' 
                    : 'border-surface-200 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700'"
                  @click="selectedAnswer = index"
                >
                  <div class="flex items-center space-x-3">
                    <div 
                      class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      :class="selectedAnswer === index 
                        ? 'border-primary-500 bg-primary-500' 
                        : 'border-surface-300 dark:border-surface-600'"
                    >
                      <div v-if="selectedAnswer === index" class="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span class="text-surface-900 dark:text-surface-100">{{ option }}</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div class="flex justify-between">
              <button 
                v-if="currentQuestionIndex > 0"
                class="btn-outline"
                @click="previousQuestion"
              >
                Previous
              </button>
              <div v-else></div>
              
              <button 
                class="btn-primary"
                @click="nextQuestion"
                :disabled="selectedAnswer === null"
              >
                {{ currentQuestionIndex === studyStore.currentQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next' }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Quiz completed -->
        <div v-else class="card p-6">
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-success-100 dark:bg-success-900 rounded-full mb-4">
              <CheckIcon class="h-8 w-8 text-success-600 dark:text-success-400" />
            </div>
            <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
              Quiz Completed!
            </h2>
            <p class="text-surface-600 dark:text-surface-400">
              Great job! Here are your results
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600 mb-1">
                {{ quizResults?.score }}%
              </div>
              <div class="text-sm text-surface-600 dark:text-surface-400">Score</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-success-600 mb-1">
                {{ quizResults?.correctAnswers }}/{{ quizResults?.totalQuestions }}
              </div>
              <div class="text-sm text-surface-600 dark:text-surface-400">Correct</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-surface-600 dark:text-surface-400 mb-1">
                {{ Math.round((quizResults?.timeSpent || 0) / 1000 / 60) }}m
              </div>
              <div class="text-sm text-surface-600 dark:text-surface-400">Time</div>
            </div>
          </div>
          
          <div v-if="quizResults?.weakTags && quizResults.weakTags.length > 0" class="mb-6">
            <h3 class="text-md font-medium text-surface-900 dark:text-surface-100 mb-2">
              Areas for Improvement
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in quizResults?.weakTags || []"
                :key="tag"
                class="badge-warning"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          
          <div class="flex justify-center space-x-4">
            <button class="btn-outline" @click="resetQuiz">
              Take Another Quiz
            </button>
            <button class="btn-primary" @click="activeTab = 'flashcards'">
              Study with Flashcards
            </button>
          </div>
        </div>
      </div>

      <!-- Flashcards Tab -->
      <div v-if="activeTab === 'flashcards'" class="space-y-6">
        <div v-if="!currentFlashcard" class="card p-6">
          <div class="text-center py-12">
            <CreditCardIcon class="h-12 w-12 text-surface-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">
              No Flashcards Available
            </h3>
            <p class="text-surface-600 dark:text-surface-400 mb-4">
              Generate flashcards to start studying
            </p>
            <button 
              class="btn-primary"
              @click="generateFlashcards"
              :disabled="!selectedItem || studyStore.isLoading"
            >
              <SparklesIcon class="h-4 w-4 mr-2" />
              Generate Flashcards
            </button>
          </div>
        </div>
        
        <div v-else class="card p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
                Flashcard Review
              </h2>
              <p class="text-sm text-surface-600 dark:text-surface-400">
                {{ dueFlashcards.length }} cards due for review
              </p>
            </div>
            <div class="text-sm text-surface-600 dark:text-surface-400">
              Card {{ currentFlashcardIndex + 1 }} of {{ dueFlashcards.length }}
            </div>
          </div>
          
          <div class="max-w-2xl mx-auto">
            <div 
              class="bg-surface-50 dark:bg-surface-800 rounded-lg p-8 min-h-[200px] flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
              @click="flipCard"
            >
              <div class="text-center">
                <div v-if="!cardFlipped" class="space-y-4">
                  <div class="text-sm text-surface-500 dark:text-surface-400 mb-2">Question</div>
                  <p class="text-lg text-surface-900 dark:text-surface-100">
                    {{ currentFlashcard.front }}
                  </p>
                  <p class="text-sm text-surface-500 dark:text-surface-400 mt-4">
                    Click to reveal answer
                  </p>
                </div>
                <div v-else class="space-y-4">
                  <div class="text-sm text-surface-500 dark:text-surface-400 mb-2">Answer</div>
                  <p class="text-lg text-surface-900 dark:text-surface-100">
                    {{ currentFlashcard.back }}
                  </p>
                </div>
              </div>
            </div>
            
            <div v-if="cardFlipped" class="mt-6 flex justify-center space-x-3">
              <button 
                class="btn-outline text-error-600 hover:bg-error-50 dark:hover:bg-error-900"
                @click="reviewCard('again')"
              >
                Again
              </button>
              <button 
                class="btn-outline text-warn-600 hover:bg-warn-50 dark:hover:bg-warn-900"
                @click="reviewCard('hard')"
              >
                Hard
              </button>
              <button 
                class="btn-outline text-success-600 hover:bg-success-50 dark:hover:bg-success-900"
                @click="reviewCard('good')"
              >
                Good
              </button>
              <button 
                class="btn-outline text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900"
                @click="reviewCard('easy')"
              >
                Easy
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Document Selector -->
      <div class="fixed bottom-6 right-6">
        <div class="card p-4 shadow-lg">
          <div class="flex items-center space-x-3">
            <span class="text-sm font-medium text-surface-900 dark:text-surface-100">Document:</span>
            <select 
              v-model="selectedItemId"
              class="input input-sm w-48"
              @change="onDocumentChange"
            >
              <option value="">Select a document</option>
              <option
                v-for="item in libraryStore.items.filter(i => i.status === 'ready')"
                :key="item.id"
                :value="item.id"
              >
                {{ item.title }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  AcademicCapIcon,
  DocumentTextIcon,
  CreditCardIcon,
  SparklesIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import AppLayout from '@/components/AppLayout.vue'
import TagMultiselect from '@/components/TagMultiselect.vue'
import { useStudyStore } from '@/app/store/study'
import { useLibraryStore } from '@/app/store/library'
import { useUiStore } from '@/app/store/ui'
import { getMockData } from '@/mock/seed'

const studyStore = useStudyStore()
const libraryStore = useLibraryStore()
const uiStore = useUiStore()

const activeTab = ref('summary')
const selectedItemId = ref('')
const selectedAnswer = ref<number | null>(null)
const currentQuestionIndex = ref(0)
const quizCompleted = ref(false)
const cardFlipped = ref(false)
const currentFlashcardIndex = ref(0)

const tabs = [
  { id: 'summary', name: 'Summary', icon: DocumentTextIcon },
  { id: 'quiz', name: 'Quiz', icon: AcademicCapIcon },
  { id: 'flashcards', name: 'Flashcards', icon: CreditCardIcon }
]

const quizSettings = ref({
  questionCount: 10,
  difficulty: '',
  tags: [] as string[]
})

const selectedItem = computed(() => {
  return selectedItemId.value ? libraryStore.getItemById(selectedItemId.value) : null
})

const currentSummary = computed(() => {
  return selectedItemId.value ? studyStore.summaries.find(s => s.itemId === selectedItemId.value) : null
})

const currentQuestion = computed(() => {
  return studyStore.currentQuiz?.questions[currentQuestionIndex.value]
})

const quizResults = computed(() => {
  return studyStore.getQuizResults()
})

const availableTags = computed(() => {
  const tags = new Set<string>()
  studyStore.mcqs.forEach(mcq => {
    mcq.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
})

const dueFlashcards = computed(() => {
  return studyStore.dueFlashcards.filter(card => card.itemId === selectedItemId.value)
})

const currentFlashcard = computed(() => {
  return dueFlashcards.value[currentFlashcardIndex.value]
})

onMounted(() => {
  // Load mock data
  if (libraryStore.items.length === 0) {
    const mockData = getMockData()
    mockData.items.forEach((item: any) => libraryStore.addItem(item))
    mockData.summaries.forEach((summary: any) => studyStore.summaries.push(summary))
    mockData.mcqs.forEach((mcq: any) => studyStore.mcqs.push(mcq))
    mockData.flashcards.forEach((card: any) => studyStore.flashcards.push(card))
  }
  
  // Auto-select first document
  if (libraryStore.items.length > 0) {
    selectedItemId.value = libraryStore.items[0].id
  }
})

const onDocumentChange = () => {
  resetQuiz()
  cardFlipped.value = false
  currentFlashcardIndex.value = 0
}

const generateSummary = async () => {
  if (!selectedItemId.value) return
  
  try {
    await studyStore.generateSummary(selectedItemId.value)
    uiStore.showSuccess('Summary generated successfully!')
  } catch (error) {
    uiStore.showError('Failed to generate summary')
  }
}

const startQuiz = async () => {
  if (!selectedItemId.value) return
  
  try {
    await studyStore.startQuiz(selectedItemId.value, {
      difficulty: quizSettings.value.difficulty as any,
      tags: quizSettings.value.tags,
      questionCount: quizSettings.value.questionCount
    })
    currentQuestionIndex.value = 0
    selectedAnswer.value = null
    quizCompleted.value = false
  } catch (error) {
    uiStore.showError('Failed to start quiz')
  }
}

const nextQuestion = () => {
  if (selectedAnswer.value === null || !currentQuestion.value) return
  
  // Submit answer
  studyStore.submitQuizAnswer(currentQuestion.value.id, selectedAnswer.value)
  
  // Move to next question or complete quiz
  if (currentQuestionIndex.value === studyStore.currentQuiz!.questions.length - 1) {
    studyStore.completeQuiz()
    quizCompleted.value = true
  } else {
    currentQuestionIndex.value++
    selectedAnswer.value = null
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    selectedAnswer.value = null
  }
}

const resetQuiz = () => {
  studyStore.currentQuiz = null
  quizCompleted.value = false
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
}

const generateFlashcards = async () => {
  if (!selectedItemId.value) return
  
  try {
    await studyStore.generateFlashcards(selectedItemId.value, 10)
    uiStore.showSuccess('Flashcards generated successfully!')
  } catch (error) {
    uiStore.showError('Failed to generate flashcards')
  }
}

const flipCard = () => {
  cardFlipped.value = !cardFlipped.value
}

const reviewCard = (rating: 'again' | 'hard' | 'good' | 'easy') => {
  if (!currentFlashcard.value) return
  
  studyStore.reviewFlashcard(currentFlashcard.value.id, rating)
  
  // Move to next card
  if (currentFlashcardIndex.value < dueFlashcards.value.length - 1) {
    currentFlashcardIndex.value++
  } else {
    currentFlashcardIndex.value = 0
  }
  
  cardFlipped.value = false
}
</script>