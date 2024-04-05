import { ref, inject } from 'vue'
import type { ShallowRef, Component, InjectionKey } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import type { ComponentProps } from '../types/component'
import type { Modal, ModalState } from '../types/modal'

export const modalInjectionKey: InjectionKey<ShallowRef<ModalState>> =
  Symbol('mss.modal')

function _useModal() {
  const modalState = inject(modalInjectionKey)

  const triggerOpen = ref(false)
  const isOpen = ref(false)
  const title = ref('')

  function setIsOpen(value: boolean) {
    isOpen.value = value
  }

  function open<T extends Component>(
    component: T,
    props?: Modal & ComponentProps<T>
  ) {
    if (!modalState) {
      return
    }
    modalState.value = {
      component,
      props: props ?? {}
    }
    triggerOpen.value = !!props?.triggerOpen
    setIsOpen(true)
    title.value = props?.title || ''
  }

  function close() {
    if (!modalState) {
      return
    }
    setIsOpen(false)
    title.value = ''
    modalState.value = {
      component: 'div',
      props: {}
    }
  }

  /**
   * Allows updating the modal props
   */
  function patch<T extends Component = {}>(
    props: Partial<Modal & ComponentProps<T>>
  ) {
    if (!modalState) {
      return
    }
    modalState.value = {
      ...modalState.value,
      props: {
        ...modalState.value.props,
        ...props
      }
    }
  }

  return {
    triggerOpen,
    setIsOpen,
    isOpen,
    title,
    open,
    close,
    patch
  }
}

export const useModal = createSharedComposable(_useModal)
