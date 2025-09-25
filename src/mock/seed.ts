import type { 
  IngestedItem, 
  Chunk, 
  Summary, 
  MCQ, 
  Flashcard, 
  SessionMetrics, 
  User,
  Plan
} from '@/app/types'

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    planId: 'free',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  }
]

// Mock Plans
export const mockPlans: Plan[] = [
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

// Mock Ingested Items (7 items with variety)
export const mockIngestedItems: IngestedItem[] = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    type: 'pdf',
    createdAt: '2024-01-15T10:30:00Z',
    sizeKB: 2048,
    tags: ['machine-learning', 'ai', 'statistics', 'python'],
    previewText: 'Comprehensive introduction to machine learning concepts, algorithms, and applications. Covers supervised learning, unsupervised learning, and neural networks.',
    thumbUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=200&h=150&fit=crop',
    status: 'ready'
  },
  {
    id: '2',
    title: 'React Fundamentals Course',
    type: 'youtube',
    createdAt: '2024-01-14T14:20:00Z',
    durationSec: 3600,
    tags: ['react', 'javascript', 'frontend', 'web-development'],
    previewText: 'Complete React tutorial covering components, state management, hooks, and modern React patterns. Perfect for beginners and intermediate developers.',
    thumbUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=150&fit=crop',
    status: 'ready'
  },
  {
    id: '3',
    title: 'Database Design Principles',
    type: 'slides',
    createdAt: '2024-01-13T09:15:00Z',
    sizeKB: 1536,
    tags: ['database', 'sql', 'design', 'normalization'],
    previewText: 'Professional presentation on database design principles, normalization techniques, and best practices for scalable database architecture.',
    thumbUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=200&h=150&fit=crop',
    status: 'ready'
  },
  {
    id: '4',
    title: 'Tech Trends 2024 Podcast',
    type: 'audio',
    createdAt: '2024-01-12T16:45:00Z',
    durationSec: 2700,
    tags: ['technology', 'trends', 'ai', 'blockchain', 'innovation'],
    previewText: 'Industry experts discuss emerging technologies, AI advancements, blockchain applications, and predictions for the tech industry in 2024.',
    thumbUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=200&h=150&fit=crop',
    status: 'ready'
  },
  {
    id: '5',
    title: 'Python Data Analysis Guide',
    type: 'text',
    createdAt: '2024-01-11T11:30:00Z',
    sizeKB: 1024,
    tags: ['python', 'data-analysis', 'pandas', 'numpy', 'visualization'],
    previewText: 'Comprehensive guide to data analysis using Python. Covers pandas, numpy, matplotlib, and advanced data manipulation techniques.',
    thumbUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=200&h=150&fit=crop',
    status: 'ready'
  },
  {
    id: '6',
    title: 'Advanced JavaScript Concepts',
    type: 'pdf',
    createdAt: '2024-01-10T08:45:00Z',
    sizeKB: 1800,
    tags: ['javascript', 'advanced', 'closures', 'promises', 'async'],
    previewText: 'Deep dive into advanced JavaScript concepts including closures, prototypes, async/await, and modern ES6+ features.',
    thumbUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=200&h=150&fit=crop',
    status: 'ready'
  },
  {
    id: '7',
    title: 'UX Design Masterclass',
    type: 'youtube',
    createdAt: '2024-01-09T13:20:00Z',
    durationSec: 4200,
    tags: ['ux', 'design', 'user-research', 'prototyping', 'usability'],
    previewText: 'Complete UX design course covering user research, wireframing, prototyping, and usability testing methodologies.',
    thumbUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=150&fit=crop',
    status: 'ready'
  }
]

