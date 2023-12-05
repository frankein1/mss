import type { ModalComponent, OpenModalEvent } from '~/types/modal'
import { PartialOnly } from '~/types/helpers'

export function useModal() {
  const { $globalEventEmitter } = useNuxtApp()

  function openModal<M extends ModalComponent>(
    options: PartialOnly<OpenModalEvent<M>, 'contentComponentEvents'>
  ) {
    $globalEventEmitter.emit('openModal', {
      ...options,
      contentComponentEvents: options.contentComponentEvents || {}
    })
  }

  function closeModal() {
    $globalEventEmitter.emit('closeModal')
  }

  return {
    open: openModal,
    close: closeModal
  }
}
