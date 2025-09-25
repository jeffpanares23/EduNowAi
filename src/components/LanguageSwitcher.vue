<template>
  <Menu as="div" class="relative">
    <MenuButton class="flex items-center space-x-2 p-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
      <span class="text-lg">{{ currentLocale.flag }}</span>
      <span class="text-sm font-medium text-surface-700 dark:text-surface-300">
        {{ currentLocale.name }}
      </span>
      <ChevronDownIcon class="h-4 w-4 text-surface-400" />
    </MenuButton>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-surface-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <MenuItem
          v-for="locale in locales"
          :key="locale.code"
          v-slot="{ active }"
        >
          <button
            :class="[
              active ? 'bg-surface-100 dark:bg-surface-700' : '',
              'flex items-center w-full px-4 py-2 text-sm text-surface-700 dark:text-surface-300',
              locale.code === currentLocale.code ? 'font-semibold' : ''
            ]"
            @click="setLocale(locale.code)"
          >
            <span class="text-lg mr-3">{{ locale.flag }}</span>
            {{ locale.name }}
            <CheckIcon
              v-if="locale.code === currentLocale.code"
              class="ml-auto h-4 w-4 text-primary-600"
            />
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { useI18n } from '@/app/composables/useI18n'

const { currentLocale, locales, setLocale } = useI18n()
</script>

