<template>
  <p class="fr-mb-0">
    Souhaitez-vous confirmer la suppression de la fiche bénéficiaire&nbsp;?
  </p>
  <div class="btn-container--right fr-mt-2w">
    <button
      class="fr-btn fr-btn--secondary"
      type="button"
      @click="cancel()"
    >
      Annuler
    </button>
    <button
      class="fr-btn btn-delete-action fr-btn--icon-left fr-icon-delete-line fr-mb-0 edit-btn fr-mt-4w"
      type="button"
      @click="validate()"
    >
      Supprimer définitivement
    </button>
  </div>
</template>

<script lang="ts" setup>
  const modal = useModal()

  defineProps<{
    validate: () => void
  }>()

  const cancel = () => {
    modal.close()
  }
</script>
