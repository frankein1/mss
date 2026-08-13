<template>
  <button
    id="documentAddButton"
    class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-add-line open-modal-btn"
    data-fr-opened="false"
    aria-controls="global-modal"
    type="button"
    @click="onAdd"
  >
    {{ label }}
  </button>
</template>

<script lang="ts" setup>
  import BeneficiaryDocumentAddForm from './BeneficiaryDocumentAddForm.vue'
  import type { BeneficiaryFileIdentification } from '~~/types/beneficiary'

  const modal = useModal()

  const props = withDefaults(
    defineProps<{
      familyFileIdentification?: BeneficiaryFileIdentification[]
      beneficiaryId?: string
      label?: string
    }>(),
    {
      label: 'Ajouter un document',
      familyFileIdentification: () => [],
      beneficiaryId: undefined
    }
  )

  if (!props.beneficiaryId && props.familyFileIdentification.length === 0) {
    throw new Error(
      'One of beneficiaryId or familyFileIdentification props is compulsory'
    )
  }

  const emit = defineEmits<{
    newDocument: [key: string, name: string]
  }>()

  function onAdd() {
    modal.open(BeneficiaryDocumentAddForm, {
      title: 'Ajouter un document',
      ...(props.beneficiaryId && { beneficiaryId: props.beneficiaryId }),
      familyFileIdentification: props.familyFileIdentification,
      newDocument: onNewDocument
    })
  }

  function onNewDocument(key: string, name: string) {
    emit('newDocument', key, name)
    modal.close()
  }

  // reset focus on button
  const stopWatchingIsOpen = watch(modal.isOpen, value => {
    if (!value) {
      document?.querySelector<HTMLElement>('#documentAddButton')?.focus()
    }
  })
  onUnmounted(() => {
    stopWatchingIsOpen()
  })
</script>

<style scoped>
  .open-modal-btn {
    border-radius: 2rem;
  }
</style>
