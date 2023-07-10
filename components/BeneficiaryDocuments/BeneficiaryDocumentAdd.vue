<template>
  <button
    class="fr-btn open-modal-btn"
    data-fr-opened="false"
    aria-controls="global-modal"
    type="button"
    @click="onAdd"
  >
    Ajouter un document
  </button>
</template>

<script lang="ts" setup>
  import BeneficiaryDocumentAddForm from './BeneficiaryDocumentAddForm.vue'

  const modal = useModal()

  const props = defineProps<{
    beneficiaryId: string
  }>()

  const emit = defineEmits<{
    (e: 'refreshDocuments'): void
    (e: 'newDocument', key: String): void
  }>()

  function onAdd() {
    modal.open(
      'Ajouter un document',
      BeneficiaryDocumentAddForm,
      {
        beneficiaryId: props.beneficiaryId
      },
      { newDocument: onNewDocument }
    )
  }

  function onNewDocument(key: String) {
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
