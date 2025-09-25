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
    clearFilters
  }
})
