import mitt from 'mitt'
import type { OpenSnackbarEvent } from '~/types/snackbar'
import type { OpenModalEvent, ModalComponent } from '~/types/modal'

export type GlobalEvents<M extends ModalComponent> = {
  openModal: OpenModalEvent<M>
  closeModal: undefined
  openSnackbar: OpenSnackbarEvent
}

export default defineNuxtPlugin(() => ({
  provide: {
    globalEventEmitter: mitt<GlobalEvents<ModalComponent>>()
  }
}))
