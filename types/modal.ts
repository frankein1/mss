import type { Component } from 'vue'

export interface Modal {
  title?: string
  onSuccess?: () => void
  onClose?: () => void
  onClosePrevented?: () => void
}

export interface ModalState {
  component: Component | string
  props: Modal
}
