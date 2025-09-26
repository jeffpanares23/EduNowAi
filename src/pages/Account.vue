<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-100">
            Account Settings
          </h1>
          <p class="text-surface-600 dark:text-surface-400">
            Manage your profile, preferences, and subscription
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1">
          <nav class="space-y-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-left"
              :class="
                activeTab === tab.id
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-50 dark:hover:bg-surface-700'
              "
              @click="activeTab = tab.id"
            >
              <component :is="tab.icon" class="h-5 w-5 mr-3" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="space-y-6">
            <div class="card p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  Profile Information
                </h2>
                <button
                  v-if="!editingProfile"
                  class="btn-outline btn-sm"
                  @click="editingProfile = true"
                >
                  <PencilIcon class="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>

              <div class="flex items-center space-x-6 mb-6">
                <div class="relative">
                  <img
                    class="h-20 w-20 rounded-full object-cover"
                    :src="
                      authStore.user?.avatarUrl ||
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'
                    "
                    :alt="authStore.user?.name"
                  />
                  <button
                    v-if="editingProfile"
                    class="absolute -bottom-1 -right-1 bg-primary-600 text-white p-1.5 rounded-full hover:bg-primary-700"
                    @click="changeAvatar"
                  >
                    <CameraIcon class="h-4 w-4" />
                  </button>
                </div>
                <div v-if="!editingProfile">
                  <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100">
                    {{ authStore.user?.name }}
                  </h3>
                  <p class="text-surface-600 dark:text-surface-400">{{ authStore.user?.email }}</p>
                  <div class="flex items-center mt-2">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getPlanBadgeClasses(authStore.user?.planId)"
                    >
                      {{ authStore.user?.planId?.toUpperCase() || 'FREE' }} Plan
                    </span>
                  </div>
                </div>
              </div>

              <div v-if="editingProfile" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      v-model="profileForm.name"
                      type="text"
                      class="input"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2"
                    >
                      Email
                    </label>
                    <input
                      v-model="profileForm.email"
                      type="email"
                      class="input"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div class="flex justify-end space-x-3">
                  <button class="btn-outline" @click="cancelProfileEdit">Cancel</button>
                  <button
                    class="btn-primary"
                    @click="saveProfile"
                    :disabled="!profileForm.name.trim() || !profileForm.email.trim()"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Subscription Tab -->
          <div v-if="activeTab === 'subscription'">
            <SubscriptionManager />
          </div>

          <!-- Preferences Tab -->
          <div v-if="activeTab === 'preferences'" class="space-y-6">
            <div class="card p-6">
              <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-6">
                Learning Preferences
              </h2>

              <div class="space-y-6">
                <div>
                  <label
                    class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2"
                  >
                    Default AI Response Style
                  </label>
                  <select v-model="preferences.defaultConcisionMode" class="input">
                    <option value="brief">Brief - Concise answers</option>
                    <option value="detailed">Detailed - Comprehensive explanations</option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2"
                  >
                    Default Learning Level
                  </label>
                  <select v-model="preferences.defaultLevelMode" class="input">
                    <option value="beginner">Beginner - Simple explanations</option>
                    <option value="intermediate">Intermediate - Balanced approach</option>
                    <option value="advanced">Advanced - Technical depth</option>
                  </select>
                </div>

                <div>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      v-model="preferences.enableVoiceMode"
                      class="rounded border-surface-300 dark:border-surface-600 text-primary-600 focus:ring-primary-500"
                    />
                    <span class="ml-2 text-sm text-surface-700 dark:text-surface-300">
                      Enable voice mode by default
                    </span>
                  </label>
                </div>

                <div>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      v-model="preferences.emailNotifications"
                      class="rounded border-surface-300 dark:border-surface-600 text-primary-600 focus:ring-primary-500"
                    />
                    <span class="ml-2 text-sm text-surface-700 dark:text-surface-300">
                      Receive email notifications
                    </span>
                  </label>
                </div>

                <div>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      v-model="preferences.weeklyDigest"
                      class="rounded border-surface-300 dark:border-surface-600 text-primary-600 focus:ring-primary-500"
                    />
                    <span class="ml-2 text-sm text-surface-700 dark:text-surface-300">
                      Send weekly learning digest
                    </span>
                  </label>
                </div>

                <div class="pt-4">
                  <button class="btn-primary" @click="savePreferences">Save Preferences</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Tab -->
          <div v-if="activeTab === 'security'" class="space-y-6">
            <div class="card p-6">
              <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-6">
                Password & Security
              </h2>

              <div class="space-y-6">
                <div>
                  <h3 class="text-md font-medium text-surface-900 dark:text-surface-100 mb-4">
                    Change Password
                  </h3>
                  <div class="space-y-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2"
                      >
                        Current Password
                      </label>
                      <input
                        v-model="passwordForm.currentPassword"
                        type="password"
                        class="input"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2"
                      >
                        New Password
                      </label>
                      <input
                        v-model="passwordForm.newPassword"
                        type="password"
                        class="input"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2"
                      >
                        Confirm New Password
                      </label>
                      <input
                        v-model="passwordForm.confirmPassword"
                        type="password"
                        class="input"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <button
                      class="btn-primary"
                      @click="changePassword"
                      :disabled="!isPasswordFormValid"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                <div class="border-t border-surface-200 dark:border-surface-700 pt-6">
                  <h3 class="text-md font-medium text-surface-900 dark:text-surface-100 mb-4">
                    Two-Factor Authentication
                  </h3>
                  <div
                    class="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg"
                  >
                    <div>
                      <p class="font-medium text-surface-900 dark:text-surface-100">2FA Status</p>
                      <p class="text-sm text-surface-600 dark:text-surface-400">
                        {{ twoFactorEnabled ? 'Enabled' : 'Disabled' }}
                      </p>
                    </div>
                    <button class="btn-outline" @click="toggleTwoFactor">
                      {{ twoFactorEnabled ? 'Disable' : 'Enable' }} 2FA
                    </button>
                  </div>
                </div>

                <div class="border-t border-surface-200 dark:border-surface-700 pt-6">
                  <h3
                    class="text-md font-medium text-surface-900 dark:text-surface-100 mb-4 text-error-600"
                  >
                    Danger Zone
                  </h3>
                  <div class="p-4 border border-error-200 dark:border-error-800 rounded-lg">
                    <h4 class="font-medium text-error-900 dark:text-error-100 mb-2">
                      Delete Account
                    </h4>
                    <p class="text-sm text-error-700 dark:text-error-300 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button class="btn-error" @click="deleteAccount">Delete Account</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import {
  UserCircleIcon,
  CogIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  PencilIcon,
  CameraIcon,
} from '@heroicons/vue/24/outline'
import AppLayout from '@/components/AppLayout.vue'
import SubscriptionManager from '@/components/SubscriptionManager.vue'
import { useAuthStore } from '@/app/store/auth'
import { useUiStore } from '@/app/store/ui'

