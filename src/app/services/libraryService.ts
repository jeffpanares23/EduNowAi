import type { IngestedItem, ContentType } from '@/app/types'

export class LibraryService {
  async getItems(): Promise<IngestedItem[]> {
    await this.delay(800)
    return this.mockItems
  }

  async getItemById(id: string): Promise<IngestedItem | null> {
    await this.delay(400)
    return this.mockItems.find(item => item.id === id) || null
  }

  async uploadFile(file: File, metadata: {
    title: string
    type: ContentType
    tags: string[]
  }): Promise<IngestedItem> {
    await this.delay(1200)
    
    const newItem: IngestedItem = {
      id: Date.now().toString(),
      title: metadata.title,
      type: metadata.type,
      createdAt: new Date().toISOString(),
      sizeKB: Math.round(file.size / 1024),
      tags: metadata.tags,
      previewText: `Preview text for ${metadata.title}...`,
      status: 'processing'
    }

    // Simulate processing
    setTimeout(() => {
      newItem.status = 'ready'
    }, 2000)

    return newItem
  }

  async deleteItem(id: string): Promise<boolean> {
    await this.delay(600)
    return true
  }

  async updateItemTags(id: string, tags: string[]): Promise<boolean> {
    await this.delay(400)
    return true
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private mockItems: IngestedItem[] = [
    {
      id: '1',
      title: 'Introduction to Machine Learning',
      type: 'pdf',
      createdAt: '2024-01-15T10:30:00Z',
      sizeKB: 2048,
      tags: ['machine-learning', 'ai', 'statistics'],
      previewText: 'Machine learning is a subset of artificial intelligence that focuses on algorithms...',
      status: 'ready'
    },
    {
      id: '2',
      title: 'React Fundamentals Course',
      type: 'youtube',
      createdAt: '2024-01-14T14:20:00Z',
      durationSec: 3600,
      tags: ['react', 'javascript', 'frontend'],
      previewText: 'Learn the fundamentals of React including components, state, and props...',
      status: 'ready'
    },
    {
      id: '3',
      title: 'Database Design Principles',
      type: 'slides',
      createdAt: '2024-01-13T09:15:00Z',
      sizeKB: 1536,
      tags: ['database', 'sql', 'design'],
      previewText: 'Understanding database normalization, relationships, and optimization...',
      status: 'ready'
    },
    {
      id: '4',
      title: 'Podcast: Tech Trends 2024',
      type: 'audio',
      createdAt: '2024-01-12T16:45:00Z',
      durationSec: 2700,
      tags: ['technology', 'trends', 'podcast'],
      previewText: 'Discussion about emerging technologies and industry trends...',
      status: 'ready'
    },
    {
      id: '5',
      title: 'Python Data Analysis Guide',
      type: 'text',
      createdAt: '2024-01-11T11:30:00Z',
      sizeKB: 1024,
      tags: ['python', 'data-analysis', 'pandas'],
      previewText: 'Comprehensive guide to data analysis using Python and pandas...',
      status: 'ready'
    }
  ]
}
