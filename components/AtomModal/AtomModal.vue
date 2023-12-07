<template>
  <dialog
    id="global-modal"
    ref="modal"
    class="fr-modal"
    role="dialog"
    aria-labelledby="global-modal-title"
  >
    <div class="fr-container fr-container--fluid fr-container-md">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
          <div class="fr-modal__body">
            <div class="fr-modal__header">
              <button
                class="fr-btn--close fr-btn"
                aria-controls="global-modal"
                title="Fermer"
              >
                Fermer
              </button>
            </div>
            <div class="fr-modal__content">
              <h1
                id="global-modal-title"
                class="fr-modal__title"
              >
                <span
                  class="fr-icon-arrow-right-line fr-icon--lg"
                  aria-hidden="true"
                ></span>
                {{ title }}
              </h1>
              <component
                :is="contentComponent"
                v-if="contentComponent"
                v-bind="contentComponentProps"
                v-on="contentComponentEvents"
              ></component>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup generic="M extends ModalComponent">
  import type { ComponentProps, ComponentEmit } from '~/types/vue'
  import type { ModalComponent, OpenModalEvent } from '~/types/modal'

  const { $globalEventEmitter } = useNuxtApp()
  const { setIsOpen } = useModal()

  const modal = ref<HTMLDialogElement | null>(null)
  const title = ref('')
  const contentComponent: Ref<M | null> = shallowRef(null)
  const contentComponentProps: Ref<ComponentProps<M> | undefined> =
    ref(undefined)
  const contentComponentEvents: Ref<ComponentEmit<M> | undefined> =
    ref(undefined)

  const dsfrModal = computed(() =>
    modal.value ? window.dsfr(modal.value) : undefined
  )

  onMounted(() => {
    modal.value?.addEventListener('dsfr.conceal', onClose)
    $globalEventEmitter.on('openModal', onOpen)
    $globalEventEmitter.on('closeModal', close)
  })

  onUnmounted(() => {
    modal.value?.removeEventListener('dsfr.conceal', onClose)
  })

  function onOpen({
    title: _title,
    contentComponent: _contentComponent,
    contentComponentProps: _contentComponentProps,
    contentComponentEvents: _contentComponentEvents,
    triggerOpen
  }: OpenModalEvent<M>) {
    title.value = _title
    contentComponent.value = _contentComponent
    contentComponentProps.value = _contentComponentProps
    contentComponentEvents.value = _contentComponentEvents

    if (triggerOpen && modal.value) {
      dsfrModal.value.modal.disclose()
    }
    setIsOpen(true)
  }

  function onClose() {
    title.value = ''
    contentComponent.value = null
    contentComponentProps.value = undefined
    contentComponentEvents.value = undefined
    setIsOpen(false)
  }

  function close() {
    setIsOpen(false)
    if (!modal.value) {
      return
    }
    dsfrModal.value.modal.conceal()
  }
</script>
