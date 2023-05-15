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

<script lang="ts" setup generic="C extends Component">
  import type { Ref } from 'vue'
  import type { ComponentProps, ComponentEmit } from '~/types/vue'

  const { $globalEventEmitter } = useNuxtApp()

  const modal = ref<HTMLDialogElement | null>(null)
  const title = ref('')
  const contentComponent: Ref<C | null> = shallowRef(null)
  const contentComponentProps: Ref<ComponentProps<C> | undefined> =
    ref(undefined)
  const contentComponentEvents: Ref<ComponentEmit<C> | undefined> =
    ref(undefined)

  onMounted(() => {
    modal.value?.addEventListener('dsfr.conceal', onClose)
    $globalEventEmitter.on('openModal', onOpen)
    $globalEventEmitter.on('closeModal', close)
  })

  onBeforeUnmount(() => {
    modal.value?.removeEventListener('dsfr.conceal', onClose)
  })

  // FIXME: Type component
  function onOpen({
    title: _title,
    contentComponent: _contentComponent,
    contentComponentProps: _contentComponentProps,
    contentComponentEvents: _contentComponentEvents
  }: {
    title: string
    contentComponent: C
    contentComponentProps: ComponentProps<C>
    contentComponentEvents: ComponentEmit<C>
  }) {
    title.value = _title
    contentComponent.value = _contentComponent
    contentComponentProps.value = _contentComponentProps
    contentComponentEvents.value = _contentComponentEvents
  }

  function onClose() {
    title.value = ''
    contentComponent.value = null
    contentComponentProps.value = undefined
    contentComponentEvents.value = undefined
  }

  function close() {
    if (!modal.value) return
    window.dsfr(modal.value).modal.conceal()
  }
</script>
