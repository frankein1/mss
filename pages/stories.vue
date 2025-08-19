<template>
  <div class="fr-container">
    <div class="fr-grid-row fr-grid-row--gutters">
      <h1 class="fr-col-12">Composants UI</h1>
      <p class="fr-col-12">Les composants UI sont testables ci-dessous.</p>

      <h2 class="fr-col-12">Combobox</h2>
      <div class="fr-col-12">
        <ComboboxStory />
      </div>
      <div class="fr-col-12">
        <VeeComboboxStory />
      </div>

      <h2 class="fr-col-12">Multiselect + tags</h2>
      <div class="fr-col-12">
        <VeeMultiselectStory />
      </div>

      <h2 class="fr-col-12">Multiselect 2</h2>
      <div class="fr-col-12">
        <MultiSelectStory />
      </div>

      <h2 class="fr-col-12">Wysiwyg editor</h2>
      <div class="fr-col-12">
        <AtomTextEditor />
      </div>

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

      <div class="fr-col-12">
        <VeeRadioButtonsStory />
      </div>

      <h2 class="fr-col-12">Statistiques</h2>

      <div class="fr-col-12">
        <StatsFiltersStory />
      </div>

      <div class="fr-col-12">
        <StatsListStory />
      </div>

      <h2 class="fr-col-12">Dossier foyer</h2>

      <div class="fr-col-12">
        <FamilyFileSegmentedControlStory />
      </div>
    </div>
  </div>
</template>

<script setup>
  import TableSortableHeaderStory from '~/components/TableSortableHeader/TableSortableHeader.story.vue'
  import AtomFiltersStory from '~/components/AtomFilters/AtomFilters.story.vue'
  import VeeSearchableSelectStory from '~/components/VeeForm/VeeSearchableSelect.story.vue'
  import VeeInputStory from '~/components/VeeForm/VeeInput.story.vue'
  import VeeRadioButtonsStory from '~/components/VeeForm/VeeRadioButtons.story.vue'
  import StatsFiltersStory from '~/components/StatsFilters/StatsFilters.story.vue'
  import StatsListStory from '~/components/StatsList/StatsList.story.vue'
  import FamilyFileSegmentedControlStory from '~/components/FamilyFileSegmentedControl/FamilyFileSegmentedControl.story.vue'
  import MultiSelectStory from '~/components/MultiSelect/MultiSelect.story.vue'
  import VeeMultiselectStory from '~/components/VeeForm/VeeMultiSelect.story.vue'
  import VeeComboboxStory from '~/components/VeeForm/VeeCombobox.story.vue'
  import ComboboxStory from '~/components/ComboBox/ComboBox.story.vue'

  definePageMeta({
    layout: 'landing'
  })
</script>

<style scoped>
  :deep(h4) {
    margin-top: 1.5rem;
  }
</style>
