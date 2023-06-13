<template>
  <form @submit.prevent="deleteItem">
    <AtomAlert
      class="fr-mb-2w"
      :alert-type="AlertType.Warning"
      message="Toute suppression est définitive."
    />
    <p>
      Souhaitez-vous confirmer la suppression de
      {{
        isFollowup
          ? "la synthèse d'entretien"
          : "l'instruction de demande d'aide"
      }}
      ou annuler ?
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
    historyItemId: string
    isFollowup: boolean
  }>()

  const emit = defineEmits<{ (e: 'deleted'): void }>()

  const isSubmitting = ref(false)

  async function deleteItem() {
    isSubmitting.value = true
    try {
      if (props.isFollowup) {
        await useTrpcClient().followup.delete.mutate({
          id: props.historyItemId
        })
      } else {
        await useTrpcClient().helpRequest.delete.mutate({
          id: props.historyItemId
        })
      }

      emit('deleted')
      modal.close()
    } catch {
      useSnackbar().error('La suppression a échoué.')
    } finally {
      isSubmitting.value = false
    }
  }
</script>