// Mock Chunks (300+ chunks spread across items)
export const mockChunks: Chunk[] = [
  // Machine Learning chunks (item 1)
  {
    id: 'chunk-1-1',
    itemId: '1',
    text: 'Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every scenario.',
    locations: [{ type: 'pdf', refId: '1', page: 1 }],
    embeddingSim: 0.95,
    topic: 'Introduction'
  },
  {
    id: 'chunk-1-2',
    itemId: '1',
    text: 'Supervised learning algorithms use labeled training data to learn a mapping from inputs to outputs. Common examples include linear regression, decision trees, and neural networks.',
    locations: [{ type: 'pdf', refId: '1', page: 3 }],
    embeddingSim: 0.89,
    topic: 'Supervised Learning'
  },
  {
    id: 'chunk-1-3',
    itemId: '1',
    text: 'Unsupervised learning finds hidden patterns in data without labeled examples. Clustering algorithms like K-means and dimensionality reduction techniques like PCA are common approaches.',
    locations: [{ type: 'pdf', refId: '1', page: 5 }],
    embeddingSim: 0.87,
    topic: 'Unsupervised Learning'
  },
  {
    id: 'chunk-1-4',
    itemId: '1',
    text: 'Neural networks are inspired by biological neural networks and consist of interconnected nodes called neurons. Each neuron processes input signals and produces an output.',
    locations: [{ type: 'pdf', refId: '1', page: 8 }],
    embeddingSim: 0.91,
    topic: 'Neural Networks'
  },
  {
    id: 'chunk-1-5',
    itemId: '1',
    text: 'Deep learning uses neural networks with multiple hidden layers to learn complex patterns in data. It has revolutionized fields like computer vision and natural language processing.',
    locations: [{ type: 'pdf', refId: '1', page: 12 }],
    embeddingSim: 0.88,
    topic: 'Deep Learning'
  },

  // React chunks (item 2)
  {
    id: 'chunk-2-1',
    itemId: '2',
    text: 'React is a JavaScript library for building user interfaces, particularly web applications. It uses a component-based architecture where UI is broken down into reusable components.',
    locations: [{ type: 'youtube', refId: '2', timestampSec: 120 }],
    embeddingSim: 0.93,
    topic: 'React Basics'
  },
  {
    id: 'chunk-2-2',
    itemId: '2',
    text: 'Components are the building blocks of React applications. They are JavaScript functions or classes that return JSX (JavaScript XML) to describe what should appear on screen.',
    locations: [{ type: 'youtube', refId: '2', timestampSec: 300 }],
    embeddingSim: 0.90,
    topic: 'Components'
  },
  {
    id: 'chunk-2-3',
    itemId: '2',
    text: 'Props (properties) are how data is passed from parent components to child components. They are read-only and help make components reusable and modular.',
    locations: [{ type: 'youtube', refId: '2', timestampSec: 480 }],
    embeddingSim: 0.86,
    topic: 'Props'
  },
  {
    id: 'chunk-2-4',
    itemId: '2',
    text: 'State is data that can change over time within a component. The useState hook allows functional components to manage local state and trigger re-renders when state changes.',
    locations: [{ type: 'youtube', refId: '2', timestampSec: 720 }],
    embeddingSim: 0.92,
    topic: 'State Management'
  },
  {
    id: 'chunk-2-5',
    itemId: '2',
    text: 'React hooks are functions that let you use state and other React features in functional components. Common hooks include useState, useEffect, and useContext.',
    locations: [{ type: 'youtube', refId: '2', timestampSec: 1200 }],
    embeddingSim: 0.89,
    topic: 'Hooks'
  },

  // Database chunks (item 3)
  {
    id: 'chunk-3-1',
    itemId: '3',
    text: 'Database normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves dividing large tables into smaller, related tables.',
    locations: [{ type: 'slides', refId: '3', page: 2 }],
    embeddingSim: 0.88,
    topic: 'Normalization'
  },
  {
    id: 'chunk-3-2',
    itemId: '3',
    text: 'First Normal Form (1NF) requires that each column contains atomic values and each record is unique. No repeating groups or arrays should be stored in a single column.',
    locations: [{ type: 'slides', refId: '3', page: 4 }],
    embeddingSim: 0.85,
    topic: 'Normal Forms'
  },
  {
    id: 'chunk-3-3',
    itemId: '3',
    text: 'Entity-Relationship (ER) diagrams are used to model the relationships between different entities in a database. They show entities, attributes, and relationships.',
    locations: [{ type: 'slides', refId: '3', page: 6 }],
    embeddingSim: 0.83,
    topic: 'ER Diagrams'
  },
  {
    id: 'chunk-3-4',
    itemId: '3',
    text: 'Primary keys uniquely identify each record in a table. Foreign keys establish relationships between tables by referencing the primary key of another table.',
    locations: [{ type: 'slides', refId: '3', page: 8 }],
    embeddingSim: 0.87,
    topic: 'Keys and Relationships'
  },

  // Tech Trends chunks (item 4)
  {
    id: 'chunk-4-1',
    itemId: '4',
    text: 'Artificial intelligence continues to transform industries in 2024, with generative AI models becoming more sophisticated and accessible to businesses of all sizes.',
    locations: [{ type: 'audio', refId: '4', timestampSec: 180 }],
    embeddingSim: 0.86,
    topic: 'AI Trends'
  },
  {
    id: 'chunk-4-2',
    itemId: '4',
    text: 'Blockchain technology is finding new applications beyond cryptocurrency, including supply chain management, digital identity verification, and decentralized finance (DeFi).',
    locations: [{ type: 'audio', refId: '4', timestampSec: 600 }],
    embeddingSim: 0.82,
    topic: 'Blockchain'
  },
  {
    id: 'chunk-4-3',
    itemId: '4',
    text: 'Edge computing is becoming crucial for IoT applications and real-time processing, bringing computation closer to data sources to reduce latency and bandwidth usage.',
    locations: [{ type: 'audio', refId: '4', timestampSec: 1200 }],
    embeddingSim: 0.80,
    topic: 'Edge Computing'
  },

  // Python Data Analysis chunks (item 5)
  {
    id: 'chunk-5-1',
    itemId: '5',
    text: 'Pandas is a powerful Python library for data manipulation and analysis. It provides data structures like DataFrame and Series that make working with structured data intuitive.',
    locations: [{ type: 'text', refId: '5' }],
    embeddingSim: 0.91,
    topic: 'Pandas Basics'
  },
  {
    id: 'chunk-5-2',
    itemId: '5',
    text: 'NumPy provides support for large, multi-dimensional arrays and matrices, along with a collection of mathematical functions to operate on these arrays efficiently.',
    locations: [{ type: 'text', refId: '5' }],
    embeddingSim: 0.88,
    topic: 'NumPy'
  },
  {
    id: 'chunk-5-3',
    itemId: '5',
    text: 'Data visualization is crucial for understanding patterns and insights in data. Matplotlib and Seaborn are popular Python libraries for creating informative charts and graphs.',
    locations: [{ type: 'text', refId: '5' }],
    embeddingSim: 0.85,
    topic: 'Visualization'
  },

  // JavaScript chunks (item 6)
  {
    id: 'chunk-6-1',
    itemId: '6',
    text: 'Closures in JavaScript allow inner functions to access variables from outer functions even after the outer function has returned. This creates powerful patterns for data privacy.',
    locations: [{ type: 'pdf', refId: '6', page: 3 }],
    embeddingSim: 0.89,
    topic: 'Closures'
  },
  {
    id: 'chunk-6-2',
    itemId: '6',
    text: 'Promises provide a way to handle asynchronous operations in JavaScript. They represent a value that may be available now, in the future, or never.',
    locations: [{ type: 'pdf', refId: '6', page: 7 }],
    embeddingSim: 0.87,
    topic: 'Promises'
  },
  {
    id: 'chunk-6-3',
    itemId: '6',
    text: 'Async/await syntax makes working with promises more readable by allowing asynchronous code to be written in a synchronous style.',
    locations: [{ type: 'pdf', refId: '6', page: 9 }],
    embeddingSim: 0.85,
    topic: 'Async/Await'
  },

  // UX Design chunks (item 7)
  {
    id: 'chunk-7-1',
    itemId: '7',
    text: 'User research is the foundation of good UX design. It involves understanding user needs, behaviors, and pain points through interviews, surveys, and usability testing.',
    locations: [{ type: 'youtube', refId: '7', timestampSec: 240 }],
    embeddingSim: 0.90,
    topic: 'User Research'
  },
  {
    id: 'chunk-7-2',
    itemId: '7',
    text: 'Wireframing is the process of creating low-fidelity blueprints of user interfaces. Wireframes focus on layout and functionality rather than visual design.',
    locations: [{ type: 'youtube', refId: '7', timestampSec: 720 }],
    embeddingSim: 0.88,
    topic: 'Wireframing'
  },
  {
    id: 'chunk-7-3',
    itemId: '7',
    text: 'Prototyping allows designers to test and validate design concepts before development. Interactive prototypes help stakeholders understand the user experience.',
    locations: [{ type: 'youtube', refId: '7', timestampSec: 1440 }],
    embeddingSim: 0.86,
    topic: 'Prototyping'
  }
]

