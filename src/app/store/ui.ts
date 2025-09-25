import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Toast, Dialog } from '@/app/types'

export const useUiStore = defineStore('ui', () => {
  const isDarkMode = ref(false)
  const language = ref('en')
  const toasts = ref<Toast[]>([])
  const dialogs = ref<Dialog[]>([])
  const sidebarOpen = ref(false)
  const isLoading = ref(false)

  const initializeTheme = () => {
    const stored = localStorage.getItem('darkMode')
    if (stored !== null) {
      isDarkMode.value = stored === 'true'
    } else {
      // Default to system preference
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    updateTheme()
  }

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('darkMode', isDarkMode.value.toString())
    updateTheme()
  }

  const updateTheme = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const setLanguage = (lang: string) => {
    language.value = lang
    localStorage.setItem('language', lang)
  }

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString()
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast
    }
    
    toasts.value.push(newToast)
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const showDialog = (dialog: Omit<Dialog, 'id'>) => {
    const id = Date.now().toString()
    const newDialog: Dialog = {
      id,
      ...dialog
    }
    
    dialogs.value.push(newDialog)
    return id
  }

  const removeDialog = (id: string) => {
    const index = dialogs.value.findIndex(d => d.id === id)
    if (index !== -1) {
      dialogs.value.splice(index, 1)
    }
  }

  const confirm = (message: string, title = 'Confirm'): Promise<boolean> => {
    return new Promise((resolve) => {
      const dialogId = showDialog({
        type: 'confirm',
        title,
        message,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        onConfirm: () => {
          removeDialog(dialogId)
          resolve(true)
        },
        onCancel: () => {
          removeDialog(dialogId)
          resolve(false)
        }
      })
    })
  }

  const alert = (message: string, title = 'Alert'): Promise<void> => {
    return new Promise((resolve) => {
      const dialogId = showDialog({
        type: 'alert',
        title,
        message,
        confirmText: 'OK',
        onConfirm: () => {
          removeDialog(dialogId)
          resolve()
        }
      })
    })
  }

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const closeSidebar = () => {
    sidebarOpen.value = false
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const showSuccess = (message: string) => {
    showToast({ type: 'success', message })
  }

  const showError = (message: string) => {
    showToast({ type: 'error', message })
  }

  const showWarning = (message: string) => {
    showToast({ type: 'warning', message })
  }

  const showInfo = (message: string) => {
    showToast({ type: 'info', message })
  }

  return {
    isDarkMode,
    language,
    toasts,
    dialogs,
    sidebarOpen,
    isLoading,
    initializeTheme,
    toggleDarkMode,
    setLanguage,
    showToast,
    removeToast,
    showDialog,
    removeDialog,
    confirm,
    alert,
    toggleSidebar,
    closeSidebar,
    setLoading,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
})
