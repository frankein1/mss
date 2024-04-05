<template>
  <form
    novalidate
    @submit.prevent="deleteItem"
  >
    <AtomAlert
      class="fr-mb-2w"
      :alert-type="AlertType.Warning"
      message="Toute suppression est définitive."
    />
    <p>
      Souhaitez-vous confirmer la suppression de
      {{ isFollowup ? "la synthèse d'entretien" : "l'instruction de dossier" }}
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
  const trpcClient = useTrpcClient()

  const props = defineProps<{
    socialSupportId: string
    isFollowup: boolean
    deleted: () => void
  }>()

  const isSubmitting = ref(false)

  function deleteItem() {
    useTrpcMutation({
      mutation: () =>
        trpcClient.socialSupport.remove.mutate({
          id: props.socialSupportId
        }),
      isSubmitting,
      onSuccess: () => {
        props.deleted()
        modal.close()
      },
      onFailure: () => {
        useSnackbar().error('La suppression a échoué.')
      }
    })
  }
</script>
