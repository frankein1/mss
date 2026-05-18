import { ref, shallowRef } from 'vue'
import { modalInjectionKey } from '../composables/useModal'
import type { ModalState } from '../types/modal'

export default defineNuxtPlugin(nuxtApp => {
  const modalState = shallowRef<ModalState>({
    component: 'div',
    props: {}
  })
  const isOpen = ref(false)
  const title = ref<string>('')
  const triggerOpen = ref(false)
  const ready = ref(false)

  nuxtApp.vueApp.provide(modalInjectionKey, {
    modalState,
    isOpen,
    title,
    triggerOpen,
    ready
  })
})
