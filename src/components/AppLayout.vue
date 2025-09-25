<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-900">
    <!-- Skip Links -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <a href="#main-navigation" class="skip-link">Skip to navigation</a>
    
    <!-- Top Navigation -->
    <nav 
      id="main-navigation"
      class="bg-white dark:bg-surface-800 shadow-sm border-b border-surface-200 dark:border-surface-700"
      role="navigation"
      aria-label="Main navigation"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left side -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <div class="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">E</span>
              </div>
              <span class="text-xl font-semibold text-surface-900 dark:text-surface-100">
                EduNow.AI
              </span>
            </router-link>
            
            <!-- Main navigation -->
            <div class="hidden md:ml-10 md:flex md:space-x-8">
              <router-link
                v-for="item in navigationItems"
                :key="item.name"
                :to="item.to"
                class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors"
                :class="isActiveRoute(item.to) 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200'"
              >
                <component :is="item.icon" class="h-4 w-4 mr-2" />
                {{ item.name }}
              </router-link>
            </div>
          </div>

          <!-- Right side -->
          <div class="flex items-center space-x-4">
            <!-- Language switcher -->
            <LanguageSwitcher />

            <!-- Dark mode toggle -->
            <button
              class="p-2 text-surface-400 hover:text-surface-500 dark:hover:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
              @click="uiStore.toggleDarkMode"
              :aria-label="uiStore.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              <SunIcon v-if="uiStore.isDarkMode" class="h-5 w-5" />
              <MoonIcon v-else class="h-5 w-5" />
            </button>

            <!-- User menu -->
            <Menu v-if="authStore.isAuthenticated" as="div" class="relative">
              <MenuButton class="flex items-center space-x-2 p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <img
                  class="h-8 w-8 rounded-full"
                  :src="authStore.user?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'"
                  :alt="authStore.user?.name"
                />
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
                  <MenuItem v-slot="{ active }">
                    <router-link
                      to="/account"
                      :class="[active ? 'bg-surface-100 dark:bg-surface-700' : '', 'block px-4 py-2 text-sm text-surface-700 dark:text-surface-300']"
                    >
                      Account Settings
                    </router-link>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[active ? 'bg-surface-100 dark:bg-surface-700' : '', 'block w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-surface-300']"
                      @click="handleSignOut"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>

            <!-- Sign in button for non-authenticated users -->
            <div v-else class="flex items-center space-x-2">
              <router-link to="/sign-in" class="btn-outline btn-sm">
                Sign In
              </router-link>
              <router-link to="/sign-up" class="btn-primary btn-sm">
                Sign Up
              </router-link>
            </div>

            <!-- Mobile menu button -->
            <button
              class="md:hidden p-2 text-surface-400 hover:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
              @click="uiStore.toggleSidebar"
            >
              <Bars3Icon class="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile sidebar -->
    <TransitionRoot as="template" :show="uiStore.sidebarOpen">
      <Dialog as="div" class="relative z-50 md:hidden" @close="uiStore.closeSidebar">
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-surface-600 bg-opacity-75" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-surface-900 px-6 pb-2">
                <div class="flex h-16 shrink-0 items-center">
                  <span class="text-xl font-semibold text-surface-900 dark:text-surface-100">
                    EduNow.AI
                  </span>
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigationItems" :key="item.name">
                          <router-link
                            :to="item.to"
                            :class="[
                              isActiveRoute(item.to)
                                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                                : 'text-surface-700 hover:text-primary-600 hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-800',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                            ]"
                            @click="uiStore.closeSidebar"
                          >
                            <component :is="item.icon" class="h-6 w-6 shrink-0" />
                            {{ item.name }}
                          </router-link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Main content -->
    <main id="main-content" role="main" aria-label="Main content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Dialog, DialogPanel, Menu, MenuButton, MenuItem, MenuItems, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  Bars3Icon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from '@heroicons/vue/24/outline'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useAuthStore } from '@/app/store/auth'
import { useUiStore } from '@/app/store/ui'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const navigationItems = computed(() => [
  { name: 'Library', to: '/library', icon: BookOpenIcon },
  { name: 'Tutor', to: '/tutor', icon: ChatBubbleLeftRightIcon },
  { name: 'Study', to: '/study', icon: AcademicCapIcon },
  { name: 'Analytics', to: '/analytics', icon: ChartBarIcon },
  { name: 'Pricing', to: '/pricing', icon: CurrencyDollarIcon },
])

const isActiveRoute = (path: string) => {
  return route.path.startsWith(path)
}

const handleSignOut = () => {
  authStore.signOut()
  uiStore.showSuccess('Signed out successfully')
  router.push('/')
}
</script>
