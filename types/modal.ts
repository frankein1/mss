import type { Component, ShallowRef } from 'vue'

export interface Modal {
  title?: string
  triggerOpen?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface ModalState {
  component: Component | string
  props: Modal
}

export interface ModalProvided {
  modalState: ShallowRef<ModalState>
  isOpen: Ref<boolean>
  title: Ref<string>
  triggerOpen: Ref<boolean>
  ready: Ref<boolean>
}
