import type { Component } from 'vue'

export interface Modal {
  title?: string
  triggerOpen?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface ModalState {
  component: Component | string
  props: Modal
}
