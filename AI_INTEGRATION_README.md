# EduNow.AI - AI-Powered Learning Platform

## 🚀 Features

- **Dynamic Course Generation**: AI-powered content creation based on user inputs
- **Trial Workflow**: Complete user journey from file upload to subscription
- **Personalized Learning**: Adaptive content based on assessment and preferences
- **Subscription Management**: Full billing and plan management system
- **File Upload**: Support for PDF, DOC, PPT, MP4, MP3 files
- **Real-time AI**: Gemini API integration for dynamic content

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Gemini API Key

1. **Get your Gemini API key** from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **Create environment file**:
   ```bash
   cp env.example .env
   ```

3. **Add your API key** to `.env`:
   ```
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   VITE_APP_ENV=development
   ```

### 3. Start Development Server
```bash
npm run dev
```

## 🎯 AI Integration Features

### Dynamic Content Generation
The system uses Gemini API to generate personalized content based on:

- **Uploaded Files**: PDF, DOC, PPT, MP4, MP3 files
- **Learning Assessment**: 5 questions about knowledge and goals
- **Learning Preferences**: Pace, teaching style, session length
- **Course Description**: User-provided learning objectives

### Generated Content Types
1. **Course Outline**: Complete course structure with modules and lessons
2. **Sample Lessons**: Detailed lesson content with examples and insights
3. **Practice Questions**: Interactive quizzes with explanations

### AI Service Features
- **Fallback Content**: Graceful degradation when API is unavailable
- **Error Handling**: Robust error management with user feedback
- **Loading States**: Visual feedback during content generation
- **Personalization**: Content adapted to user's learning style and pace

## 🔧 Technical Implementation

### AI Content Service
- **Direct API Integration**: Uses Gemini REST API for content generation
- **Prompt Engineering**: Optimized prompts for educational content
- **JSON Response Parsing**: Structured content generation
- **Error Recovery**: Fallback to default content on API failures

### Trial Workflow
1. **File Upload**: Drag & drop or click to upload files
2. **Learning Assessment**: 5-question knowledge evaluation
3. **Preferences Setup**: Learning style and pace configuration
4. **Course Generation**: AI creates personalized course outline
5. **Content Preview**: Sample lesson and practice question
6. **Subscription Selection**: Plan choice before dashboard access

### Subscription Management
- **Plan Comparison**: Free, Pro, Team plans
- **Usage Tracking**: Real-time monitoring of plan limits
- **Billing History**: Complete transaction records
- **Plan Changes**: Seamless upgrades/downgrades

## 📱 User Experience

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Dark Mode**: Complete dark theme support
- **Accessibility**: WCAG compliant design
- **Performance**: Optimized loading and interactions

### Interactive Elements
- **Drag & Drop**: File upload with visual feedback
- **Progress Indicators**: Visual progress through trial workflow
- **Loading States**: Smooth transitions and feedback
- **Error Handling**: User-friendly error messages

## 🚀 Getting Started

1. **Complete Trial**: Upload files, take assessment, set preferences
2. **View Generated Content**: See AI-created course outline and samples
3. **Choose Plan**: Select subscription or start with free plan
4. **Access Dashboard**: Full platform access with personalized content

## 🔑 API Configuration

The system requires a Gemini API key for dynamic content generation. Without the API key, the system will use fallback content to ensure functionality.

### Environment Variables
- `VITE_GEMINI_API_KEY`: Your Gemini API key
- `VITE_APP_ENV`: Environment (development/production)

### API Usage
- **Rate Limits**: Respects Gemini API rate limits
- **Error Handling**: Graceful fallback on API failures
- **Security**: API key stored in environment variables

## 📊 Content Generation Process

1. **Data Collection**: Gathers user inputs (files, assessment, preferences)
2. **Prompt Construction**: Builds comprehensive prompts for AI
3. **API Request**: Sends request to Gemini API
4. **Response Processing**: Parses JSON response
5. **Content Display**: Renders generated content in UI
6. **Fallback**: Uses default content if generation fails

## 🎨 UI Components

- **File Upload**: Drag & drop interface with validation
- **Assessment Forms**: Interactive questionnaires
- **Course Outline**: Dynamic module and lesson display
- **Sample Content**: AI-generated lesson previews
- **Practice Questions**: Interactive quiz components
- **Subscription Plans**: Professional plan comparison

## 🔒 Security & Privacy

- **API Key Protection**: Environment variable storage
- **Data Validation**: Input sanitization and validation
- **Error Handling**: Secure error messages
- **Session Management**: Secure data persistence

## 📈 Performance

- **Lazy Loading**: Components loaded on demand
- **Caching**: Session storage for trial data
- **Optimization**: Minimized bundle size
- **Responsive**: Fast loading on all devices

## 🛠️ Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

### Project Structure
```
src/
├── app/
│   ├── services/
│   │   └── aiContentService.ts    # AI content generation
│   ├── store/                     # State management
│   └── types/                     # TypeScript types
├── components/                    # Reusable components
├── pages/                         # Page components
└── main.ts                       # Application entry
```

## 🎯 Next Steps

1. **Add your Gemini API key** to enable AI content generation
2. **Test the trial workflow** with different file types
3. **Customize content prompts** for your specific use case
4. **Deploy to production** with proper environment configuration

## 📞 Support

For issues or questions:
1. Check the console for error messages
2. Verify your API key is correctly configured
3. Test with fallback content if API is unavailable
4. Review the browser network tab for API requests

---

**Ready to transform learning with AI?** Add your Gemini API key and start creating personalized courses! 🚀
