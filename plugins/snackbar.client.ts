import { AlertType } from '~/utils/constants/alert'
import type { OpenSnackbar } from '~/types/snackbar'

const DEFAULT_SNACKBAR_DURATION = 5000

export default defineNuxtPlugin(() => {
  const { $globalEventEmitter } = useNuxtApp()
  const openSnackbar =
    (snackbarType: AlertType): OpenSnackbar =>
    (
      message,
      closeCallback = () => {},
      duration = DEFAULT_SNACKBAR_DURATION
    ): void =>
      $globalEventEmitter.emit('openSnackbar', {
        snackbarType,
        message,
        closeCallback,
        duration
      })

  return {
    provide: {
      snackbar: {
        success: openSnackbar(AlertType.Success),
        error: openSnackbar(AlertType.Error),
        info: openSnackbar(AlertType.Info),
        warning: openSnackbar(AlertType.Warning)
      }
    }
  }
})
