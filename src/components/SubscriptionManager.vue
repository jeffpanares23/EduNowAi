<template>
  <div class="space-y-8">
    <!-- Current Plan Card -->
    <div class="card p-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-semibold text-surface-900 dark:text-surface-100">
          Current Plan
        </h3>
        <span 
          class="px-3 py-1 rounded-full text-sm font-medium"
          :class="getPlanBadgeClasses(currentPlan.id)"
        >
          {{ currentPlan.name }}
        </span>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 class="font-medium text-surface-900 dark:text-surface-100 mb-4">
            Plan Details
          </h4>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-surface-600 dark:text-surface-400">Price</span>
              <span class="font-semibold text-surface-900 dark:text-surface-100">
                ${{ currentPlan.price }}/{{ currentPlan.billing }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-surface-600 dark:text-surface-400">Documents</span>
              <span class="font-semibold text-surface-900 dark:text-surface-100">
                {{ currentPlan.documents }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-surface-600 dark:text-surface-400">AI Tutoring</span>
              <span class="font-semibold text-surface-900 dark:text-surface-100">
                {{ currentPlan.features.aiTutoring ? 'Unlimited' : 'Limited' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-surface-600 dark:text-surface-400">Analytics</span>
              <span class="font-semibold text-surface-900 dark:text-surface-100">
                {{ currentPlan.features.analytics ? 'Advanced' : 'Basic' }}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 class="font-medium text-surface-900 dark:text-surface-100 mb-4">
            Billing Information
          </h4>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-surface-600 dark:text-surface-400">Next Billing</span>
              <span class="font-semibold text-surface-900 dark:text-surface-100">
                {{ currentPlan.id === 'free' ? 'N/A' : nextBillingDate }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-surface-600 dark:text-surface-400">Status</span>
              <span 
                class="font-semibold"
                :class="subscription.status === 'active' ? 'text-success-600' : 'text-warn-600'"
              >
                {{ subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-surface-600 dark:text-surface-400">Auto-renewal</span>
              <span class="font-semibold text-surface-900 dark:text-surface-100">
                {{ subscription.autoRenewal ? 'Enabled' : 'Disabled' }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex flex-wrap gap-3 mt-8">
        <button 
          v-if="currentPlan.id === 'free'"
          class="btn-primary"
          @click="showUpgradeModal = true"
        >
          Upgrade Plan
        </button>
        <button 
          v-else
          class="btn-outline"
          @click="showUpgradeModal = true"
        >
          Change Plan
        </button>
        <button 
          v-if="currentPlan.id !== 'free'"
          class="btn-outline"
          @click="toggleAutoRenewal"
        >
          {{ subscription.autoRenewal ? 'Disable' : 'Enable' }} Auto-renewal
        </button>
        <button 
          v-if="currentPlan.id !== 'free'"
          class="btn-outline text-error-600 border-error-300 hover:bg-error-50"
          @click="showCancelModal = true"
        >
          Cancel Subscription
        </button>
      </div>
    </div>

    <!-- Usage Statistics -->
    <div class="card p-8">
      <h3 class="text-2xl font-semibold text-surface-900 dark:text-surface-100 mb-6">
        Usage This Month
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-surface-600 dark:text-surface-400">Documents</span>
            <span class="text-sm font-medium text-surface-900 dark:text-surface-100">
              {{ usage.documents }}/{{ currentPlan.documents === 'Unlimited' ? '∞' : currentPlan.documents }}
            </span>
          </div>
          <div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
            <div
              class="bg-primary-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${getUsagePercentage('documents')}%` }"
            ></div>
          </div>
        </div>
        
        <div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-surface-600 dark:text-surface-400">AI Queries</span>
            <span class="text-sm font-medium text-surface-900 dark:text-surface-100">
              {{ usage.aiQueries }}/{{ currentPlan.features.aiTutoring ? '∞' : '50' }}
            </span>
          </div>
          <div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
            <div
              class="bg-success-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${getUsagePercentage('aiQueries')}%` }"
            ></div>
          </div>
        </div>
        
        <div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-surface-600 dark:text-surface-400">Study Hours</span>
            <span class="text-sm font-medium text-surface-900 dark:text-surface-100">
              {{ usage.studyHours }}h
            </span>
          </div>
          <div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
            <div
              class="bg-warn-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${Math.min((usage.studyHours / 40) * 100, 100)}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Billing History -->
    <div class="card p-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-semibold text-surface-900 dark:text-surface-100">
          Billing History
        </h3>
        <button class="btn-outline btn-sm">
          Download All
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                Amount
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                Invoice
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-200 dark:divide-surface-700">
            <tr v-for="invoice in billingHistory" :key="invoice.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-surface-100">
                {{ formatDate(invoice.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-surface-100">
                {{ invoice.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-surface-100">
                ${{ invoice.amount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="invoice.status === 'paid' ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'"
                >
                  {{ invoice.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button class="text-primary-600 hover:text-primary-900">
                  Download
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Upgrade Modal -->
    <Dialog :open="showUpgradeModal" @close="showUpgradeModal = false">
      <div class="fixed inset-0 bg-black bg-opacity-25" />
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-surface-800 p-8 shadow-xl transition-all">
            <DialogTitle class="text-2xl font-semibold text-surface-900 dark:text-surface-100 mb-6">
              Choose Your Plan
            </DialogTitle>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div v-for="plan in availablePlans" :key="plan.id" 
                   class="border rounded-lg p-6 hover:border-primary-500 transition-colors cursor-pointer"
                   :class="plan.id === currentPlan.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' : 'border-surface-200 dark:border-surface-700'"
                   @click="selectPlan(plan)">
                <h4 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                  {{ plan.name }}
                </h4>
                <p class="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-4">
                  ${{ plan.price }}<span class="text-sm text-surface-500">/ {{ plan.billing }}</span>
                </p>
                <ul class="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                  <li>{{ plan.documents }} documents</li>
                  <li>{{ plan.features.aiTutoring ? 'Unlimited' : 'Limited' }} AI tutoring</li>
                  <li>{{ plan.features.analytics ? 'Advanced' : 'Basic' }} analytics</li>
                  <li v-if="plan.features.priority">Priority support</li>
                </ul>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-8">
              <button class="btn-outline" @click="showUpgradeModal = false">
                Cancel
              </button>
              <button class="btn-primary" @click="confirmPlanChange">
                {{ selectedPlan && (selectedPlan as any).price > currentPlan.price ? 'Upgrade' : 'Change' }} Plan
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>

    <!-- Cancel Modal -->
    <Dialog :open="showCancelModal" @close="showCancelModal = false">
      <div class="fixed inset-0 bg-black bg-opacity-25" />
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-surface-800 p-8 shadow-xl transition-all">
            <DialogTitle class="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-4">
              Cancel Subscription
            </DialogTitle>
            <p class="text-surface-600 dark:text-surface-400 mb-6">
              Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing period.
            </p>
            <div class="flex justify-end space-x-3">
              <button class="btn-outline" @click="showCancelModal = false">
                Keep Subscription
              </button>
              <button class="btn-primary bg-error-600 hover:bg-error-700" @click="cancelSubscription">
                Cancel Subscription
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { useUiStore } from '@/app/store/ui'

const uiStore = useUiStore()

// Modals
const showUpgradeModal = ref(false)
const showCancelModal = ref(false)
const selectedPlan = ref(null)

// Current plan data
const currentPlan = reactive({
  id: 'free',
  name: 'Free',
  price: 0,
  billing: 'month',
  documents: '3',
  features: {
    aiTutoring: false,
    analytics: false,
    priority: false
  }
})

// Subscription data
const subscription = reactive({
  status: 'active',
  autoRenewal: true
})

// Usage data
const usage = reactive({
  documents: 2,
  aiQueries: 15,
  studyHours: 12
})

// Available plans
const availablePlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billing: 'month',
    documents: '3',
    features: { aiTutoring: false, analytics: false, priority: false }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    billing: 'month',
    documents: 'Unlimited',
    features: { aiTutoring: true, analytics: true, priority: false }
  },
  {
    id: 'team',
    name: 'Team',
    price: 49,
    billing: 'month',
    documents: 'Unlimited',
    features: { aiTutoring: true, analytics: true, priority: true }
  }
]

// Billing history
const billingHistory = [
  {
    id: 1,
    date: '2024-01-15',
    description: 'Pro Plan - Monthly',
    amount: 19,
    status: 'paid'
  },
  {
    id: 2,
    date: '2023-12-15',
    description: 'Pro Plan - Monthly',
    amount: 19,
    status: 'paid'
  }
]

// Computed
const nextBillingDate = computed(() => {
  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  return date.toLocaleDateString()
})

// Methods
const getPlanBadgeClasses = (planId: string) => {
  switch (planId) {
    case 'pro':
      return 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
    case 'team':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default:
      return 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200'
  }
}

const getUsagePercentage = (type: string) => {
  switch (type) {
    case 'documents':
      return currentPlan.documents === 'Unlimited' ? 0 : (usage.documents / parseInt(currentPlan.documents)) * 100
    case 'aiQueries':
      return currentPlan.features.aiTutoring ? 0 : (usage.aiQueries / 50) * 100
    default:
      return 0
  }
}

const selectPlan = (plan: any) => {
  selectedPlan.value = plan
}

const confirmPlanChange = () => {
  if (selectedPlan.value) {
    Object.assign(currentPlan, selectedPlan.value)
    showUpgradeModal.value = false
    uiStore.showSuccess('Plan updated successfully!')
  }
}

const toggleAutoRenewal = () => {
  subscription.autoRenewal = !subscription.autoRenewal
  uiStore.showSuccess(`Auto-renewal ${subscription.autoRenewal ? 'enabled' : 'disabled'}`)
}

const cancelSubscription = () => {
  subscription.status = 'cancelled'
  subscription.autoRenewal = false
  showCancelModal.value = false
  uiStore.showSuccess('Subscription cancelled. You can continue using premium features until the end of your billing period.')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>
