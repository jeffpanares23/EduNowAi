import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IngestedItem, ContentType } from '@/app/types'

export const useLibraryStore = defineStore('library', () => {
  const items = ref<IngestedItem[]>([])
  const isLoading = ref(false)
  const searchQuery = ref('')
  const selectedType = ref<ContentType | 'all'>('all')
  const selectedTags = ref<string[]>([])

  const filteredItems = computed(() => {
    let filtered = items.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.previewText.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    if (selectedType.value !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType.value)
    }

    if (selectedTags.value.length > 0) {
      filtered = filtered.filter(item => 
        selectedTags.value.some(tag => item.tags.includes(tag))
      )
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  })

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    items.value.forEach(item => {
      item.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  })

  const getItemById = (id: string) => {
    return items.value.find(item => item.id === id)
  }

  const addItem = (item: IngestedItem) => {
    items.value.unshift(item)
  }

  const updateItem = (id: string, updates: Partial<IngestedItem>) => {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      items.value[index] = { ...items.value[index], ...updates }
    }
  }

  const deleteItem = (id: string) => {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  const updateItemTags = (id: string, tags: string[]) => {
    updateItem(id, { tags })
  }

  const bulkUpdateTags = (itemIds: string[], tagsToAdd: string[], tagsToRemove: string[]) => {
    itemIds.forEach(id => {
      const item = getItemById(id)
      if (item) {
        const newTags = [...item.tags]
        
        // Add new tags
        tagsToAdd.forEach(tag => {
          if (!newTags.includes(tag)) {
            newTags.push(tag)
          }
        })
        
        // Remove specified tags
        const filteredTags = newTags.filter(tag => !tagsToRemove.includes(tag))
        
        updateItem(id, { tags: filteredTags })
      }
    })
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const setSelectedType = (type: ContentType | 'all') => {
    selectedType.value = type
  }

  const setSelectedTags = (tags: string[]) => {
    selectedTags.value = tags
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedType.value = 'all'
    selectedTags.value = []
  }

  const addTrialCourse = (courseData: any, courseOutline: any) => {
    // Generate a unique ID for the course
    const courseId = `trial-course-${Date.now()}`
    
    // Extract topic from course outline title
    const topic = courseOutline.title.replace('Introduction to ', '').toLowerCase()
    
    // Generate tags based on the topic
    const tags = [topic.replace(/\s+/g, '-'), 'trial-course', 'ai-generated']
    
    // Add more specific tags based on topic
    if (topic.includes('solar system') || topic.includes('astronomy')) {
      tags.push('science', 'space', 'astronomy')
    } else if (topic.includes('python')) {
      tags.push('programming', 'python', 'coding')
    } else if (topic.includes('javascript')) {
      tags.push('programming', 'javascript', 'web-development')
    } else if (topic.includes('react')) {
      tags.push('programming', 'react', 'frontend')
    } else if (topic.includes('biology')) {
      tags.push('science', 'biology', 'life-sciences')
    } else if (topic.includes('chemistry')) {
      tags.push('science', 'chemistry', 'physical-sciences')
    } else if (topic.includes('physics')) {
      tags.push('science', 'physics', 'physical-sciences')
    } else if (topic.includes('math')) {
      tags.push('mathematics', 'math', 'quantitative')
    } else if (topic.includes('history')) {
      tags.push('history', 'social-sciences', 'humanities')
    } else if (topic.includes('geography')) {
      tags.push('geography', 'earth-sciences', 'social-sciences')
    } else if (topic.includes('literature')) {
      tags.push('literature', 'english', 'humanities')
    } else if (topic.includes('art')) {
      tags.push('art', 'design', 'creative')
    } else if (topic.includes('music')) {
      tags.push('music', 'arts', 'creative')
    }
    
    // Create the library item
    const libraryItem: IngestedItem = {
      id: courseId,
      title: courseOutline.title,
      type: 'text', // Treat trial courses as text content
      createdAt: new Date().toISOString(),
      sizeKB: Math.floor(Math.random() * 500) + 100, // Mock size
      tags: tags,
      previewText: courseOutline.description || `A comprehensive course on ${topic} covering key concepts and practical applications.`,
      status: 'ready'
    }
    
    // Add to library
    addItem(libraryItem)
    
    console.log('Added trial course to library:', libraryItem)
    return libraryItem
  }

  return {
    items,
    isLoading,
    searchQuery,
    selectedType,
    selectedTags,
    filteredItems,
    allTags,
    getItemById,
    addItem,
    updateItem,
    deleteItem,
    updateItemTags,
    bulkUpdateTags,
    setSearchQuery,
    setSelectedType,
    setSelectedTags,
    clearFilters,
    addTrialCourse
  }
})
