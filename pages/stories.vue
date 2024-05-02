<template>
  <div class="fr-container">
    <div class="fr-grid-rows">
      <h1>Composants UI</h1>
      <p>Les composants UI sont testables ci-dessous.</p>

      <h2>Tables</h2>

      <div class="fr-col-6">
        <TableSortableHeaderStory />
      </div>

      <div class="fr-col-12">
        <AtomFiltersStory />
      </div>

      <h2>Formulaires</h2>

      <div class="fr-col-6">
        <VeeSearchableSelectStory />
      </div>
    </div>
  </div>
</template>

<script setup>
  import TableSortableHeaderStory from '~/components/TableSortableHeader/TableSortableHeader.story.vue'
  import AtomFiltersStory from '~/components/AtomFilters/AtomFilters.story.vue'
  import VeeSearchableSelectStory from '~/components/VeeForm/VeeSearchableSelect.story.vue'

  definePageMeta({
    layout: 'landing'
  })
</script>

<style scoped>
  :deep(h4) {
    margin-top: 1.5rem;
  }
</style>