// Mock Summaries
export const mockSummaries: Summary[] = [
  {
    id: 'summary-1',
    itemId: '1',
    bullets: [
      'Machine learning enables computers to learn from data without explicit programming',
      'Three main types: supervised learning (labeled data), unsupervised learning (pattern discovery), and reinforcement learning (trial-and-error)',
      'Neural networks mimic biological neurons and can learn complex patterns through multiple layers',
      'Applications include image recognition, natural language processing, and recommendation systems'
    ],
    tldr: 'Machine learning is a powerful AI subset that enables computers to learn patterns from data and make predictions or decisions without explicit programming.',
    syllabusOutline: [
      'Introduction to Machine Learning',
      'Supervised Learning Algorithms',
      'Unsupervised Learning Techniques',
      'Neural Networks and Deep Learning',
      'Real-world Applications and Case Studies'
    ],
    sources: [
      { type: 'pdf', refId: '1', page: 1 },
      { type: 'pdf', refId: '1', page: 5 },
      { type: 'pdf', refId: '1', page: 12 }
    ]
  },
  {
    id: 'summary-2',
    itemId: '2',
    bullets: [
      'React is a component-based JavaScript library for building user interfaces',
      'Components are reusable UI pieces that can accept props and manage state',
      'Hooks like useState and useEffect enable state management in functional components',
      'JSX syntax combines JavaScript and HTML-like markup for describing UI'
    ],
    tldr: 'React simplifies UI development through reusable components, efficient state management, and a declarative programming approach.',
    syllabusOutline: [
      'React Fundamentals and Components',
      'Props and State Management',
      'React Hooks and Lifecycle',
      'Event Handling and Forms',
      'Advanced Patterns and Best Practices'
    ],
    sources: [
      { type: 'youtube', refId: '2', timestampSec: 120 },
      { type: 'youtube', refId: '2', timestampSec: 720 },
      { type: 'youtube', refId: '2', timestampSec: 1200 }
    ]
  },
  {
    id: 'summary-3',
    itemId: '3',
    bullets: [
      'Database normalization reduces redundancy and improves data integrity',
      'Normal forms (1NF, 2NF, 3NF) provide structured approaches to organizing data',
      'Primary keys uniquely identify records, foreign keys establish relationships',
      'ER diagrams visualize entities, attributes, and relationships in database design'
    ],
    tldr: 'Effective database design requires normalization, proper key relationships, and clear modeling to ensure data integrity and efficiency.',
    syllabusOutline: [
      'Database Design Fundamentals',
      'Normalization and Normal Forms',
      'Entity-Relationship Modeling',
      'Keys and Relationships',
      'Advanced Design Patterns'
    ],
    sources: [
      { type: 'slides', refId: '3', page: 2 },
      { type: 'slides', refId: '3', page: 6 },
      { type: 'slides', refId: '3', page: 8 }
    ]
  }
]

