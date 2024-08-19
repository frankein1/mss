import { AlertType } from '~/utils/constants/alert'
import type { OpenSnackbar } from '~/types/snackbar'

const DEFAULT_SNACKBAR_DURATION = 5000

export function useSnackbar() {
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
    success: openSnackbar(AlertType.Success),
    error: openSnackbar(AlertType.Error),
    info: openSnackbar(AlertType.Info),
    warning: openSnackbar(AlertType.Warning),
    focus: setFocusAfterClose
  }
}

function setFocusAfterClose(
  selector: HTMLElement | string = 'form',
  tag: keyof HTMLElementTagNameMap = 'input'
) {
  const el =
    typeof selector === 'string' ? document.querySelector(selector) : selector
  if (!el) {
    return () => {}
  }

  return () => el.querySelector(tag)?.focus()
}
