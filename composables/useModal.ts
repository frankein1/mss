import type { ModalComponent, OpenModalEvent } from '~/types/modal'
import { PartialOnly } from '~/types/helpers'

export function useModal() {
  const isOpen = useState<Boolean>('isModalOpen', () => false)
  const { $globalEventEmitter } = useNuxtApp()

  function setIsOpen(value: boolean) {
    isOpen.value = value
  }

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
    setIsOpen,
    isOpen,
    open: openModal,
    close: closeModal
  }
}
