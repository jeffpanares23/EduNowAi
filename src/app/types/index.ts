export type ContentType = 'pdf' | 'slides' | 'youtube' | 'audio' | 'text'

export interface SourceLocation {
  type: ContentType
  refId: string // e.g., fileId or videoId
  page?: number // for pdf/slides
  timestampSec?: number // for video/audio
}

export interface IngestedItem {
  id: string
  title: string
  type: ContentType
  createdAt: string
  sizeKB?: number
  durationSec?: number // for media
  tags: string[]
  previewText: string
  thumbUrl?: string
  status: 'ready' | 'processing' | 'error'
}

export interface Chunk {
  id: string
  itemId: string
  text: string
  locations: SourceLocation[] // allow multiple pointers
  embeddingSim?: number // mock RAG score
  topic?: string
}

export interface Summary {
  id: string
  itemId: string
  bullets: string[] // key ideas
  tldr: string // short overview
  syllabusOutline: string[] // chapters/sections
  sources: SourceLocation[]
}

export interface MCQ {
  id: string
  itemId: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  source: SourceLocation
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
}

export interface Flashcard {
  id: string
  itemId: string
  front: string // prompt
  back: string // answer
  source: SourceLocation
  ease: number // 1–5 mock SM-2 metric
  nextReviewAt: string
}

export interface ChatTurn {
  id: string
  role: 'user' | 'assistant'
  text: string
  citedChunks?: Chunk[] // answers are grounded with citations
  createdAt: string
}

export interface SessionMetrics {
  itemId?: string // per-document or global
  totalStudyMin: number
  quizzesTaken: number
  avgScore: number // 0–100
  weakTags: string[] // topics needing review
  masteryByTag: Record<string, number> // 0–100
  streakDays: number
}

export interface Plan {
  id: 'free' | 'pro' | 'team'
  name: string
  priceMonthly: number
  features: string[]
  limits: Record<string, number | string>
}

export interface User {
  id: string
  name: string
  email: string
  planId: Plan['id']
  avatarUrl?: string
}

export interface QuizSubmission {
  questionId: string
  selectedIndex: number
  isCorrect: boolean
  timeSpent: number
}

export interface QuizSession {
  id: string
  itemId: string
  questions: MCQ[]
  submissions: QuizSubmission[]
  startedAt: string
  completedAt?: string
  score?: number
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export interface Dialog {
  id: string
  type: 'confirm' | 'alert' | 'prompt'
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}
