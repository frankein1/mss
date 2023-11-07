import type { ModalComponent, OpenModalEvent } from '~/types/modal'

export function useModal() {
  const { $globalEventEmitter } = useNuxtApp()

  function openModal<M extends ModalComponent>(options: OpenModalEvent<M>) {
    $globalEventEmitter.emit('openModal', options)
  }

  function closeModal() {
    $globalEventEmitter.emit('closeModal')
  }

  return {
    open: openModal,
    close: closeModal
  }
}
