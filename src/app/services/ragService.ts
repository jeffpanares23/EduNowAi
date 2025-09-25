import type { Chunk, SourceLocation } from '@/app/types'

export class RAGService {
  async search(itemId: string, query: string): Promise<Chunk[]> {
    await this.delay(800)
    
    // Mock search results based on query
    const mockChunks = this.generateMockChunks(itemId, query)
    
    // Sort by embedding similarity (mock)
    return mockChunks.sort((a, b) => (b.embeddingSim || 0) - (a.embeddingSim || 0))
  }

  async getChunksByItem(itemId: string): Promise<Chunk[]> {
    await this.delay(600)
    return this.mockChunks.filter(chunk => chunk.itemId === itemId)
  }

  async getChunksByTopic(itemId: string, topic: string): Promise<Chunk[]> {
    await this.delay(500)
    return this.mockChunks.filter(chunk => 
      chunk.itemId === itemId && chunk.topic === topic
    )
  }

  private generateMockChunks(itemId: string, query: string): Chunk[] {
    const baseChunks = this.mockChunks.filter(chunk => chunk.itemId === itemId)
    
    // Simulate relevance scoring based on query keywords
    const queryWords = query.toLowerCase().split(' ')
    
    return baseChunks.map(chunk => ({
      ...chunk,
      embeddingSim: this.calculateMockSimilarity(chunk.text, queryWords)
    }))
  }

  private calculateMockSimilarity(text: string, queryWords: string[]): number {
    const textWords = text.toLowerCase().split(' ')
    let matches = 0
    
    queryWords.forEach(word => {
      if (textWords.some(textWord => textWord.includes(word))) {
        matches++
      }
    })
    
    return Math.min(0.95, matches / queryWords.length + Math.random() * 0.3)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private mockChunks: Chunk[] = [
    {
      id: 'chunk-1',
      itemId: '1',
      text: 'Machine learning algorithms can be broadly categorized into supervised, unsupervised, and reinforcement learning. Supervised learning uses labeled training data to learn a mapping from inputs to outputs.',
      locations: [{ type: 'pdf', refId: '1', page: 5 }],
      embeddingSim: 0.85,
      topic: 'Introduction'
    },
    {
      id: 'chunk-2',
      itemId: '1',
      text: 'Neural networks are inspired by biological neural networks and consist of interconnected nodes called neurons. Each neuron processes input signals and produces an output signal.',
      locations: [{ type: 'pdf', refId: '1', page: 12 }],
      embeddingSim: 0.78,
      topic: 'Neural Networks'
    },
    {
      id: 'chunk-3',
      itemId: '2',
      text: 'React components are the building blocks of React applications. They are reusable pieces of UI that can accept props and maintain their own state.',
      locations: [{ type: 'youtube', refId: '2', timestampSec: 300 }],
      embeddingSim: 0.92,
      topic: 'Components'
    },
    {
      id: 'chunk-4',
      itemId: '2',
      text: 'The useState hook allows functional components to manage local state. It returns an array with the current state value and a function to update it.',
      locations: [{ type: 'youtube', refId: '2', timestampSec: 600 }],
      embeddingSim: 0.88,
      topic: 'Hooks'
    },
    {
      id: 'chunk-5',
      itemId: '3',
      text: 'Database normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. The most common normal forms are 1NF, 2NF, and 3NF.',
      locations: [{ type: 'slides', refId: '3', page: 3 }],
      embeddingSim: 0.81,
      topic: 'Normalization'
    },
    {
      id: 'chunk-6',
      itemId: '4',
      text: 'Artificial intelligence is transforming industries across the globe. From healthcare to finance, AI applications are becoming increasingly sophisticated and widespread.',
      locations: [{ type: 'audio', refId: '4', timestampSec: 120 }],
      embeddingSim: 0.76,
      topic: 'AI Applications'
    },
    {
      id: 'chunk-7',
      itemId: '5',
      text: 'Pandas is a powerful Python library for data manipulation and analysis. It provides data structures like DataFrame and Series that make working with structured data intuitive.',
      locations: [{ type: 'text', refId: '5' }],
      embeddingSim: 0.89,
      topic: 'Pandas Basics'
    }
  ]
}
