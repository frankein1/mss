<template>
  <div>
    <h3>Atom Filters</h3>

    <h4>
      Filtres de date, de recherche, de sélection toujours visibles avec
      réinitialisation
    </h4>
    <div id="atom-filters-date-search-select-reset">
      <AtomFilters :filters="filtersDateSearchSelectReset" />
    </div>

    <h4>
      Filtres de sélection multiple, de radio toujours visibles largeur 100%
    </h4>
    <div id="atom-filters-multiple-select-radio-reset">
      <AtomFilters
        :filters="filtersMultipleSelectRadioReset"
        full-width-filters
      />
    </div>

    <h4>Filtres divers visibles sous condition sans réinitialisation</h4>
    <div id="atom-filters-not-visible-no-reset">
      <AtomFilters
        :filters="filtersNotVisibleNoReset"
        no-reset
      />
    </div>

    <h4>
      Filtres avec valeurs initiales et résumé des valeurs sélectionnées cachées
    </h4>
    <div id="atom-filters-initial-values-hidden-summary">
      <AtomFilters
        :filters="filtersInitialValuesHiddenSummary"
        results-label="Résumé des valeurs sélectionnées cachées"
        :initial-selected-values="initialValues"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import AtomFilters from './AtomFilters.vue'
  import { FilterProp } from '~/types/filter'
  import { FilterType } from '~/utils/constants/filters'

  const filtersDateSearchSelectReset: FilterProp[] = [
    {
      name: 'date',
      label: 'Date de début',
      type: FilterType.Date,
      alwaysExpanded: true
    },
    {
      name: 'search',
      label: 'Recherche',
      type: FilterType.Search,
      placeholder: 'Placeholder pour la recherche',
      alwaysExpanded: true
    },
    {
      name: 'select',
      label: 'Liste de sélection unique',
      options: withEmptyValue(
        [
          { label: 'Sélection 1', value: 'selection-1' },
          { label: 'Sélection 2', value: 'selection-2' },
          { label: 'Sélection 3', value: 'selection-3' }
        ],
        'Option de sélection vide'
      ),
      type: FilterType.SelectOne,
      alwaysExpanded: true
    }
  ]

  const filtersMultipleSelectRadioReset: FilterProp[] = [
    {
      name: 'multiple-select',
      label: 'Liste de sélection multiple',
      options: withEmptyValue(
        [
          { label: 'Sélection 1', value: 'selection-1' },
          { label: 'Sélection 2', value: 'selection-2' },
          { label: 'Sélection 3', value: 'selection-3' }
        ],
        'Option de sélection vide'
      ),
      type: FilterType.SelectMultiple,
      alwaysExpanded: true
    },
    {
      name: 'radio',
      label: 'Choix radio avec valeur par défaut',
      options: withEmptyValue(
        [
          { label: 'Radio 1', value: 'radio-1' },
          { label: 'Radio 2', value: 'radio-2' },
          { label: 'Radio 3', value: 'radio-3' }
        ],
        'Toutes'
      ),
      type: FilterType.Radio,
      alwaysExpanded: true,
      pictos: {
        'radio-1': '/pictograms/building.svg',
        'radio-2': '/pictograms/tax-stamp.svg',
        'radio-3': '/pictograms/document.svg'
      }
    }
  ]

  const filtersNotVisibleNoReset: FilterProp[] = [
    {
      name: 'radio',
      label: 'Choix radio avec valeur par défaut',
      options: withEmptyValue(
        [
          { label: 'Radio 1', value: 'radio-1' },
          { label: 'Radio 2', value: 'radio-2' },
          { label: 'Radio 3', value: 'radio-3' }
        ],
        'Toutes'
      ),
      type: FilterType.Radio,
      alwaysExpanded: false,
      pictos: {
        'radio-1': '/pictograms/building.svg',
        'radio-2': '/pictograms/tax-stamp.svg',
        'radio-3': '/pictograms/document.svg'
      }
    },
    {
      name: 'date',
      label: 'Date de début',
      type: FilterType.Date,
      alwaysExpanded: false
    },
    {
      name: 'search',
      label: 'Recherche',
      type: FilterType.Search,
      placeholder: 'Placeholder pour la recherche',
      alwaysExpanded: false
    },
    {
      name: 'select',
      label: 'Liste de sélection unique',
      options: withEmptyValue(
        [
          { label: 'Sélection 1', value: 'selection-1' },
          { label: 'Sélection 2', value: 'selection-2' },
          { label: 'Sélection 3', value: 'selection-3' }
        ],
        'Option de sélection vide'
      ),
      type: FilterType.SelectOne,
      alwaysExpanded: false
    }
  ]

  const filtersInitialValuesHiddenSummary: FilterProp[] = [
    {
      name: 'date',
      label: 'Date de début',
      type: FilterType.Date,
      alwaysExpanded: true
    },
    {
      name: 'search',
      label: 'Recherche',
      type: FilterType.Search,
      placeholder: 'Placeholder pour la recherche',
      alwaysExpanded: false
    },
    {
      name: 'select',
      label: 'Liste de sélection unique',
      options: withEmptyValue(
        [
          { label: 'Sélection 1', value: 'selection-1' },
          { label: 'Sélection 2', value: 'selection-2' },
          { label: 'Sélection 3', value: 'selection-3' }
        ],
        'Option de sélection vide'
      ),
      type: FilterType.SelectOne,
      alwaysExpanded: false
    }
  ]

  const initialValues = {
    date: '03-03-1999',
    search: 'Initial value for search',
    select: 'selection-3'
  }
</script>
