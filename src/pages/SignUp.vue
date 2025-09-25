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
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-surface-600 dark:text-surface-400">
          Or
          <router-link to="/sign-in" class="font-medium text-primary-600 hover:text-primary-500">
            sign in to existing account
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Full name
            </label>
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              autocomplete="name"
              required
              class="input mt-1"
              placeholder="Enter your full name"
            />
          </div>
          
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
              autocomplete="new-password"
              required
              class="input mt-1"
              placeholder="Create a password"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              class="input mt-1"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="agree-terms"
            v-model="form.agreeToTerms"
            name="agree-terms"
            type="checkbox"
            required
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300 rounded"
          />
          <label for="agree-terms" class="ml-2 block text-sm text-surface-900 dark:text-surface-100">
            I agree to the
            <a href="#" class="text-primary-600 hover:text-primary-500">Terms of Service</a>
            and
            <a href="#" class="text-primary-600 hover:text-primary-500">Privacy Policy</a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="authStore.isLoading"
          >
            <div v-if="authStore.isLoading" class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating account...
            </div>
            <span v-else>Create account</span>
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-surface-600 dark:text-surface-400">
            Demo mode: any valid information will create an account
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/app/store/auth'
import { useUiStore } from '@/app/store/ui'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

const handleSubmit = async () => {
  if (!form.name || !form.email || !form.password || !form.confirmPassword) {
    uiStore.showError('Please fill in all fields')
    return
  }

  if (form.password !== form.confirmPassword) {
    uiStore.showError('Passwords do not match')
    return
  }

  if (!form.agreeToTerms) {
    uiStore.showError('Please agree to the terms and conditions')
    return
  }

  const success = await authStore.signUp(form.name, form.email, form.password)
  
  if (success) {
    uiStore.showSuccess('Account created successfully! Welcome to EduNow.AI!')
    router.push('/dashboard')
  } else {
    uiStore.showError('Account creation failed. Please try again.')
  }
}
</script>
