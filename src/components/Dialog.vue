<template>
  <TransitionRoot as="template" :show="true">
    <Dialog class="relative z-50" @close="handleCancel" :dialog="dialog">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-surface-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white dark:bg-surface-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div class="sm:flex sm:items-start">
                <div
                  v-if="dialog.type === 'confirm'"
                  class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-error-100 dark:bg-error-900 sm:mx-0 sm:h-10 sm:w-10"
                >
                  <ExclamationTriangleIcon class="h-6 w-6 text-error-600 dark:text-error-400" aria-hidden="true" />
                </div>
                <div
                  v-else
                  class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 sm:mx-0 sm:h-10 sm:w-10"
                >
                  <InformationCircleIcon class="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" class="text-base font-semibold leading-6 text-surface-900 dark:text-surface-100">
                    {{ dialog.title }}
                  </DialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-surface-500 dark:text-surface-400">
                      {{ dialog.message }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto focus-ring"
                  :class="dialog.type === 'confirm' ? 'bg-error-600 hover:bg-error-500' : 'bg-primary-600 hover:bg-primary-500'"
                  @click="handleConfirm"
                >
                  {{ dialog.confirmText || 'OK' }}
                </button>
                <button
                  v-if="dialog.type === 'confirm'"
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-surface-700 px-3 py-2 text-sm font-semibold text-surface-900 dark:text-surface-100 shadow-sm ring-1 ring-inset ring-surface-300 dark:ring-surface-600 hover:bg-surface-50 dark:hover:bg-surface-600 sm:mt-0 sm:w-auto focus-ring"
                  @click="handleCancel"
                >
                  {{ dialog.cancelText || 'Cancel' }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog as HeadlessDialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import type { Dialog as DialogType } from '@/app/types'

const props = defineProps<{
  dialog: DialogType
}>()

const handleConfirm = () => {
  if (props.dialog.onConfirm) {
    props.dialog.onConfirm()
  }
}

const handleCancel = () => {
  if (props.dialog.onCancel) {
    props.dialog.onCancel()
  }
}
</script>
