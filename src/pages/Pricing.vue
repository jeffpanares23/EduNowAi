<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-4">
          Choose Your Learning Plan
        </h1>
        <p class="text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          Unlock the full potential of AI-powered learning with our flexible pricing options
        </p>
      </div>

      <!-- Billing Toggle -->
      <div class="flex justify-center mb-12">
        <div class="bg-surface-100 dark:bg-surface-800 p-1 rounded-lg">
          <button
            class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
            :class="
              billingPeriod === 'monthly'
                ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 shadow-sm'
                : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'
            "
            @click="billingPeriod = 'monthly'"
          >
            Monthly
          </button>
          <button
            class="px-4 py-2 text-sm font-medium rounded-md transition-colors relative"
            :class="
              billingPeriod === 'yearly'
                ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 shadow-sm'
                : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'
            "
            @click="billingPeriod = 'yearly'"
          >
            Yearly
            <span
              class="absolute -top-2 -right-2 bg-primary-500 text-white text-xs px-1.5 py-0.5 rounded-full"
            >
              -20%
            </span>
          </button>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <!-- Free Plan -->
        <div class="card p-8 relative">
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">Free</h3>
            <p class="text-surface-600 dark:text-surface-400 mb-4">Perfect for getting started</p>
            <div class="text-4xl font-bold text-surface-900 dark:text-surface-100">
              $0
              <span class="text-lg font-normal text-surface-600 dark:text-surface-400">/month</span>
            </div>
          </div>

          <ul class="space-y-4 mb-8">
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-success-500 mr-3" />
              <span class="text-surface-700 dark:text-surface-300">3 documents per month</span>
            </li>
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-success-500 mr-3" />
              <span class="text-surface-700 dark:text-surface-300">Basic AI chat</span>
            </li>
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-success-500 mr-3" />
              <span class="text-surface-700 dark:text-surface-300">5 quiz questions per day</span>
            </li>
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-success-500 mr-3" />
              <span class="text-surface-700 dark:text-surface-300">Basic flashcards</span>
            </li>
            <li class="flex items-center">
              <XMarkIcon class="h-5 w-5 text-surface-400 mr-3" />
              <span class="text-surface-500 dark:text-surface-400">Advanced analytics</span>
            </li>
            <li class="flex items-center">
              <XMarkIcon class="h-5 w-5 text-surface-400 mr-3" />
              <span class="text-surface-500 dark:text-surface-400">Priority support</span>
            </li>
          </ul>

          <button
            class="w-full btn-outline"
            @click="selectPlan('free')"
            :disabled="authStore.user?.planId === 'free'"
          >
            {{ authStore.user?.planId === 'free' ? 'Current Plan' : 'Get Started' }}
          </button>
        </div>

        <!-- Pro Plan -->
        <div class="card p-8 relative border-2 border-primary-500">
          <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span class="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>

          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">Pro</h3>
            <p class="text-surface-600 dark:text-surface-400 mb-4">For serious learners</p>
            <div class="text-4xl font-bold text-surface-900 dark:text-surface-100">
              ${{ billingPeriod === 'monthly' ? '19' : '15' }}
              <span class="text-lg font-normal text-surface-600 dark:text-surface-400">/month</span>
            </div>
            <p v-if="billingPeriod === 'yearly'" class="text-sm text-success-600 mt-1">
              Save $48/year
            </p>
          </div>

          <ul class="space-y-4 mb-8">
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-success-500 mr-3" />
              <span class="text-surface-700 dark:text-surface-300">Unlimited documents</span>
            </li>
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-success-500 mr-3" />
              <span class="text-surface-700 dark:text-surface-300"
                >Advanced AI chat with citations</span
              >
            </li>
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-success-500 mr-3" />
              <span class="text-surface-700 dark:text-surface-300">Unlimited quizzes</span>
            </li>
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-success-500 mr-3" />
              <span class="text-surface-700 dark:text-surface-300">Smart flashcards with SRS</span>
            </li>
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-success-500 mr-3" />
              <span class="text-surface-700 dark:text-surface-300">Detailed analytics</span>
            </li>
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-success-500 mr-3" />
              <span class="text-surface-700 dark:text-surface-300">Priority support</span>
            </li>
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-success-500 mr-3" />
              <span class="text-surface-700 dark:text-surface-300">Export capabilities</span>
            </li>
          </ul>

          <button
            class="w-full btn-primary"
            @click="selectPlan('pro')"
            :disabled="authStore.user?.planId === 'pro'"
          >
            {{ authStore.user?.planId === 'pro' ? 'Current Plan' : 'Upgrade to Pro' }}
          </button>
        </div>

        <!-- Team Plan -->
        <div class="card p-8 relative">
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">Team</h3>
            <p class="text-surface-600 dark:text-surface-400 mb-4">For organizations and teams</p>
            <div class="text-4xl font-bold text-surface-900 dark:text-surface-100">
              ${{ billingPeriod === 'monthly' ? '49' : '39' }}
              <span class="text-lg font-normal text-surface-600 dark:text-surface-400">/month</span>
            </div>
            <p class="text-sm text-surface-600 dark:text-surface-400 mt-1">
              per user (min 5 users)
            </p>
            <p v-if="billingPeriod === 'yearly'" class="text-sm text-success-600 mt-1">
              Save $120/year per user
            </p>
          </div>

          <ul class="space-y-4 mb-8">
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-success-500 mr-3" />
              <span class="text-surface-700 dark:text-surface-300">Everything in Pro</span>
            </li>
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-success-500 mr-3" />
              <span class="text-surface-700 dark:text-surface-300">Team collaboration</span>
            </li>
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-success-500 mr-3" />
              <span class="text-surface-700 dark:text-surface-300">Shared document libraries</span>
            </li>
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-success-500 mr-3" />
              <span class="text-surface-700 dark:text-surface-300">Admin dashboard</span>
            </li>
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-success-500 mr-3" />
              <span class="text-surface-700 dark:text-surface-300">SSO integration</span>
            </li>
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-success-500 mr-3" />
              <span class="text-surface-700 dark:text-surface-300">Dedicated support</span>
            </li>
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-success-500 mr-3" />
              <span class="text-surface-700 dark:text-surface-300">Custom integrations</span>
            </li>
          </ul>

          <button class="w-full btn-outline" @click="contactSales">Contact Sales</button>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-center text-surface-900 dark:text-surface-100 mb-12">
          Frequently Asked Questions
        </h2>

        <div class="space-y-6">
          <div v-for="(faq, index) in faqs" :key="index" class="card p-6">
            <button
              class="w-full text-left flex items-center justify-between"
              @click="faq.open = !faq.open"
            >
              <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
                {{ faq.question }}
              </h3>
              <ChevronDownIcon
                class="h-5 w-5 text-surface-400 transition-transform"
                :class="faq.open ? 'rotate-180' : ''"
              />
            </button>
            <div v-if="faq.open" class="mt-4 text-surface-700 dark:text-surface-300">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center mt-16">
        <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-4">
          Ready to supercharge your learning?
        </h2>
        <p class="text-surface-600 dark:text-surface-400 mb-8 max-w-2xl mx-auto">
          Join thousands of learners who are already using AI to accelerate their education and
          professional development.
        </p>
        <div class="flex justify-center space-x-4">
          <button class="btn-primary" @click="selectPlan('pro')">Start Free Trial</button>
          <button class="btn-outline" @click="contactSales">Talk to Sales</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { CheckIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import AppLayout from '@/components/AppLayout.vue'
import { useAuthStore } from '@/app/store/auth'
import { useUiStore } from '@/app/store/ui'

const authStore = useAuthStore()
const uiStore = useUiStore()

const billingPeriod = ref<'monthly' | 'yearly'>('monthly')

const faqs = reactive([
  {
    question: 'Can I cancel my subscription at any time?',
    answer:
      'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.',
    open: false,
  },
  {
    question: 'What types of documents can I upload?',
    answer:
      'We support PDFs, PowerPoint presentations, Word documents, videos (YouTube links), audio files, and plain text. More formats are coming soon!',
    open: false,
  },
  {
    question: 'How accurate is the AI?',
    answer:
      'Our AI is powered by state-of-the-art language models and provides highly accurate responses. However, we always recommend verifying important information from your source materials.',
    open: false,
  },
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. We use enterprise-grade encryption and security measures to protect your documents and personal information. Your data is never shared with third parties.',
    open: false,
  },
  {
    question: 'Can I get a refund?',
    answer:
      "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund.",
    open: false,
  },
  {
    question: 'Do you offer student discounts?',
    answer:
      'Yes! We offer a 50% discount for students with valid .edu email addresses. Contact our support team to apply for the student discount.',
    open: false,
  },
])

const selectPlan = async (planType: string) => {
  if (planType === 'free') {
    if (authStore.user?.planId !== 'free') {
      // Downgrade logic would go here
      uiStore.showSuccess('Switched to Free plan')
    }
    return
  }

  if (planType === 'pro') {
    // In a real app, this would integrate with Stripe or another payment processor
    const confirmed = await uiStore.confirm(
      `Upgrade to Pro plan for $${billingPeriod.value === 'monthly' ? '19' : '15'}/month?`,
      "You'll get unlimited documents, advanced AI features, and detailed analytics."
    )

    if (confirmed) {
      // Mock upgrade - in real app, this would process payment
      authStore.updateUser({ planId: 'pro' })
      uiStore.showSuccess('Successfully upgraded to Pro plan!')
    }
  }
}

const contactSales = () => {
  uiStore.showInfo('Sales contact form would open here. For now, email us at sales@edunow.ai')
}
</script>