const authStore = useAuthStore()
const uiStore = useUiStore()

const activeTab = ref('profile')
const editingProfile = ref(false)
const twoFactorEnabled = ref(false)

const tabs = [
  { id: 'profile', name: 'Profile', icon: UserCircleIcon },
  { id: 'subscription', name: 'Subscription', icon: CreditCardIcon },
  { id: 'preferences', name: 'Preferences', icon: CogIcon },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon },
]

const profileForm = reactive({
  name: '',
  email: '',
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const preferences = reactive({
  defaultConcisionMode: 'brief',
  defaultLevelMode: 'intermediate',
  enableVoiceMode: false,
  emailNotifications: true,
  weeklyDigest: true,
})

const usageStats = reactive({
  documentsUsed: 2,
  chatMessages: 45,
  quizzesTaken: 8,
})

const isPasswordFormValid = computed(() => {
  return (
    passwordForm.currentPassword.length > 0 &&
    passwordForm.newPassword.length >= 8 &&
    passwordForm.newPassword === passwordForm.confirmPassword
  )
})

onMounted(() => {
  if (authStore.user) {
    profileForm.name = authStore.user.name || ''
    profileForm.email = authStore.user.email || ''
  }
})

const getPlanBadgeClasses = (plan: string | undefined) => {
  switch (plan) {
    case 'pro':
      return 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
    case 'team':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default:
      return 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200'
  }
}

const getPlanDescription = (plan: string | undefined) => {
  switch (plan) {
    case 'pro':
      return 'Unlimited documents and advanced features'
    case 'team':
      return 'Team collaboration and admin features'
    default:
      return 'Basic features with limited usage'
  }
}

const getPlanPrice = (plan: string | undefined) => {
  switch (plan) {
    case 'pro':
      return '19'
    case 'team':
      return '49'
    default:
      return '0'
  }
}

const getDocumentLimit = (plan: string | undefined) => {
  switch (plan) {
    case 'pro':
    case 'team':
      return 999
    default:
      return 3
  }
}

const changeAvatar = () => {
  uiStore.showInfo('Avatar upload would be implemented here')
}

const saveProfile = () => {
  authStore.updateUser({
    name: profileForm.name,
    email: profileForm.email,
  })
  editingProfile.value = false
  uiStore.showSuccess('Profile updated successfully')
}

const cancelProfileEdit = () => {
  if (authStore.user) {
    profileForm.name = authStore.user.name || ''
    profileForm.email = authStore.user.email || ''
  }
  editingProfile.value = false
}

const savePreferences = () => {
  // In a real app, this would save to backend
  uiStore.showSuccess('Preferences saved successfully')
}

const changePassword = () => {
  // In a real app, this would validate and update password
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  uiStore.showSuccess('Password updated successfully')
}

const toggleTwoFactor = () => {
  twoFactorEnabled.value = !twoFactorEnabled.value
  uiStore.showSuccess(
    twoFactorEnabled.value ? '2FA enabled successfully' : '2FA disabled successfully'
  )
}

const cancelSubscription = async () => {
  const confirmed = await uiStore.confirm(
    'Cancel your subscription?',
    "You'll lose access to Pro features at the end of your billing period."
  )

  if (confirmed) {
    uiStore.showSuccess('Subscription cancelled. Access continues until January 15, 2024.')
  }
}

const deleteAccount = async () => {
  const confirmed = await uiStore.confirm(
    'Delete your account permanently?',
    'This action cannot be undone. All your data will be permanently deleted.'
  )

  if (confirmed) {
    const finalConfirm = await uiStore.confirm(
      'Are you absolutely sure? Type "DELETE" to confirm account deletion.'
    )

    if (finalConfirm) {
      // In a real app, this would delete the account
      uiStore.showError('Account deletion would be processed here')
    }
  }
}
</script>
