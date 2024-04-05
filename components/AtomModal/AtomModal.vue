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
                v-autofocus
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
                :is="modalState.component"
                v-if="modalState"
                v-bind="modalState.props"
                v-model="isOpen"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup generic="M extends Component">
  import { inject } from 'vue'
  import { useModal, modalInjectionKey } from '../../composables/useModal'

  const modalState = inject(modalInjectionKey)

  const modal = ref<HTMLDialogElement | null>(null)
  const title = ref<string | null>(null)

  const { isOpen } = useModal()

  const dsfrModal = computed(() =>
    modal.value ? window.dsfr(modal.value) : undefined
  )

  const stopWatch = watch(isOpen, value => {
    if (value) {
      dsfrModal.value.modal.disclose()
      title.value = modalState?.value.props.title || null
    } else {
      dsfrModal.value.modal.conceal()
      title.value = null
    }
  })

  onUnmounted(() => {
    stopWatch()
  })
</script>
