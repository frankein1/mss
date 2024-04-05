import mitt from 'mitt'
import type { OpenSnackbarEvent } from '~/types/snackbar'

export type GlobalEvents = {
  openSnackbar: OpenSnackbarEvent
}

export default defineNuxtPlugin(() => ({
  provide: {
    globalEventEmitter: mitt<GlobalEvents>()
  }
}))
