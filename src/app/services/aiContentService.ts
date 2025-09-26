// Simple AI Content Service using fetch API to Gemini
export class AIContentService {
  private apiKey: string
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY
    console.log('AI Service initialized with API key:', this.apiKey ? 'Present' : 'Missing')
  }

  async generateCourseOutline(courseData: any, assessmentResults: any, preferences: any) {
    console.log('Generating course outline with data:', {
      courseData,
      assessmentResults,
      preferences,
      hasApiKey: !!this.apiKey
    })

    // Always try to create dynamic content first, even without API key
    const dynamicContent = this.createDynamicContent(courseData, assessmentResults, preferences)
    
    // If no API key, return dynamic content immediately
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      console.log('No valid API key found, using dynamic content')
      return dynamicContent
    }

    // Try AI generation with API key
    try {
      const prompt = `
    Generate a comprehensive course outline based on the following information:

    Course Materials:
    - Files: ${courseData.files?.map((f: any) => f.name).join(', ') || 'None'}
    - Links: ${courseData.links || 'None'}
    - Description: ${courseData.description || 'None'}

    Learning Assessment Results:
    - Familiarity Level: ${this.getFamiliarityLevel(assessmentResults[0])}
    - Learning Goal: ${this.getLearningGoal(assessmentResults[1])}
    - Learning Style: ${this.getLearningStyle(assessmentResults[2])}
    - Experience Level: ${this.getExperienceLevel(assessmentResults[3])}
    - Time Commitment: ${this.getTimeCommitment(assessmentResults[4])}

    Learning Preferences:
    - Pace: ${this.getPace(preferences.pace)}
    - Teaching Style: ${this.getTeachingStyle(preferences.teachingStyle)}
    - Session Length: ${this.getSessionLength(preferences.sessionLength)}

    Please generate:
    1. A course title
    2. Course description
    3. Learning objectives (3-5 key points)
    4. Module structure with 3-5 modules
    5. Each module should have 2-4 lessons
    6. Estimated time for each lesson
    7. Difficulty progression

    Format the response as JSON with the following structure:
    {
      "title": "Course Title",
      "description": "Course description",
      "objectives": ["objective1", "objective2", "objective3"],
      "modules": [
        {
          "title": "Module Title",
          "description": "Module description",
          "lessons": [
            {
              "title": "Lesson Title",
              "description": "Lesson description",
              "duration": "X minutes",
              "type": "theory|practice|assessment"
            }
          ]
        }
      ],
      "totalDuration": "X hours Y minutes"
    }
    `

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!generatedText) {
        throw new Error('No content generated')
      }

      return JSON.parse(generatedText)
    } catch (error) {
      console.error('Error generating course outline with AI:', error)
      console.log('Falling back to dynamic content')
      return dynamicContent
    }
  }

  async generateSampleLesson(courseOutline: any, moduleIndex: number = 0, lessonIndex: number = 0) {
    // If no API key, return dynamic content immediately
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      console.log('No valid API key found, using dynamic sample lesson')
      return this.createDynamicSampleLesson(courseOutline)
    }

    const module = courseOutline.modules[moduleIndex]
    const lesson = module?.lessons[lessonIndex]

    if (!lesson) return this.createDynamicSampleLesson(courseOutline)

    const prompt = `
    Generate a detailed sample lesson content for:

    Course: ${courseOutline.title}
    Module: ${module.title}
    Lesson: ${lesson.title}
    Duration: ${lesson.duration}
    Type: ${lesson.type}

    Please create:
    1. Introduction to the lesson
    2. Main content with explanations
    3. Key concepts and definitions
    4. Examples or case studies
    5. Key insights or takeaways

    Format as JSON:
    {
      "introduction": "Lesson introduction",
      "content": "Main lesson content",
      "keyConcepts": ["concept1", "concept2"],
      "examples": ["example1", "example2"],
      "keyInsights": ["insight1", "insight2"]
    }
    `

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1024,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!generatedText) {
        throw new Error('No content generated')
      }

      return JSON.parse(generatedText)
    } catch (error) {
      console.error('Error generating sample lesson:', error)
      return this.createDynamicSampleLesson(courseOutline)
    }
  }

  // Create dynamic sample lesson based on course outline
  private createDynamicSampleLesson(courseOutline: any) {
    const topic = courseOutline.title.replace('Introduction to ', '').toLowerCase()
    
    // Create topic-specific content
    let introduction = `Welcome to this lesson on ${topic} fundamentals.`
    let content = `${courseOutline.title.replace('Introduction to ', '')} is a fascinating field that enables us to understand complex concepts and solve real-world problems.`
    let keyConcepts = [
      courseOutline.title.replace('Introduction to ', ''),
      "Core Principles", 
      "Practical Applications"
    ]
    let examples = [
      `${courseOutline.title.replace('Introduction to ', '')} in real-world applications`,
      "Common use cases and scenarios",
      "Best practices and techniques"
    ]
    let keyInsights = [
      `Understanding ${topic} is essential for modern problem-solving.`
    ]
    
    // Customize content based on topic
    if (topic.includes('solar system') || topic.includes('astronomy')) {
      introduction = "Welcome to this lesson on solar system and astronomy fundamentals."
      content = "The solar system is our cosmic neighborhood, containing the Sun, planets, moons, asteroids, and comets that orbit around it."
      keyConcepts = ["Solar System", "Planets", "Orbits", "Gravity", "Space"]
      examples = [
        "Planetary motion and orbits",
        "Solar system formation",
        "Space exploration missions"
      ]
      keyInsights = ["Understanding our solar system helps us comprehend our place in the universe."]
    } else if (topic.includes('biology')) {
      introduction = "Welcome to this lesson on biology fundamentals."
      content = "Biology is the study of living organisms and their interactions with each other and their environment."
      keyConcepts = ["Cells", "Organisms", "Ecosystems", "Evolution", "Genetics"]
      examples = [
        "Cell structure and function",
        "Ecosystem interactions",
        "Genetic inheritance"
      ]
      keyInsights = ["Biology helps us understand the diversity and complexity of life on Earth."]
    } else if (topic.includes('chemistry')) {
      introduction = "Welcome to this lesson on chemistry fundamentals."
      content = "Chemistry is the study of matter, its properties, composition, and the changes it undergoes."
      keyConcepts = ["Atoms", "Molecules", "Chemical Reactions", "Elements", "Compounds"]
      examples = [
        "Chemical bonding",
        "Reaction mechanisms",
        "Periodic table organization"
      ]
      keyInsights = ["Chemistry explains the fundamental building blocks of all matter."]
    }
    
    return {
      introduction,
      content,
      keyConcepts,
      examples,
      keyInsights
    }
  }

  async generatePracticeQuestion(courseOutline: any, moduleIndex: number = 0) {
    // If no API key, return dynamic content immediately
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      console.log('No valid API key found, using dynamic practice question')
      return this.createDynamicPracticeQuestion(courseOutline)
    }

    const module = courseOutline.modules[moduleIndex]

    if (!module) return this.createDynamicPracticeQuestion(courseOutline)

    const prompt = `
    Generate a practice question for:

    Course: ${courseOutline.title}
    Module: ${module.title}
    Module Description: ${module.description}

    Create a multiple-choice question that tests understanding of the module content.
    Include:
    1. A clear, specific scenario
    2. A question that tests comprehension
    3. 3-4 answer options
    4. The correct answer with explanation

    Format as JSON:
    {
      "question": "Question text",
      "scenario": "Scenario description",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0,
      "explanation": "Explanation of correct answer"
    }
    `

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 512,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!generatedText) {
        throw new Error('No content generated')
      }

      return JSON.parse(generatedText)
    } catch (error) {
      console.error('Error generating practice question:', error)
      return this.createDynamicPracticeQuestion(courseOutline)
    }
  }

  // Create dynamic practice question based on course outline
  private createDynamicPracticeQuestion(courseOutline: any) {
    const topic = courseOutline.title.replace('Introduction to ', '').toLowerCase()
    
    // Create topic-specific questions
    let question = `Which approach would be most effective for learning ${topic}?`
    let scenario = `You want to master ${topic} and apply it to solve real-world problems.`
    let options = [
      "Hands-on practice with projects",
      "Theoretical study only",
      "Reading documentation",
      "Watching tutorials without practice"
    ]
    let explanation = `Hands-on practice with projects is the most effective way to learn ${topic} as it combines theory with practical application.`
    
    // Customize questions based on topic
    if (topic.includes('solar system') || topic.includes('astronomy')) {
      question = "Which planet is closest to the Sun in our solar system?"
      scenario = "You're studying the structure and organization of our solar system."
      options = [
        "Mercury",
        "Venus", 
        "Earth",
        "Mars"
      ]
      explanation = "Mercury is the closest planet to the Sun, with an average distance of about 36 million miles."
    } else if (topic.includes('biology')) {
      question = "What is the basic unit of life?"
      scenario = "You're learning about the fundamental structures that make up living organisms."
      options = [
        "Cell",
        "Tissue",
        "Organ",
        "Organism"
      ]
      explanation = "The cell is the basic unit of life - all living organisms are made up of one or more cells."
    } else if (topic.includes('chemistry')) {
      question = "What is the smallest unit of an element that retains its properties?"
      scenario = "You're studying the fundamental building blocks of matter."
      options = [
        "Atom",
        "Molecule",
        "Compound",
        "Element"
      ]
      explanation = "An atom is the smallest unit of an element that retains the chemical properties of that element."
    }
    
    return {
      question,
      scenario,
      options,
      correctAnswer: 0,
      explanation
    }
  }

  // Generate AI tutor response
  async generateTutorResponse(
    question: string, 
    document: any, 
    concision: 'brief' | 'detailed' = 'detailed',
    level: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ) {
    // If no API key, return dynamic content
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      console.log('No valid API key found, using dynamic tutor response')
      return this.createDynamicTutorResponse(question, document, concision, level)
    }

    const prompt = `
    You are an AI tutor helping a student learn from their document. Please answer their question based on the document content.

    Document Title: ${document.title}
    Document Type: ${document.type}
    Document Description: ${document.previewText}
    Document Tags: ${document.tags.join(', ')}

    Student Question: ${question}

    Response Requirements:
    - Concision Level: ${concision === 'brief' ? 'Keep it concise and to the point' : 'Provide detailed explanations with examples'}
    - Difficulty Level: ${level === 'beginner' ? 'Use simple language and basic concepts' : level === 'intermediate' ? 'Use moderate complexity' : 'Use advanced concepts and terminology'}
    - Be helpful and educational
    - If the question is not related to the document, politely redirect them
    - Provide specific examples when possible
    - Cite relevant parts of the document

    Please provide a helpful response that directly addresses their question.
    `

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!generatedText) {
        throw new Error('No content generated')
      }

      return {
        text: generatedText,
        citations: this.generateMockCitations(document)
      }
    } catch (error) {
      console.error('Error generating tutor response:', error)
      return this.createDynamicTutorResponse(question, document, concision, level)
    }
  }

  // Create dynamic tutor response when AI is not available
  private createDynamicTutorResponse(
    question: string, 
    document: any, 
    concision: 'brief' | 'detailed',
    level: 'beginner' | 'intermediate' | 'advanced'
  ) {
    const topic = document.title.replace('Introduction to ', '').toLowerCase()
    
    let response = ''
    
    // Generate topic-specific responses
    if (topic.includes('solar system') || topic.includes('astronomy')) {
      if (question.toLowerCase().includes('planet')) {
        response = concision === 'brief' 
          ? 'The solar system has 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.'
          : 'Our solar system contains eight planets that orbit the Sun. The inner planets (Mercury, Venus, Earth, Mars) are rocky, while the outer planets (Jupiter, Saturn, Uranus, Neptune) are gas giants. Each planet has unique characteristics and orbits at different distances from the Sun.'
      } else if (question.toLowerCase().includes('sun')) {
        response = concision === 'brief'
          ? 'The Sun is the star at the center of our solar system.'
          : 'The Sun is a G-type main-sequence star that provides light and heat to all planets in our solar system. It contains about 99.86% of the solar system\'s mass and is primarily composed of hydrogen and helium.'
      } else {
        response = concision === 'brief'
          ? 'The solar system is our cosmic neighborhood containing the Sun, planets, moons, asteroids, and comets.'
          : 'The solar system is a gravitationally bound system consisting of the Sun and all objects that orbit it. This includes eight planets, their moons, asteroids, comets, and other celestial bodies. Understanding the solar system helps us comprehend our place in the universe.'
      }
    } else if (topic.includes('python')) {
      if (question.toLowerCase().includes('variable')) {
        response = concision === 'brief'
          ? 'Variables in Python store data values.'
          : 'Variables in Python are containers for storing data values. Unlike other languages, Python doesn\'t require explicit declaration of variables. You simply assign a value to a variable name using the assignment operator (=).'
      } else if (question.toLowerCase().includes('function')) {
        response = concision === 'brief'
          ? 'Functions are reusable blocks of code in Python.'
          : 'Functions in Python are defined using the def keyword. They allow you to organize code into reusable blocks, making your programs more modular and easier to maintain. Functions can accept parameters and return values.'
      } else {
        response = concision === 'brief'
          ? 'Python is a versatile programming language known for its simplicity and readability.'
          : 'Python is a high-level, interpreted programming language known for its simple syntax and powerful capabilities. It\'s widely used in web development, data science, artificial intelligence, and automation.'
      }
    } else {
      // Generic response
      response = concision === 'brief'
        ? `Based on the document "${document.title}", here's a brief answer to your question.`
        : `Based on the document "${document.title}", I can help explain this concept. The document covers ${topic} and provides comprehensive information about the subject matter.`
    }

    return {
      text: response,
      citations: this.generateMockCitations(document)
    }
  }

  // Generate mock citations for responses
  private generateMockCitations(document: any) {
    return [
      {
        id: '1',
        itemId: document.id,
        text: document.previewText,
        locations: [{ type: document.type, refId: document.id, page: 1 }],
        embeddingSim: 0.85,
        topic: 'Introduction'
      }
    ]
  }

  // Generate document summary
  async generateDocumentSummary(document: any) {
    // If no API key, return dynamic content
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      console.log('No valid API key found, using dynamic summary')
      return this.createDynamicSummary(document)
    }

    const prompt = `
    Generate a comprehensive summary for the following document:

    Document Title: ${document.title}
    Document Type: ${document.type}
    Document Description: ${document.previewText}
    Document Tags: ${document.tags.join(', ')}

    Please provide:
    1. A brief TL;DR (2-3 sentences)
    2. 3-5 key bullet points
    3. A syllabus outline with 4-6 main sections

    Format as JSON:
    {
      "tldr": "Brief summary",
      "bullets": ["Key point 1", "Key point 2", "Key point 3"],
      "syllabusOutline": ["Section 1", "Section 2", "Section 3", "Section 4"]
    }
    `

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!generatedText) {
        throw new Error('No content generated')
      }

      return JSON.parse(generatedText)
    } catch (error) {
      console.error('Error generating summary:', error)
      return this.createDynamicSummary(document)
    }
  }

  // Create dynamic summary when AI is not available
  private createDynamicSummary(document: any) {
    const topic = document.title.replace('Introduction to ', '').toLowerCase()
    
    let tldr = ''
    let bullets: string[] = []
    let syllabusOutline: string[] = []
    
    if (topic.includes('solar system') || topic.includes('astronomy')) {
      tldr = 'This document provides a comprehensive introduction to our solar system, covering the Sun, planets, moons, and other celestial bodies that make up our cosmic neighborhood.'
      bullets = [
        'The solar system consists of the Sun and all objects that orbit it',
        'There are eight planets: four inner rocky planets and four outer gas giants',
        'Moons, asteroids, and comets are important components of the solar system',
        'Understanding planetary motion and gravitational forces',
        'The solar system formed from a rotating cloud of gas and dust'
      ]
      syllabusOutline = [
        'Introduction to the Solar System',
        'The Sun: Our Central Star',
        'Inner Planets: Mercury, Venus, Earth, Mars',
        'Outer Planets: Jupiter, Saturn, Uranus, Neptune',
        'Moons, Asteroids, and Comets',
        'Formation and Evolution of the Solar System'
      ]
    } else if (topic.includes('python')) {
      tldr = 'This document covers Python programming fundamentals, including syntax, data types, control structures, functions, and object-oriented programming concepts.'
      bullets = [
        'Python is a high-level, interpreted programming language',
        'Simple syntax makes Python easy to learn and read',
        'Supports multiple programming paradigms including OOP',
        'Extensive standard library and third-party packages',
        'Widely used in web development, data science, and AI'
      ]
      syllabusOutline = [
        'Introduction to Python',
        'Variables and Data Types',
        'Control Structures and Loops',
        'Functions and Modules',
        'Object-Oriented Programming',
        'File Handling and Error Management'
      ]
    } else {
      tldr = `This document provides a comprehensive introduction to ${topic}, covering fundamental concepts, practical applications, and advanced topics.`
      bullets = [
        `Understanding core ${topic} concepts`,
        `Practical applications and real-world examples`,
        `Key principles and methodologies`,
        `Advanced techniques and best practices`,
        `Future trends and developments`
      ]
      syllabusOutline = [
        'Introduction and Overview',
        'Core Concepts and Fundamentals',
        'Practical Applications',
        'Advanced Topics',
        'Best Practices and Methodologies',
        'Conclusion and Future Directions'
      ]
    }

    return {
      tldr,
      bullets,
      syllabusOutline
    }
  }

  // Generate quiz questions
  async generateQuizQuestions(document: any, questionCount: number) {
    // If no API key, return dynamic content
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      console.log('No valid API key found, using dynamic quiz questions')
      return this.createDynamicQuizQuestions(document, questionCount)
    }

    const prompt = `
    Generate ${questionCount} multiple-choice quiz questions based on the following document:

    Document Title: ${document.title}
    Document Type: ${document.type}
    Document Description: ${document.previewText}
    Document Tags: ${document.tags.join(', ')}

    Requirements:
    - Create questions of varying difficulty (easy, medium, hard)
    - Include 4 options for each question
    - Provide explanations for correct answers
    - Make questions relevant to the document content

    Format as JSON array:
    [
      {
        "question": "Question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 0,
        "explanation": "Explanation of correct answer",
        "difficulty": "easy|medium|hard",
        "tags": ["tag1", "tag2"]
      }
    ]
    `

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2048,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!generatedText) {
        throw new Error('No content generated')
      }

      return JSON.parse(generatedText)
    } catch (error) {
      console.error('Error generating quiz questions:', error)
      return this.createDynamicQuizQuestions(document, questionCount)
    }
  }

  // Create dynamic quiz questions when AI is not available
  private createDynamicQuizQuestions(document: any, questionCount: number) {
    const topic = document.title.replace('Introduction to ', '').toLowerCase()
    const questions = []
    
    for (let i = 0; i < questionCount; i++) {
      let question = ''
      let options: string[] = []
      let correctIndex = 0
      let explanation = ''
      let difficulty: 'easy' | 'medium' | 'hard' = 'medium'
      let tags: string[] = []
      
      if (topic.includes('solar system') || topic.includes('astronomy')) {
        const solarQuestions = [
          {
            question: "Which planet is closest to the Sun?",
            options: ["Mercury", "Venus", "Earth", "Mars"],
            correctIndex: 0,
            explanation: "Mercury is the closest planet to the Sun, with an average distance of about 36 million miles.",
            difficulty: 'easy' as const,
            tags: ['planets', 'solar-system']
          },
          {
            question: "What type of star is the Sun?",
            options: ["Red dwarf", "G-type main sequence", "Blue giant", "White dwarf"],
            correctIndex: 1,
            explanation: "The Sun is a G-type main-sequence star, also known as a yellow dwarf.",
            difficulty: 'medium' as const,
            tags: ['sun', 'stars']
          },
          {
            question: "Which planet has the most moons?",
            options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
            correctIndex: 1,
            explanation: "Saturn has the most moons in our solar system, with over 80 confirmed moons.",
            difficulty: 'hard' as const,
            tags: ['moons', 'planets']
          }
        ]
        
        const questionData = solarQuestions[i % solarQuestions.length]
        question = questionData.question
        options = questionData.options
        correctIndex = questionData.correctIndex
        explanation = questionData.explanation
        difficulty = questionData.difficulty
        tags = questionData.tags
      } else if (topic.includes('python')) {
        const pythonQuestions = [
          {
            question: "What is the correct way to create a variable in Python?",
            options: ["var x = 5", "x = 5", "int x = 5", "declare x = 5"],
            correctIndex: 1,
            explanation: "In Python, you simply assign a value to a variable name using the assignment operator (=).",
            difficulty: 'easy' as const,
            tags: ['variables', 'syntax']
          },
          {
            question: "Which keyword is used to define a function in Python?",
            options: ["function", "def", "func", "define"],
            correctIndex: 1,
            explanation: "The 'def' keyword is used to define a function in Python.",
            difficulty: 'medium' as const,
            tags: ['functions', 'syntax']
          },
          {
            question: "What is the output of print(type([]))?",
            options: ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "Error"],
            correctIndex: 0,
            explanation: "The type() function returns the type of an object. An empty list [] has type 'list'.",
            difficulty: 'hard' as const,
            tags: ['data-types', 'functions']
          }
        ]
        
        const questionData = pythonQuestions[i % pythonQuestions.length]
        question = questionData.question
        options = questionData.options
        correctIndex = questionData.correctIndex
        explanation = questionData.explanation
        difficulty = questionData.difficulty
        tags = questionData.tags
      } else {
        question = `What is the main focus of ${topic}?`
        options = [
          `Understanding ${topic} concepts`,
          `Learning advanced techniques`,
          `Practical applications`,
          `Historical background`
        ]
        correctIndex = 0
        explanation = `The main focus is understanding the fundamental concepts of ${topic}.`
        difficulty = 'easy'
        tags = ['concepts', topic.replace(/\s+/g, '-')]
      }
      
      questions.push({
        question,
        options,
        correctIndex,
        explanation,
        difficulty,
        tags
      })
    }
    
    return questions
  }

  // Generate flashcards
  async generateFlashcards(document: any, cardCount: number) {
    // If no API key, return dynamic content
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      console.log('No valid API key found, using dynamic flashcards')
      return this.createDynamicFlashcards(document, cardCount)
    }

    const prompt = `
    Generate ${cardCount} flashcards based on the following document:

    Document Title: ${document.title}
    Document Type: ${document.type}
    Document Description: ${document.previewText}
    Document Tags: ${document.tags.join(', ')}

    Requirements:
    - Create question-answer pairs
    - Cover key concepts and definitions
    - Make questions clear and concise
    - Provide detailed answers

    Format as JSON array:
    [
      {
        "front": "Question or term",
        "back": "Answer or definition"
      }
    ]
    `

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1536,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!generatedText) {
        throw new Error('No content generated')
      }

      return JSON.parse(generatedText)
    } catch (error) {
      console.error('Error generating flashcards:', error)
      return this.createDynamicFlashcards(document, cardCount)
    }
  }

  // Create dynamic flashcards when AI is not available
  private createDynamicFlashcards(document: any, cardCount: number) {
    const topic = document.title.replace('Introduction to ', '').toLowerCase()
    const cards = []
    
    for (let i = 0; i < cardCount; i++) {
      let front = ''
      let back = ''
      
      if (topic.includes('solar system') || topic.includes('astronomy')) {
        const solarCards = [
          { front: "What is the Sun?", back: "The Sun is a G-type main-sequence star at the center of our solar system." },
          { front: "How many planets are in our solar system?", back: "There are 8 planets in our solar system." },
          { front: "What are the inner planets?", back: "The inner planets are Mercury, Venus, Earth, and Mars - all rocky planets." },
          { front: "What are the outer planets?", back: "The outer planets are Jupiter, Saturn, Uranus, and Neptune - all gas giants." },
          { front: "What is an asteroid?", back: "An asteroid is a small rocky object that orbits the Sun, mostly found in the asteroid belt." }
        ]
        
        const cardData = solarCards[i % solarCards.length]
        front = cardData.front
        back = cardData.back
      } else if (topic.includes('python')) {
        const pythonCards = [
          { front: "What is Python?", back: "Python is a high-level, interpreted programming language known for its simple syntax." },
          { front: "How do you create a variable in Python?", back: "You assign a value to a variable name using the assignment operator (=)." },
          { front: "What keyword defines a function?", back: "The 'def' keyword is used to define a function in Python." },
          { front: "What is a list in Python?", back: "A list is a collection of items that are ordered and changeable, written with square brackets." },
          { front: "What is the difference between == and =?", back: "== is used for comparison, while = is used for assignment." }
        ]
        
        const cardData = pythonCards[i % pythonCards.length]
        front = cardData.front
        back = cardData.back
      } else {
        front = `What is ${topic}?`
        back = `${topic.charAt(0).toUpperCase() + topic.slice(1)} is a field of study that covers fundamental concepts and practical applications.`
      }
      
      cards.push({ front, back })
    }
    
    return cards
  }

  // Helper methods for assessment interpretation
  private getFamiliarityLevel(index: number): string {
    const levels = [
      'Complete beginner - new to this topic',
      'Some familiarity - heard of these concepts before',
      'Moderately familiar - understand the basics',
      'Very familiar - have good knowledge of this area'
    ]
    return levels[index] || 'Unknown'
  }

  private getLearningGoal(index: number): string {
    const goals = [
      'Get a general overview of the topic',
      'Understand specific concepts deeply',
      'Prepare for an exam or certification',
      'Apply knowledge in a practical project'
    ]
    return goals[index] || 'Unknown'
  }

  private getLearningStyle(index: number): string {
    const styles = [
      'Step-by-step explanations with examples',
      'Visual diagrams and infographics',
      'Interactive exercises and practice',
      'Real-world case studies and applications'
    ]
    return styles[index] || 'Unknown'
  }

  private getExperienceLevel(index: number): string {
    const levels = [
      'No prior experience',
      'Basic understanding from other courses',
      'Intermediate knowledge from work/study',
      'Advanced understanding from multiple sources'
    ]
    return levels[index] || 'Unknown'
  }

  private getTimeCommitment(index: number): string {
    const commitments = [
      '15-30 minutes per session',
      '30-60 minutes per session',
      '1-2 hours per session',
      'More than 2 hours per session'
    ]
    return commitments[index] || 'Unknown'
  }

  private getPace(index: number): string {
    const paces = ['Slow & Steady', 'Moderate Pace', 'Fast Track']
    return paces[index] || 'Moderate Pace'
  }

  private getTeachingStyle(index: number): string {
    const styles = ['Visual', 'Text-based', 'Interactive']
    return styles[index] || 'Interactive'
  }

  private getSessionLength(index: number): string {
    const lengths = ['Short (15-30 min)', 'Medium (30-60 min)', 'Long (60+ min)']
    return lengths[index] || 'Medium (30-60 min)'
  }

  // Create dynamic content based on user input
  private createDynamicContent(courseData: any, assessmentResults: any, preferences: any) {
    console.log('Creating dynamic content with:', { courseData, assessmentResults, preferences })
    
    // Extract topic from user input
    let topic = 'Learning'
    let description = 'A personalized learning experience'
    
    // Check file names for topics
    if (courseData.files && courseData.files.length > 0) {
      const firstFile = courseData.files[0]
      const fileName = firstFile.name.toLowerCase()
      
      console.log('Analyzing file name:', fileName)
      
      // Programming topics
      if (fileName.includes('python')) {
        topic = 'Python Programming'
        description = 'A comprehensive introduction to Python programming concepts and applications'
      } else if (fileName.includes('javascript') || fileName.includes('js')) {
        topic = 'JavaScript Development'
        description = 'A comprehensive introduction to JavaScript development concepts and applications'
      } else if (fileName.includes('react')) {
        topic = 'React Development'
        description = 'A comprehensive introduction to React development concepts and applications'
      } else if (fileName.includes('vue')) {
        topic = 'Vue.js Development'
        description = 'A comprehensive introduction to Vue.js development concepts and applications'
      } else if (fileName.includes('data') || fileName.includes('analytics')) {
        topic = 'Data Science'
        description = 'A comprehensive introduction to data science concepts and applications'
      } else if (fileName.includes('web') || fileName.includes('html') || fileName.includes('css')) {
        topic = 'Web Development'
        description = 'A comprehensive introduction to web development concepts and applications'
      } else if (fileName.includes('machine') || fileName.includes('ai') || fileName.includes('ml')) {
        topic = 'Machine Learning'
        description = 'A comprehensive introduction to machine learning concepts and applications'
      }
      // Science topics
      else if (fileName.includes('solar') || fileName.includes('system') || fileName.includes('planet') || fileName.includes('space') || fileName.includes('astronomy')) {
        topic = 'Solar System & Astronomy'
        description = 'A comprehensive introduction to solar system and astronomy concepts'
      } else if (fileName.includes('biology') || fileName.includes('life') || fileName.includes('cell') || fileName.includes('organism')) {
        topic = 'Biology'
        description = 'A comprehensive introduction to biology concepts and applications'
      } else if (fileName.includes('chemistry') || fileName.includes('chemical') || fileName.includes('molecule')) {
        topic = 'Chemistry'
        description = 'A comprehensive introduction to chemistry concepts and applications'
      } else if (fileName.includes('physics') || fileName.includes('force') || fileName.includes('energy') || fileName.includes('motion')) {
        topic = 'Physics'
        description = 'A comprehensive introduction to physics concepts and applications'
      } else if (fileName.includes('math') || fileName.includes('mathematics') || fileName.includes('algebra') || fileName.includes('calculus')) {
        topic = 'Mathematics'
        description = 'A comprehensive introduction to mathematics concepts and applications'
      } else if (fileName.includes('history') || fileName.includes('historical') || fileName.includes('ancient')) {
        topic = 'History'
        description = 'A comprehensive introduction to history concepts and applications'
      } else if (fileName.includes('geography') || fileName.includes('earth') || fileName.includes('climate')) {
        topic = 'Geography'
        description = 'A comprehensive introduction to geography concepts and applications'
      } else if (fileName.includes('literature') || fileName.includes('english') || fileName.includes('writing')) {
        topic = 'Literature & English'
        description = 'A comprehensive introduction to literature and English concepts'
      } else if (fileName.includes('art') || fileName.includes('drawing') || fileName.includes('painting')) {
        topic = 'Art & Design'
        description = 'A comprehensive introduction to art and design concepts'
      } else if (fileName.includes('music') || fileName.includes('instrument') || fileName.includes('sound')) {
        topic = 'Music'
        description = 'A comprehensive introduction to music concepts and applications'
      }
      
      console.log('Detected topic from file name:', topic)
    }
    
    // Check description for topics
    if (courseData.description) {
      const desc = courseData.description.toLowerCase()
      console.log('Analyzing description:', desc)
      
      // Programming topics
      if (desc.includes('python')) {
        topic = 'Python Programming'
        description = 'A comprehensive introduction to Python programming concepts and applications'
      } else if (desc.includes('javascript') || desc.includes('js')) {
        topic = 'JavaScript Development'
        description = 'A comprehensive introduction to JavaScript development concepts and applications'
      } else if (desc.includes('react')) {
        topic = 'React Development'
        description = 'A comprehensive introduction to React development concepts and applications'
      } else if (desc.includes('vue')) {
        topic = 'Vue.js Development'
        description = 'A comprehensive introduction to Vue.js development concepts and applications'
      } else if (desc.includes('data science') || desc.includes('analytics')) {
        topic = 'Data Science'
        description = 'A comprehensive introduction to data science concepts and applications'
      } else if (desc.includes('web development') || desc.includes('html') || desc.includes('css')) {
        topic = 'Web Development'
        description = 'A comprehensive introduction to web development concepts and applications'
      } else if (desc.includes('machine learning') || desc.includes('ai') || desc.includes('ml')) {
        topic = 'Machine Learning'
        description = 'A comprehensive introduction to machine learning concepts and applications'
      }
      // Science topics
      else if (desc.includes('solar system') || desc.includes('solar') || desc.includes('planet') || desc.includes('space') || desc.includes('astronomy')) {
        topic = 'Solar System & Astronomy'
        description = 'A comprehensive introduction to solar system and astronomy concepts'
      } else if (desc.includes('biology') || desc.includes('life') || desc.includes('cell') || desc.includes('organism')) {
        topic = 'Biology'
        description = 'A comprehensive introduction to biology concepts and applications'
      } else if (desc.includes('chemistry') || desc.includes('chemical') || desc.includes('molecule')) {
        topic = 'Chemistry'
        description = 'A comprehensive introduction to chemistry concepts and applications'
      } else if (desc.includes('physics') || desc.includes('force') || desc.includes('energy') || desc.includes('motion')) {
        topic = 'Physics'
        description = 'A comprehensive introduction to physics concepts and applications'
      } else if (desc.includes('math') || desc.includes('mathematics') || desc.includes('algebra') || desc.includes('calculus')) {
        topic = 'Mathematics'
        description = 'A comprehensive introduction to mathematics concepts and applications'
      } else if (desc.includes('history') || desc.includes('historical') || desc.includes('ancient')) {
        topic = 'History'
        description = 'A comprehensive introduction to history concepts and applications'
      } else if (desc.includes('geography') || desc.includes('earth') || desc.includes('climate')) {
        topic = 'Geography'
        description = 'A comprehensive introduction to geography concepts and applications'
      } else if (desc.includes('literature') || desc.includes('english') || desc.includes('writing')) {
        topic = 'Literature & English'
        description = 'A comprehensive introduction to literature and English concepts'
      } else if (desc.includes('art') || desc.includes('drawing') || desc.includes('painting')) {
        topic = 'Art & Design'
        description = 'A comprehensive introduction to art and design concepts'
      } else if (desc.includes('music') || desc.includes('instrument') || desc.includes('sound')) {
        topic = 'Music'
        description = 'A comprehensive introduction to music concepts and applications'
      }
      
      console.log('Detected topic from description:', topic)
    }
    
    // Check links for topics
    if (courseData.links) {
      const link = courseData.links.toLowerCase()
      console.log('Analyzing link:', link)
      
      if (link.includes('python')) {
        topic = 'Python Programming'
        description = 'A comprehensive introduction to Python programming concepts and applications'
      } else if (link.includes('javascript') || link.includes('js')) {
        topic = 'JavaScript Development'
        description = 'A comprehensive introduction to JavaScript development concepts and applications'
      } else if (link.includes('react')) {
        topic = 'React Development'
        description = 'A comprehensive introduction to React development concepts and applications'
      } else if (link.includes('vue')) {
        topic = 'Vue.js Development'
        description = 'A comprehensive introduction to Vue.js development concepts and applications'
      } else if (link.includes('solar') || link.includes('system') || link.includes('planet') || link.includes('space') || link.includes('astronomy')) {
        topic = 'Solar System & Astronomy'
        description = 'A comprehensive introduction to solar system and astronomy concepts'
      }
      
      console.log('Detected topic from link:', topic)
    }
    
    // If still no topic detected, try to extract from file name more intelligently
    if (topic === 'Learning' && courseData.files && courseData.files.length > 0) {
      const firstFile = courseData.files[0]
      const fileName = firstFile.name.toLowerCase()
      
      // Remove common file extensions and words
      const cleanName = fileName
        .replace(/\.(pdf|doc|docx|ppt|pptx|txt)$/, '')
        .replace(/\b(the|a|an|and|or|but|in|on|at|to|for|of|with|by)\b/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      
      console.log('Cleaned file name for topic extraction:', cleanName)
      
      // Use the cleaned name as topic if it's meaningful
      if (cleanName.length > 3 && cleanName !== 'document' && cleanName !== 'file') {
        topic = cleanName.split(' ').map((word: string) => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
        description = `A comprehensive introduction to ${cleanName} concepts and applications`
        console.log('Extracted topic from cleaned file name:', topic)
      }
    }
    
    // Adjust content based on assessment results
    const experienceLevel = this.getExperienceLevel(assessmentResults[3])
    const learningGoal = this.getLearningGoal(assessmentResults[1])
    
    // Adjust difficulty and content based on experience
    let difficulty = 'Intermediate'
    if (experienceLevel.includes('Beginner') || experienceLevel.includes('No prior')) {
      difficulty = 'Beginner'
    } else if (experienceLevel.includes('Expert')) {
      difficulty = 'Advanced'
    }
    
    // Adjust objectives based on learning goal
    let objectives = [
      `Understand core ${topic.toLowerCase()} concepts`,
      `Learn practical applications of ${topic.toLowerCase()}`,
      `Apply ${topic.toLowerCase()} principles to real-world problems`
    ]
    
    if (learningGoal.includes('exam') || learningGoal.includes('certification')) {
      objectives = [
        `Master ${topic.toLowerCase()} fundamentals for certification`,
        `Understand exam-relevant ${topic.toLowerCase()} concepts`,
        `Apply ${topic.toLowerCase()} knowledge in test scenarios`
      ]
    } else if (learningGoal.includes('project')) {
      objectives = [
        `Build practical ${topic.toLowerCase()} projects`,
        `Apply ${topic.toLowerCase()} concepts to real projects`,
        `Develop hands-on ${topic.toLowerCase()} skills`
      ]
    }
    
    return {
      title: `Introduction to ${topic}`,
      description: description,
      objectives: objectives,
      modules: [
        {
          title: "Introduction & Fundamentals",
          description: `Core concepts and terminology in ${topic.toLowerCase()}`,
          lessons: [
            {
              title: "Course Overview",
              description: "Learning objectives and course structure",
              duration: "5 minutes",
              type: "theory"
            },
            {
              title: "Key Concepts",
              description: `Core definitions and basic principles of ${topic.toLowerCase()}`,
              duration: "12 minutes",
              type: "theory"
            }
          ]
        },
        {
          title: "Core Material",
          description: `Essential ${topic.toLowerCase()} concepts and techniques`,
          lessons: [
            {
              title: "Advanced Concepts",
              description: `Deeper understanding of ${topic.toLowerCase()} principles`,
              duration: "15 minutes",
              type: "theory"
            },
            {
              title: "Practical Applications",
              description: `Real-world examples and use cases`,
              duration: "20 minutes",
              type: "practice"
            }
          ]
        }
      ],
      totalDuration: "1 hour 15 minutes",
      difficulty: difficulty
    }
  }

  // Fallback content when AI generation fails
  private getFallbackCourseOutline() {
    // Try to create a more dynamic fallback based on user input
    const courseData = JSON.parse(sessionStorage.getItem('trialCourseData') || '{}')
    const description = courseData.description || 'machine learning'
    
    // Extract topic from description or file names
    let topic = 'Machine Learning'
    if (courseData.description) {
      // Simple keyword extraction
      const keywords = ['python', 'javascript', 'react', 'vue', 'data science', 'web development', 'programming']
      const foundKeyword = keywords.find(keyword => 
        courseData.description.toLowerCase().includes(keyword)
      )
      if (foundKeyword) {
        topic = foundKeyword.charAt(0).toUpperCase() + foundKeyword.slice(1)
      }
    }
    
    if (courseData.files && courseData.files.length > 0) {
      const firstFile = courseData.files[0]
      if (firstFile.name.toLowerCase().includes('python')) topic = 'Python Programming'
      else if (firstFile.name.toLowerCase().includes('javascript')) topic = 'JavaScript Development'
      else if (firstFile.name.toLowerCase().includes('react')) topic = 'React Development'
      else if (firstFile.name.toLowerCase().includes('vue')) topic = 'Vue.js Development'
    }

    return {
      title: `Introduction to ${topic}`,
      description: `A comprehensive introduction to ${topic.toLowerCase()} concepts and applications based on your uploaded materials.`,
      objectives: [
        `Understand core ${topic.toLowerCase()} concepts`,
        `Learn practical applications of ${topic.toLowerCase()}`,
        `Apply ${topic.toLowerCase()} principles to real-world problems`
      ],
      modules: [
        {
          title: "Introduction & Fundamentals",
          description: `Core concepts and terminology in ${topic.toLowerCase()}`,
          lessons: [
            {
              title: "Course Overview",
              description: "Learning objectives and course structure",
              duration: "5 minutes",
              type: "theory"
            },
            {
              title: "Key Concepts",
              description: `Core definitions and basic principles of ${topic.toLowerCase()}`,
              duration: "12 minutes",
              type: "theory"
            }
          ]
        },
        {
          title: "Core Material",
          description: `Essential ${topic.toLowerCase()} concepts and techniques`,
          lessons: [
            {
              title: "Advanced Concepts",
              description: `Deeper understanding of ${topic.toLowerCase()} principles`,
              duration: "15 minutes",
              type: "theory"
            },
            {
              title: "Practical Applications",
              description: `Real-world examples and use cases`,
              duration: "20 minutes",
              type: "practice"
            }
          ]
        }
      ],
      totalDuration: "1 hour 15 minutes"
    }
  }

  private getFallbackSampleLesson() {
    const courseData = JSON.parse(sessionStorage.getItem('trialCourseData') || '{}')
    const description = courseData.description || 'machine learning'
    
    // Extract topic for dynamic content
    let topic = 'Machine Learning'
    if (courseData.description) {
      const keywords = ['python', 'javascript', 'react', 'vue', 'data science', 'web development', 'programming']
      const foundKeyword = keywords.find(keyword => 
        courseData.description.toLowerCase().includes(keyword)
      )
      if (foundKeyword) {
        topic = foundKeyword.charAt(0).toUpperCase() + foundKeyword.slice(1)
      }
    }

    return {
      introduction: `Welcome to this lesson on ${topic.toLowerCase()} fundamentals.`,
      content: `${topic} is a powerful field that enables us to solve complex problems and create intelligent systems.`,
      keyConcepts: [topic, "Core Principles", "Practical Applications"],
      examples: [
        `${topic} in real-world applications`,
        "Common use cases and scenarios",
        "Best practices and techniques"
      ],
      keyInsights: [`Understanding ${topic.toLowerCase()} is essential for modern problem-solving.`]
    }
  }

  private getFallbackPracticeQuestion() {
    const courseData = JSON.parse(sessionStorage.getItem('trialCourseData') || '{}')
    const description = courseData.description || 'machine learning'
    
    // Extract topic for dynamic content
    let topic = 'Machine Learning'
    if (courseData.description) {
      const keywords = ['python', 'javascript', 'react', 'vue', 'data science', 'web development', 'programming']
      const foundKeyword = keywords.find(keyword => 
        courseData.description.toLowerCase().includes(keyword)
      )
      if (foundKeyword) {
        topic = foundKeyword.charAt(0).toUpperCase() + foundKeyword.slice(1)
      }
    }

    return {
      question: `Which approach would be most effective for learning ${topic.toLowerCase()}?`,
      scenario: `You want to master ${topic.toLowerCase()} and apply it to solve real-world problems.`,
      options: [
        "Hands-on practice with projects",
        "Theoretical study only",
        "Reading documentation",
        "Watching tutorials without practice"
      ],
      correctAnswer: 0,
      explanation: `Hands-on practice with projects is the most effective way to learn ${topic.toLowerCase()} as it combines theory with practical application.`
    }
  }
}

export const aiContentService = new AIContentService()