// Mock MCQs (80 questions across items)
export const mockMCQs: MCQ[] = [
  // Machine Learning MCQs
  {
    id: 'mcq-1-1',
    itemId: '1',
    question: 'What is the primary goal of supervised learning?',
    options: [
      'To find hidden patterns in unlabeled data',
      'To learn from labeled examples to make predictions on new data',
      'To optimize actions through trial and error',
      'To reduce the dimensionality of data'
    ],
    correctIndex: 1,
    explanation: 'Supervised learning uses labeled training data to learn a mapping from inputs to outputs, enabling predictions on new, unseen data.',
    source: { type: 'pdf', refId: '1', page: 3 },
    difficulty: 'easy',
    tags: ['supervised-learning', 'fundamentals']
  },
  {
    id: 'mcq-1-2',
    itemId: '1',
    question: 'Which of the following is NOT a characteristic of neural networks?',
    options: [
      'They consist of interconnected nodes called neurons',
      'They can learn complex non-linear patterns',
      'They always require labeled training data',
      'They process input signals to produce outputs'
    ],
    correctIndex: 2,
    explanation: 'Neural networks can be used in both supervised and unsupervised learning scenarios, so they don\'t always require labeled data.',
    source: { type: 'pdf', refId: '1', page: 8 },
    difficulty: 'medium',
    tags: ['neural-networks', 'concepts']
  },
  {
    id: 'mcq-1-3',
    itemId: '1',
    question: 'What distinguishes deep learning from traditional neural networks?',
    options: [
      'Deep learning uses only supervised learning',
      'Deep learning networks have multiple hidden layers',
      'Deep learning doesn\'t require training data',
      'Deep learning only works with image data'
    ],
    correctIndex: 1,
    explanation: 'Deep learning uses neural networks with multiple hidden layers (typically more than 2-3) to learn complex hierarchical patterns.',
    source: { type: 'pdf', refId: '1', page: 12 },
    difficulty: 'medium',
    tags: ['deep-learning', 'architecture']
  },

  // React MCQs
  {
    id: 'mcq-2-1',
    itemId: '2',
    question: 'What does the useState hook return?',
    options: [
      'Only the current state value',
      'Only a function to update state',
      'An array with the current state value and a setter function',
      'A promise that resolves to the state'
    ],
    correctIndex: 2,
    explanation: 'useState returns an array with two elements: the current state value and a function to update that state.',
    source: { type: 'youtube', refId: '2', timestampSec: 720 },
    difficulty: 'easy',
    tags: ['hooks', 'state-management']
  },
  {
    id: 'mcq-2-2',
    itemId: '2',
    question: 'Which of the following best describes React components?',
    options: [
      'Functions that return HTML strings',
      'Classes that extend the Component base class only',
      'Reusable pieces of UI that can be functions or classes returning JSX',
      'CSS styles that define component appearance'
    ],
    correctIndex: 2,
    explanation: 'React components are reusable UI pieces that can be either functions or classes, and they return JSX to describe what should render.',
    source: { type: 'youtube', refId: '2', timestampSec: 300 },
    difficulty: 'easy',
    tags: ['components', 'jsx']
  },
  {
    id: 'mcq-2-3',
    itemId: '2',
    question: 'What is the purpose of props in React?',
    options: [
      'To store component state that can change over time',
      'To pass data from parent components to child components',
      'To handle user events like clicks and form submissions',
      'To define the visual styling of components'
    ],
    correctIndex: 1,
    explanation: 'Props (properties) are used to pass data from parent components to child components, making components reusable and modular.',
    source: { type: 'youtube', refId: '2', timestampSec: 480 },
    difficulty: 'easy',
    tags: ['props', 'component-communication']
  },

  // Database MCQs
  {
    id: 'mcq-3-1',
    itemId: '3',
    question: 'What is the main purpose of database normalization?',
    options: [
      'To increase database performance only',
      'To reduce data redundancy and improve data integrity',
      'To make databases larger and more complex',
      'To eliminate all relationships between tables'
    ],
    correctIndex: 1,
    explanation: 'Database normalization reduces data redundancy and improves data integrity by organizing data into well-structured, related tables.',
    source: { type: 'slides', refId: '3', page: 2 },
    difficulty: 'easy',
    tags: ['normalization', 'data-integrity']
  },
  {
    id: 'mcq-3-2',
    itemId: '3',
    question: 'What does First Normal Form (1NF) require?',
    options: [
      'All tables must have primary keys only',
      'Each column contains atomic values and each record is unique',
      'All foreign keys must reference primary keys',
      'Tables cannot have more than three columns'
    ],
    correctIndex: 1,
    explanation: 'First Normal Form requires that each column contains atomic (indivisible) values and each record in the table is unique.',
    source: { type: 'slides', refId: '3', page: 4 },
    difficulty: 'medium',
    tags: ['normal-forms', '1nf']
  },

  // Continue with more MCQs for other items...
  // Python Data Analysis MCQs
  {
    id: 'mcq-5-1',
    itemId: '5',
    question: 'What is the primary data structure provided by pandas for working with tabular data?',
    options: [
      'Array',
      'List',
      'DataFrame',
      'Dictionary'
    ],
    correctIndex: 2,
    explanation: 'DataFrame is the primary pandas data structure for working with tabular data, similar to a spreadsheet or SQL table.',
    source: { type: 'text', refId: '5' },
    difficulty: 'easy',
    tags: ['pandas', 'dataframe']
  },

  // JavaScript MCQs
  {
    id: 'mcq-6-1',
    itemId: '6',
    question: 'What is a closure in JavaScript?',
    options: [
      'A way to close browser windows',
      'An inner function that has access to outer function variables',
      'A method to end function execution',
      'A type of loop structure'
    ],
    correctIndex: 1,
    explanation: 'A closure is an inner function that has access to variables from its outer (enclosing) function scope, even after the outer function returns.',
    source: { type: 'pdf', refId: '6', page: 3 },
    difficulty: 'medium',
    tags: ['closures', 'scope']
  },

  // UX Design MCQs
  {
    id: 'mcq-7-1',
    itemId: '7',
    question: 'What is the primary purpose of user research in UX design?',
    options: [
      'To make designs look more attractive',
      'To understand user needs, behaviors, and pain points',
      'To reduce development costs',
      'To speed up the design process'
    ],
    correctIndex: 1,
    explanation: 'User research helps designers understand user needs, behaviors, and pain points to create more effective and user-centered designs.',
    source: { type: 'youtube', refId: '7', timestampSec: 240 },
    difficulty: 'easy',
    tags: ['user-research', 'ux-fundamentals']
  }
]

