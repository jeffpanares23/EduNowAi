import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, Plan } from '@/app/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  const signIn = async (email: string, password: string): Promise<boolean> => {
    isLoading.value = true
    try {
      // Mock authentication - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email,
        planId: 'free',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      }
      
      user.value = mockUser
      localStorage.setItem('user', JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error('Sign in failed:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    isLoading.value = true
    try {
      // Mock registration - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: '1',
        name,
        email,
        planId: 'free',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      }
      
      user.value = mockUser
      localStorage.setItem('user', JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error('Sign up failed:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const signOut = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  const updatePlan = (planId: Plan['id']) => {
    if (user.value) {
      user.value.planId = planId
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  const updateUser = (updates: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  const initializeAuth = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('user')
      }
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updatePlan,
    updateUser,
    initializeAuth
  }
})
