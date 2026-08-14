<template>
  <form
    novalidate
    @submit.prevent="deleteItem"
  >
    <AtomAlert
      class="fr-mb-2w"
      :alert-type="AlertType.Warning"
      message="Toute suppression est définitive."
      detailed-message="L'ensemble des éléments relatifs au bénéficiaire (informations, historique, documents, statistiques) seront définitivement supprimés."
    />
    <p>Souhaitez-vous confirmer la suppression ou annuler ?</p>
    <ul class="fr-btns-group fr-btns-group--inline-md fr-mt-3w">
      <li>
        <button
          class="fr-btn fr-btn--secondary"
          type="button"
          @click="cancelAndClose"
        >
          Annuler
        </button>
      </li>
      <li>
        <button
          class="fr-btn btn-delete-action"
          type="submit"
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
    cancel: () => void
    deleteItem: () => void
  }>()

  function cancelAndClose() {
    modal.close()
    props.cancel()
  }
</script>