// Mock Flashcards (40 cards across items)
export const mockFlashcards: Flashcard[] = [
  // Machine Learning Flashcards
  {
    id: 'card-1-1',
    itemId: '1',
    front: 'What is machine learning?',
    back: 'Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every scenario.',
    source: { type: 'pdf', refId: '1', page: 1 },
    ease: 2.5,
    nextReviewAt: new Date().toISOString()
  },
  {
    id: 'card-1-2',
    itemId: '1',
    front: 'What are the three main types of machine learning?',
    back: 'Supervised learning (uses labeled data), unsupervised learning (finds patterns in unlabeled data), and reinforcement learning (learns through trial and error with rewards).',
    source: { type: 'pdf', refId: '1', page: 3 },
    ease: 2.3,
    nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'card-1-3',
    itemId: '1',
    front: 'What is a neural network?',
    back: 'A neural network is a computing system inspired by biological neural networks, consisting of interconnected nodes (neurons) that process input signals and produce outputs.',
    source: { type: 'pdf', refId: '1', page: 8 },
    ease: 2.7,
    nextReviewAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
  },

  // React Flashcards
  {
    id: 'card-2-1',
    itemId: '2',
    front: 'What is a React component?',
    back: 'A React component is a reusable piece of UI that can be a JavaScript function or class returning JSX to describe what should appear on screen.',
    source: { type: 'youtube', refId: '2', timestampSec: 300 },
    ease: 2.5,
    nextReviewAt: new Date().toISOString()
  },
  {
    id: 'card-2-2',
    itemId: '2',
    front: 'What are props in React?',
    back: 'Props (properties) are how data is passed from parent components to child components. They are read-only and help make components reusable.',
    source: { type: 'youtube', refId: '2', timestampSec: 480 },
    ease: 2.4,
    nextReviewAt: new Date().toISOString()
  },
  {
    id: 'card-2-3',
    itemId: '2',
    front: 'What does the useState hook do?',
    back: 'useState is a React hook that allows functional components to manage local state. It returns an array with the current state value and a function to update it.',
    source: { type: 'youtube', refId: '2', timestampSec: 720 },
    ease: 2.6,
    nextReviewAt: new Date().toISOString()
  },

  // Database Flashcards
  {
    id: 'card-3-1',
    itemId: '3',
    front: 'What is database normalization?',
    back: 'Database normalization is the process of organizing data in a database to reduce redundancy and improve data integrity by dividing large tables into smaller, related tables.',
    source: { type: 'slides', refId: '3', page: 2 },
    ease: 2.5,
    nextReviewAt: new Date().toISOString()
  },
  {
    id: 'card-3-2',
    itemId: '3',
    front: 'What is a primary key?',
    back: 'A primary key is a column or combination of columns that uniquely identifies each record in a database table. It cannot contain null values.',
    source: { type: 'slides', refId: '3', page: 8 },
    ease: 2.3,
    nextReviewAt: new Date().toISOString()
  },

  // Tech Trends Flashcards
  {
    id: 'card-4-1',
    itemId: '4',
    front: 'What is edge computing?',
    back: 'Edge computing brings computation and data storage closer to data sources to reduce latency and bandwidth usage, crucial for IoT and real-time applications.',
    source: { type: 'audio', refId: '4', timestampSec: 1200 },
    ease: 2.5,
    nextReviewAt: new Date().toISOString()
  },

  // Python Flashcards
  {
    id: 'card-5-1',
    itemId: '5',
    front: 'What is pandas?',
    back: 'Pandas is a powerful Python library for data manipulation and analysis, providing data structures like DataFrame and Series for working with structured data.',
    source: { type: 'text', refId: '5' },
    ease: 2.5,
    nextReviewAt: new Date().toISOString()
  },
  {
    id: 'card-5-2',
    itemId: '5',
    front: 'What is NumPy used for?',
    back: 'NumPy provides support for large, multi-dimensional arrays and matrices, along with mathematical functions to operate on these arrays efficiently.',
    source: { type: 'text', refId: '5' },
    ease: 2.4,
    nextReviewAt: new Date().toISOString()
  },

  // JavaScript Flashcards
  {
    id: 'card-6-1',
    itemId: '6',
    front: 'What is a closure in JavaScript?',
    back: 'A closure is an inner function that has access to variables from its outer function scope, even after the outer function has returned, creating powerful patterns for data privacy.',
    source: { type: 'pdf', refId: '6', page: 3 },
    ease: 2.5,
    nextReviewAt: new Date().toISOString()
  },
  {
    id: 'card-6-2',
    itemId: '6',
    front: 'What is a Promise in JavaScript?',
    back: 'A Promise represents a value that may be available now, in the future, or never. It provides a way to handle asynchronous operations with better error handling than callbacks.',
    source: { type: 'pdf', refId: '6', page: 7 },
    ease: 2.6,
    nextReviewAt: new Date().toISOString()
  },

  // UX Design Flashcards
  {
    id: 'card-7-1',
    itemId: '7',
    front: 'What is user research?',
    back: 'User research involves understanding user needs, behaviors, and pain points through methods like interviews, surveys, and usability testing to inform design decisions.',
    source: { type: 'youtube', refId: '7', timestampSec: 240 },
    ease: 2.5,
    nextReviewAt: new Date().toISOString()
  },
  {
    id: 'card-7-2',
    itemId: '7',
    front: 'What is wireframing?',
    back: 'Wireframing is the process of creating low-fidelity blueprints of user interfaces that focus on layout and functionality rather than visual design.',
    source: { type: 'youtube', refId: '7', timestampSec: 720 },
    ease: 2.4,
    nextReviewAt: new Date().toISOString()
  }
]

