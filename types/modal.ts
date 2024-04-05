import type { Component } from 'vue'

export interface Modal {
  title?: string
  triggerOpen?: boolean
}

export interface ModalState {
  component: Component | string
  props: Modal
}
