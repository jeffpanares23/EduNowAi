# EduNow.AI - AI-Powered Learning Platform

A production-quality Vue 3 + TypeScript + Tailwind web app that replicates the core UX of YouLearn.AI. This is a comprehensive learning platform with document ingestion, AI tutoring, and study tools.

## Features

- **Document Upload**: Support for PDFs, slides, videos, audio, and text files
- **AI-Powered Summaries**: Instant summaries and key insights from any content
- **Interactive Tutor**: Chat with an AI tutor that knows your content
- **Study Tools**: Quizzes, flashcards, and spaced repetition
- **Progress Analytics**: Track learning progress and performance
- **Voice Mode**: Hands-free learning with voice interactions
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes

## Tech Stack

- **Frontend**: Vue 3 with Composition API and `<script setup>`
- **TypeScript**: Full type safety and strict configuration
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Pinia for reactive state management
- **Routing**: Vue Router with authentication guards
- **UI Components**: Headless UI for accessible primitives
- **Icons**: Heroicons for consistent iconography
- **Build Tool**: Vite for fast development and building

## Project Structure

```
src/
├── app/
│   ├── router.ts          # Vue Router configuration
│   ├── store/            # Pinia stores
│   ├── services/         # Mock services (API layer)
│   └── types/           # TypeScript interfaces
├── components/          # Reusable UI components
├── pages/              # Route components
├── mock/               # Mock data and seeding
└── main.ts            # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Mock Data

The application includes comprehensive mock data:

- **7 Ingested Items**: Various document types (PDF, video, audio, text)
- **300+ Chunks**: Text segments with source locations and embeddings
- **3 Summaries**: AI-generated summaries with key points
- **80 MCQs**: Multiple choice questions with explanations
- **40 Flashcards**: Spaced repetition cards with SRS algorithm
- **Session Metrics**: Progress tracking and analytics data

## Key Components

### Core Components
- `AppLayout.vue` - Main application layout with navigation
- `UploadDropzone.vue` - Drag-and-drop file upload
- `TagMultiselect.vue` - Tag selection and creation
- `SourceChip.vue` - Source location indicators
- `SourceViewerDrawer.vue` - Document content viewer
- `Toast.vue` - Notification system
- `Dialog.vue` - Modal dialogs

### Pages
- `Landing.vue` - Marketing homepage
- `SignIn.vue` / `SignUp.vue` - Authentication
- `Dashboard.vue` - User dashboard
- `Library.vue` - Document management
- `DocumentDetail.vue` - Document viewer
- `Tutor.vue` - AI chat interface
- `Study.vue` - Quiz and flashcard tools
- `Analytics.vue` - Progress tracking
- `Pricing.vue` - Subscription plans
- `Account.vue` - User settings

## State Management

The application uses Pinia stores for state management:

- `useAuthStore` - User authentication and profile
- `useLibraryStore` - Document management and filtering
- `useTutorStore` - Chat history and AI interactions
- `useStudyStore` - Quizzes, flashcards, and study sessions
- `useAnalyticsStore` - Progress metrics and analytics
- `useUiStore` - UI state (theme, notifications, dialogs)

## Services Layer

Mock services simulate API calls with realistic delays:

- `LibraryService` - Document CRUD operations
- `RAGService` - Search and retrieval
- `StudyService` - Quiz and flashcard management
- `AnalyticsService` - Metrics and reporting
- `BillingService` - Subscription management

## Design System

Custom Tailwind configuration with:

- **Color Palette**: Primary, surface, success, warning, error
- **Typography**: Inter font family
- **Components**: Pre-built button, input, card, and badge styles
- **Dark Mode**: Automatic theme switching with localStorage persistence

## Testing

The project includes:

- **Vitest**: Unit testing framework
- **Vue Test Utils**: Component testing utilities
- **Test Coverage**: Store logic and component behavior

## Future Enhancements

This mock application is designed to be easily extended with:

- **Laravel Backend**: Replace mock services with real API calls
- **Real AI Integration**: Connect to actual AI services
- **Payment Processing**: Implement subscription billing
- **Team Features**: Multi-user collaboration
- **Mobile App**: React Native or Flutter companion
- **Advanced Analytics**: Machine learning insights

## License

This project is for demonstration purposes. Please ensure you have appropriate licenses for any production use.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

Built with ❤️ using Vue 3, TypeScript, and Tailwind CSS