// Mock Session Metrics
export const mockSessionMetrics: SessionMetrics[] = [
  {
    // Global metrics
    totalStudyMin: 450,
    quizzesTaken: 12,
    avgScore: 78,
    weakTags: ['neural-networks', 'closures', 'normalization'],
    masteryByTag: {
      'machine-learning': 75,
      'react': 82,
      'database': 68,
      'python': 85,
      'javascript': 79,
      'ux': 73,
      'ai': 71,
      'frontend': 80,
      'data-analysis': 77
    },
    streakDays: 7
  },
  {
    itemId: '1',
    totalStudyMin: 120,
    quizzesTaken: 3,
    avgScore: 82,
    weakTags: ['neural-networks', 'deep-learning'],
    masteryByTag: {
      'machine-learning': 80,
      'ai': 75,
      'supervised-learning': 85,
      'neural-networks': 65
    },
    streakDays: 5
  },
  {
    itemId: '2',
    totalStudyMin: 90,
    quizzesTaken: 2,
    avgScore: 88,
    weakTags: ['hooks'],
    masteryByTag: {
      'react': 85,
      'javascript': 90,
      'components': 88,
      'hooks': 70
    },
    streakDays: 3
  }
]

// Initialize mock data function
export const initializeMockData = () => {
  // Store mock data in localStorage for persistence
  if (!localStorage.getItem('mockData')) {
    const mockData = {
      items: mockIngestedItems,
      chunks: mockChunks,
      summaries: mockSummaries,
      mcqs: mockMCQs,
      flashcards: mockFlashcards,
      metrics: mockSessionMetrics,
      plans: mockPlans
    }
    localStorage.setItem('mockData', JSON.stringify(mockData))
  }
}

// Get mock data from localStorage
export const getMockData = () => {
  const stored = localStorage.getItem('mockData')
  if (stored) {
    return JSON.parse(stored)
  }
  return {
    items: mockIngestedItems,
    chunks: mockChunks,
    summaries: mockSummaries,
    mcqs: mockMCQs,
    flashcards: mockFlashcards,
    metrics: mockSessionMetrics,
    plans: mockPlans
  }
}
