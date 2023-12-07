<template>
  <button
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

  const modal = useModal()

  const props = withDefaults(
    defineProps<{
      beneficiaryId: string
      label?: string
    }>(),
    { label: 'Ajouter un document' }
  )

  const emit = defineEmits<{
    refreshDocuments: []
    newDocument: [key: string]
  }>()

  function onAdd() {
    modal.open({
      title: 'Ajouter un document',
      contentComponent: BeneficiaryDocumentAddForm,
      contentComponentProps: {
        beneficiaryId: props.beneficiaryId
      },
      contentComponentEvents: { newDocument: onNewDocument }
    })
  }

  function onNewDocument(key: string) {
    emit('refreshDocuments')
    emit('newDocument', key)
    modal.close()
  }
</script>

<style scoped>
  .open-modal-btn {
    border-radius: 2rem;
  }
</style>
