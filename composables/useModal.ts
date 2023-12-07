import type { ModalComponent, OpenModalEvent } from '~/types/modal'

export function useModal() {
  const isOpen = useState<Boolean>('isModalOpen', () => false)
  const { $globalEventEmitter } = useNuxtApp()

  function setIsOpen(value: boolean) {
    isOpen.value = value
  }

  function openModal<M extends ModalComponent>(options: OpenModalEvent<M>) {
    $globalEventEmitter.emit('openModal', options)
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
