import { ref, onMounted, onUnmounted } from 'vue'

export function useFocusManagement() {
  const focusableElements = ref<HTMLElement[]>([])
  const currentIndex = ref(0)

  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    return Array.from(container.querySelectorAll(focusableSelectors))
  }

  const trapFocus = (container: HTMLElement) => {
    focusableElements.value = getFocusableElements(container)
    currentIndex.value = 0

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault()
        
        if (event.shiftKey) {
          currentIndex.value = currentIndex.value > 0 
            ? currentIndex.value - 1 
            : focusableElements.value.length - 1
        } else {
          currentIndex.value = currentIndex.value < focusableElements.value.length - 1 
            ? currentIndex.value + 1 
            : 0
        }

        focusableElements.value[currentIndex.value]?.focus()
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }

  const focusFirst = (container: HTMLElement) => {
    const elements = getFocusableElements(container)
    elements[0]?.focus()
  }

  const focusLast = (container: HTMLElement) => {
    const elements = getFocusableElements(container)
    elements[elements.length - 1]?.focus()
  }

  return {
    trapFocus,
    focusFirst,
    focusLast,
    getFocusableElements
  }
}

export function useKeyboardNavigation() {
  const handleArrowKeys = (event: KeyboardEvent, items: HTMLElement[]) => {
    const currentIndex = items.findIndex(item => item === document.activeElement)
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        const nextIndex = (currentIndex + 1) % items.length
        items[nextIndex]?.focus()
        break
      case 'ArrowUp':
        event.preventDefault()
        const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1
        items[prevIndex]?.focus()
        break
      case 'Home':
        event.preventDefault()
        items[0]?.focus()
        break
      case 'End':
        event.preventDefault()
        items[items.length - 1]?.focus()
        break
    }
  }

  const handleEscape = (callback: () => void) => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback()
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', handleKeyDown)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeyDown)
    })
  }

  return {
    handleArrowKeys,
    handleEscape
  }
}

export function useAnnouncer() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.textContent = message

    document.body.appendChild(announcer)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 1000)
  }

  return { announce }
}

export function useReducedMotion() {
  const prefersReducedMotion = ref(false)

  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches

    const handleChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion.value = event.matches
    }

    mediaQuery.addEventListener('change', handleChange)

    onUnmounted(() => {
      mediaQuery.removeEventListener('change', handleChange)
    })
  })

  return { prefersReducedMotion }
}

export function useHighContrast() {
  const prefersHighContrast = ref(false)

  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    prefersHighContrast.value = mediaQuery.matches

    const handleChange = (event: MediaQueryListEvent) => {
      prefersHighContrast.value = event.matches
    }

    mediaQuery.addEventListener('change', handleChange)

    onUnmounted(() => {
      mediaQuery.removeEventListener('change', handleChange)
    })
  })

  return { prefersHighContrast }
}

export function useScreenReader() {
  const isScreenReaderActive = ref(false)

  onMounted(() => {
    // Detect screen reader by checking for specific ARIA attributes or screen reader specific classes
    const hasScreenReader = document.querySelector('[aria-hidden="true"]') !== null ||
                           document.querySelector('.sr-only') !== null ||
                           window.speechSynthesis !== undefined

    isScreenReaderActive.value = hasScreenReader
  })

  return { isScreenReaderActive }
}

export function useSkipLinks() {
  const createSkipLink = (target: string, text: string) => {
    const skipLink = document.createElement('a')
    skipLink.href = `#${target}`
    skipLink.textContent = text
    skipLink.className = 'skip-link'
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 1000;
      border-radius: 4px;
    `
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px'
    })
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px'
    })

    return skipLink
  }

  return { createSkipLink }
}

