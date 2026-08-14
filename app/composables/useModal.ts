import { inject, ref } from 'vue'
import type { Component, InjectionKey } from 'vue'
import type { ComponentProps } from '../../types/component'
import type { Modal, ModalProvided } from '../../types/modal'

export const modalInjectionKey: InjectionKey<ModalProvided> =
  Symbol('mss.modal')

export function useModal() {
  const provided = inject(modalInjectionKey)

  const isReady = computed(() => provided?.ready.value ?? false)

  const defaultProps: Modal = { size: 'md' }

  function open<T extends Component>(
    component: T,
    props?: Modal & ComponentProps<T>
  ) {
    if (!provided) {
      return
    }
    provided.modalState.value = {
      component,
      props: { ...defaultProps, ...props }
    }
    provided.triggerOpen.value = !!props?.triggerOpen
    provided.isOpen.value = true
    provided.title.value = props?.title || ''
  }

  function close() {
    if (!provided) {
      return
    }
    provided.isOpen.value = false
    provided.title.value = ''

    // Closing modal waits for the AtomModal component
    // to disappear first
    setTimeout(() => {
      provided.modalState.value = {
        component: 'div',
        props: {}
      }
    }, 600)
  }

  function patch<T extends Component = {}>(
    props: Partial<Modal & ComponentProps<T>>
  ) {
    if (!provided) {
      return
    }
    provided.modalState.value = {
      ...provided.modalState.value,
      props: {
        ...provided.modalState.value.props,
        ...props
      }
    }
  }

  function setIsOpen(value: boolean) {
    if (provided) {
      provided.isOpen.value = value
    }
  }

  function setReady() {
    if (provided) {
      provided.ready.value = true
    }
  }

  function setTitle(value?: string) {
    if (provided) {
      provided.title.value = value || ''
    }
  }

  return {
    triggerOpen: provided?.triggerOpen ?? ref(false),
    setIsOpen,
    isOpen: provided?.isOpen ?? ref(false),
    setReady,
    isReady,
    title: provided?.title ?? ref(''),
    open,
    close,
    patch,
    setTitle,
    modalState: provided?.modalState
  }
}
