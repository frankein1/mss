<template>
  <section
    class="fr-grid-row fr-grid-row--gutters feature-section fr-mb-2w fr-mt-2w"
  >
    <div class="fr-col-12">
      <div class="title-wrapper">
        <h2 class="fr-text--sm fr-text--bold text--uppercase fr-mb-1v">
          Nom de l’atelier / thématique
        </h2>
        <button
          class="fr-btn fr-btn--tertiary-no-outline"
          type="button"
        >
          Modifier le nom
        </button>
      </div>
      <p class="fr-text--md fr-text--bold fr-h6">{{ workshopName }}</p>
      <WorkshopFormNameHelper />
    </div>
  </section>
</template>

<script setup lang="ts">
  import WorkshopFormNameHelper from './WorkshopFormNameHelper.vue'

  defineProps<{
    workshopName: string
  }>()
</script>

<style scoped>
  .title-wrapper {
    display: flex;
    justify-content: space-between;
  }
</style>
