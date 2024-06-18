<template>
  <div class="fr-container">
    <div class="fr-grid-row fr-grid-row--gutters">
      <h1 class="fr-col-12">Composants UI</h1>
      <p class="fr-col-12">Les composants UI sont testables ci-dessous.</p>

      <h2 class="fr-col-12">Tables</h2>

      <div class="fr-col-6">
        <TableSortableHeaderStory />
      </div>

      <div class="fr-col-12">
        <AtomFiltersStory />
      </div>

      <h2 class="fr-col-12">Formulaires</h2>

      <div class="fr-col-6">
        <VeeInputStory />
      </div>

      <div class="fr-col-6">
        <VeeSearchableSelectStory />
      </div>

      <h2 class="fr-col-12">Statistiques</h2>

      <div class="fr-col-12">
        <StatsFiltersStory />
      </div>

      <div class="fr-col-12">
        <StatsListStory />
      </div>
    </div>
  </div>
</template>

<script setup>
  import TableSortableHeaderStory from '~/components/TableSortableHeader/TableSortableHeader.story.vue'
  import AtomFiltersStory from '~/components/AtomFilters/AtomFilters.story.vue'
  import VeeSearchableSelectStory from '~/components/VeeForm/VeeSearchableSelect.story.vue'
  import VeeInputStory from '~/components/VeeForm/VeeInput.story.vue'
  import StatsFiltersStory from '~/components/StatsFilters/StatsFilters.story.vue'
  import StatsListStory from '~/components/StatsList/StatsList.story.vue'

  definePageMeta({
    layout: 'landing'
  })
</script>

<style scoped>
  :deep(h4) {
    margin-top: 1.5rem;
  }
</style>
