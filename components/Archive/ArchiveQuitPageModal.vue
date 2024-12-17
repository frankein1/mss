<template>
  <p>
    <span class="fr-text--bold"
      >Vérifiez que le téléchargement a bien fonctionné et que le dossier est
      complet avant de le supprimer.</span
    >
    Mon Suivi Social n’a pas vocation à conserver les données des dossiers
    bénéficiaires archivés. Pour rappel, les données ne doivent pas être
    conservées au-delà de 2 ans à compter du dernier contact.
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
