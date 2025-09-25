<template>
  <div class="relative">
    <Combobox v-model="selectedTags" multiple>
      <div class="relative">
        <ComboboxInput
          class="input pr-10"
          :placeholder="placeholder"
          :display-value="() => ''"
          @change="query = $event.target.value"
        />
        <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon class="h-5 w-5 text-surface-400" aria-hidden="true" />
        </ComboboxButton>
      </div>

      <!-- Selected tags display -->
      <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2 mt-2">
        <span
          v-for="tag in selectedTags"
          :key="tag"
          class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
        >
          {{ tag }}
          <button
            type="button"
            class="flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-primary-200 dark:hover:bg-primary-800 focus:outline-none focus:bg-primary-200 dark:focus:bg-primary-800"
            @click="removeTag(tag)"
          >
            <XMarkIcon class="h-3 w-3" />
          </button>
        </span>
      </div>

      <TransitionRoot
        leave="transition ease-in duration-100"
        leave-from="opacity-100"
        leave-to="opacity-0"
        @after-leave="query = ''"
      >
        <ComboboxOptions
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-surface-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <div
            v-if="filteredTags.length === 0 && query !== ''"
            class="relative cursor-default select-none py-2 px-4 text-surface-700 dark:text-surface-300"
          >
            <span class="block">Create tag: "{{ query }}"</span>
            <button
              class="mt-1 text-xs text-primary-600 dark:text-primary-400 hover:underline"
              @click="createTag(query)"
            >
              Click to create
            </button>
          </div>

          <ComboboxOption
            v-for="tag in filteredTags"
            :key="tag"
            v-slot="{ selected, active }"
            as="template"
            :value="tag"
          >
            <li
              class="relative cursor-default select-none py-2 pl-10 pr-4"
              :class="{
                'bg-primary-600 text-white': active,
                'text-surface-900 dark:text-surface-100': !active,
              }"
            >
              <span
                class="block truncate"
                :class="{ 'font-medium': selected, 'font-normal': !selected }"
              >
                {{ tag }}
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
                :class="{ 'text-white': active, 'text-primary-600': !active }"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </Combobox>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/vue/20/solid'

const props = withDefaults(defineProps<{
  modelValue: string[]
  availableTags: string[]
  placeholder?: string
  allowCreate?: boolean
}>(), {
  placeholder: 'Select or create tags...',
  allowCreate: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const query = ref('')
const selectedTags = ref<string[]>([...props.modelValue])

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  selectedTags.value = [...newValue]
})

// Watch for internal changes and emit
watch(selectedTags, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

const filteredTags = computed(() => {
  const available = props.availableTags.filter(tag => !selectedTags.value.includes(tag))
  
  return query.value === ''
    ? available
    : available.filter((tag) =>
        tag
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, ''))
      )
})

const removeTag = (tag: string) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tag)
}

const createTag = (tagName: string) => {
  if (props.allowCreate && tagName.trim() && !selectedTags.value.includes(tagName.trim())) {
    selectedTags.value.push(tagName.trim())
    query.value = ''
  }
}
</script>
