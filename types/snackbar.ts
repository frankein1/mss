import type { AlertType } from '~/utils/constants/alert'

export type OpenSnackbar = (
  message: string,
  closeCallback?: () => void,
  duration?: number
) => void

export type OpenSnackbarEvent = {
  snackbarType: AlertType
  message: string
  closeCallback: () => void
  duration: number
}
