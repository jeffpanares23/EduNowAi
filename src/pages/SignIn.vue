<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="flex items-center justify-center space-x-2 mb-6">
          <div class="h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">E</span>
          </div>
          <span class="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            EduNow.AI
          </span>
        </div>
        <h2 class="text-center text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-surface-600 dark:text-surface-400">
          Or
          <router-link to="/sign-up" class="font-medium text-primary-600 hover:text-primary-500">
            create a new account
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="input mt-1"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="input mt-1"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.remember"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-surface-900 dark:text-surface-100">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="authStore.isLoading"
          >
            <div v-if="authStore.isLoading" class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </div>
            <span v-else>Sign in</span>
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-surface-600 dark:text-surface-400">
            Demo credentials: any email/password combination will work
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/app/store/auth'
import { useUiStore } from '@/app/store/ui'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUiStore()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const handleSubmit = async () => {
  if (!form.email || !form.password) {
    uiStore.showError('Please fill in all fields')
    return
  }

  const success = await authStore.signIn(form.email, form.password)
  
  if (success) {
    uiStore.showSuccess('Welcome back!')
    const redirect = (route.query.redirect as string) || '/dashboard'
    router.push(redirect)
  } else {
    uiStore.showError('Sign in failed. Please try again.')
  }
}
</script>
