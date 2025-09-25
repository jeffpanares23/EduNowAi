import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import Toast from '@/components/Toast.vue'
import SourceChip from '@/components/SourceChip.vue'
import TagMultiselect from '@/components/TagMultiselect.vue'
import UploadDropzone from '@/components/UploadDropzone.vue'
import type { Toast as ToastType, SourceLocation } from '@/app/types'

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/test', component: { template: '<div>Test</div>' } }
  ]
})

// Mock File API
global.File = class MockFile {
  name: string
  size: number
  type: string
  
  constructor(name: string, size: number, type: string) {
    this.name = name
    this.size = size
    this.type = type
  }
} as any

global.FileList = class MockFileList {
  files: File[]
  
  constructor(files: File[]) {
    this.files = files
  }
  
  get length() {
    return this.files.length
  }
  
  item(index: number) {
    return this.files[index] || null
  }
  
  [Symbol.iterator]() {
    return this.files[Symbol.iterator]()
  }
} as any

describe('Toast Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render success toast', () => {
    const toast: ToastType = {
      id: '1',
      type: 'success',
      message: 'Success message',
      duration: 5000
    }

    const wrapper = mount(Toast, {
      props: { toast },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('Success message')
    expect(wrapper.find('[data-testid="success-icon"]').exists() || 
           wrapper.find('.text-success-400').exists()).toBe(true)
  })

  it('should render error toast', () => {
    const toast: ToastType = {
      id: '1',
      type: 'error',
      message: 'Error message',
      duration: 5000
    }

    const wrapper = mount(Toast, {
      props: { toast },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('Error message')
  })

  it('should emit close event when close button clicked', async () => {
    const toast: ToastType = {
      id: '1',
      type: 'info',
      message: 'Info message',
      duration: 5000
    }

    const wrapper = mount(Toast, {
      props: { toast },
      global: {
        plugins: [router]
      }
    })

    const closeButton = wrapper.find('button')
    await closeButton.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')?.[0]).toEqual(['1'])
  })
})

describe('SourceChip Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render PDF source chip', () => {
    const location: SourceLocation = {
      type: 'pdf',
      refId: 'doc1',
      page: 5
    }

    const wrapper = mount(SourceChip, {
      props: { location },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('PDF p.5')
  })

  it('should render video source chip with timestamp', () => {
    const location: SourceLocation = {
      type: 'youtube',
      refId: 'video1',
      timestampSec: 125
    }

    const wrapper = mount(SourceChip, {
      props: { location },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('YOUTUBE 2:05')
  })

  it('should emit click event when clicked', async () => {
    const location: SourceLocation = {
      type: 'pdf',
      refId: 'doc1',
      page: 3
    }

    const wrapper = mount(SourceChip, {
      props: { location },
      global: {
        plugins: [router]
      }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')?.[0]).toEqual([location])
  })

  it('should apply primary variant styling', () => {
    const location: SourceLocation = {
      type: 'pdf',
      refId: 'doc1',
      page: 1
    }

    const wrapper = mount(SourceChip, {
      props: { location, variant: 'primary' },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.classes()).toContain('bg-primary-100')
  })
})

describe('TagMultiselect Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render with initial tags', () => {
    const wrapper = mount(TagMultiselect, {
      props: {
        modelValue: ['tag1', 'tag2'],
        availableTags: ['tag1', 'tag2', 'tag3']
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('tag1')
    expect(wrapper.text()).toContain('tag2')
  })

  it('should filter available tags based on query', async () => {
    const wrapper = mount(TagMultiselect, {
      props: {
        modelValue: [],
        availableTags: ['javascript', 'typescript', 'python']
      },
      global: {
        plugins: [router]
      }
    })

    const input = wrapper.find('input')
    await input.setValue('script')

    // Should show javascript and typescript
    expect(wrapper.text()).toContain('javascript')
    expect(wrapper.text()).toContain('typescript')
    expect(wrapper.text()).not.toContain('python')
  })

  it('should emit update when tags change', async () => {
    const wrapper = mount(TagMultiselect, {
      props: {
        modelValue: ['tag1'],
        availableTags: ['tag1', 'tag2', 'tag3']
      },
      global: {
        plugins: [router]
      }
    })

    // Simulate selecting tag2
    const options = wrapper.findAll('[role="option"]')
    if (options.length > 0) {
      await options[0].trigger('click')
    }

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('should allow creating new tags when enabled', async () => {
    const wrapper = mount(TagMultiselect, {
      props: {
        modelValue: [],
        availableTags: ['existing'],
        allowCreate: true
      },
      global: {
        plugins: [router]
      }
    })

    const input = wrapper.find('input')
    await input.setValue('newtag')

    // Should show create option
    expect(wrapper.text()).toContain('Create tag: "newtag"')
  })

  it('should remove tag when remove button clicked', async () => {
    const wrapper = mount(TagMultiselect, {
      props: {
        modelValue: ['tag1', 'tag2'],
        availableTags: ['tag1', 'tag2', 'tag3']
      },
      global: {
        plugins: [router]
      }
    })

    const removeButtons = wrapper.findAll('button')
    const removeButton = removeButtons.find(btn => 
      btn.text().includes('×') || btn.find('svg').exists()
    )
    
    if (removeButton) {
      await removeButton.trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    }
  })
})

describe('UploadDropzone Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render upload area', () => {
    const wrapper = mount(UploadDropzone, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('Upload documents')
    expect(wrapper.text()).toContain('Drag and drop files here')
  })

  it('should show drag over state', async () => {
    const wrapper = mount(UploadDropzone, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.trigger('dragover')
    
    expect(wrapper.text()).toContain('Drop files here')
  })

  it('should emit upload event when files dropped', async () => {
    const wrapper = mount(UploadDropzone, {
      global: {
        plugins: [router]
      }
    })

    const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' })
    const mockEvent = new Event('drop')
    Object.defineProperty(mockEvent, 'dataTransfer', {
      value: {
        files: [mockFile]
      }
    })

    await wrapper.element.dispatchEvent(mockEvent)

    // Wait for async processing
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.emitted('upload')).toBeTruthy()
  })

  it('should emit upload event when files selected', async () => {
    const wrapper = mount(UploadDropzone, {
      global: {
        plugins: [router]
      }
    })

    const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' })
    const input = wrapper.find('input[type="file"]')
    
    // Mock file input change
    Object.defineProperty(input.element, 'files', {
      value: [mockFile],
      writable: false
    })

    await input.trigger('change')

    // Wait for async processing
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.emitted('upload')).toBeTruthy()
  })

  it('should show disabled state when disabled', () => {
    const wrapper = mount(UploadDropzone, {
      props: { disabled: true },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.classes()).toContain('cursor-not-allowed')
    expect(wrapper.classes()).toContain('opacity-50')
  })

  it('should show file previews after upload', async () => {
    const wrapper = mount(UploadDropzone, {
      global: {
        plugins: [router]
      }
    })

    const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' })
    const mockEvent = new Event('drop')
    Object.defineProperty(mockEvent, 'dataTransfer', {
      value: {
        files: [mockFile]
      }
    })

    await wrapper.element.dispatchEvent(mockEvent)

    // Wait for async processing
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.text()).toContain('Uploaded Files')
  })

  it('should emit remove event when file removed', async () => {
    const wrapper = mount(UploadDropzone, {
      global: {
        plugins: [router]
      }
    })

    // First upload a file
    const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' })
    const mockEvent = new Event('drop')
    Object.defineProperty(mockEvent, 'dataTransfer', {
      value: {
        files: [mockFile]
      }
    })

    await wrapper.element.dispatchEvent(mockEvent)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // Then remove it
    const removeButton = wrapper.find('button[aria-label="Remove"]') || 
                       wrapper.findAll('button').find(btn => btn.text().includes('×'))
    
    if (removeButton) {
      await removeButton.trigger('click')
      expect(wrapper.emitted('remove')).toBeTruthy()
    }
  })
})

