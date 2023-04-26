import mitt from 'mitt'
import type { AlertType } from '~/utils/constants/alert'

type OpenModalEvent = {
  title: string
  contentComponent: any
  contentComponentProps: any
  contentComponentEvents: any
}

type CloseModalEvent = undefined

type OpenSnackbarEvent = {
  snackbarType: AlertType
  message: string
  closeCallback: () => void
  duration: number
}

type GlobalEvents = {
  openModal: OpenModalEvent
  closeModal: CloseModalEvent
  openSnackbar: OpenSnackbarEvent
}

export default defineNuxtPlugin(() => ({
  provide: {
    globalEventEmitter: mitt<GlobalEvents>()
  }
}))
