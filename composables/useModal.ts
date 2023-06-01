import { ComponentEmit, ComponentProps } from '~/types/vue'
import type { ModalComponent } from '~/types/modal'

export function useModal() {
  const { $globalEventEmitter } = useNuxtApp()

  function openModal<M extends ModalComponent>(
    title: string,
    contentComponent: M,
    contentComponentProps: ComponentProps<M>,
    contentComponentEvents: ComponentEmit<M>
  ) {
    $globalEventEmitter.emit('openModal', {
      title,
      contentComponent,
      contentComponentProps,
      contentComponentEvents
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
