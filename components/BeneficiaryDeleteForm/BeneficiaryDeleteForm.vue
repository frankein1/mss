<template>
  <form @submit.prevent="deleteItem">
    <AtomAlert
      class="fr-mb-2w"
      :alert-type="AlertType.Warning"
      message="Toute suppression est définitive."
      detailed-message="L'ensemble des éléments relatifs au bénéficiaire (informations, historique, documents, statistiques) seront définitivement supprimés."
    />
    <p>
      Souhaitez-vous confirmer la suppression de la fiche bénéficiaire ou
      annuler ?
    </p>
    <ul class="fr-btns-group fr-btns-group--inline-md fr-mt-3w">
      <li>
        <button
          class="fr-btn"
          title="Annuler"
          type="button"
          @click="modal.close"
        >
          Annuler
        </button>
      </li>
      <li>
        <button
          class="fr-btn btn-delete-action"
          title="Supprimer"
          type="submit"
          :submitting="isSubmitting"
        >
          Supprimer
        </button>
      </li>
    </ul>
  </form>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'

  const modal = useModal()

  const props = defineProps<{
    beneficiaryId: string
  }>()

  const emit = defineEmits<{ (e: 'deleted'): void }>()

  const isSubmitting = ref(false)

  async function deleteItem() {
    isSubmitting.value = true
    try {
      await useTrpcClient().beneficiary.delete.mutate({
        id: props.beneficiaryId
      })

      emit('deleted')
      modal.close()
    } catch {
      useSnackbar().error('La suppression a échoué.')
    } finally {
      isSubmitting.value = false
    }
  }
</script>
