<template>
  <div class="filters-container">
    <form
      :id="FILTERS_ID"
      ref="form"
      class="filters fr-collapse"
      :class="{ 'full-width-filters': fullWidthFilters }"
    >
      <template
        v-for="filter in filters"
        :key="filter.name"
      >
        <VeeInput
          v-if="filter.type === FilterType.Date"
          :name="filter.name"
          :label="filter.label"
          type="date"
          @change-value="onChangeFilter($event, filter)"
        />
        <VeeMultiSelect
          v-else-if="filter.type === FilterType.SelectMultiple"
          class="multi-select-filters"
          :name="filter.name"
          :label="filter.label"
          :options="filter.options"
          :placeholder="filter.label"
          dropdown
          @change-value="onChangeFilter($event, filter)"
        />
        <VeeSelect
          v-else
          :name="filter.name"
          :label="filter.label"
          :options="filter.options"
          @change-value="onChangeFilter($event, filter)"
        />
      </template>
    </form>
    <div class="filter-summary">
      <ul
        v-show="!expanded"
        class="fr-tags-group"
      >
        <li
          v-for="({ filterLabel, valueLabel }, name) in selectedFilters"
          :key="name"
        >
          <p class="fr-tag fr-icon-filter-line fr-tag--icon-left">
            {{ filterLabel }} : {{ valueLabel }}
          </p>
        </li>
      </ul>
      <ul
        class="fr-btns-group fr-btns-group--icon-left fr-btns-group--inline-lg"
      >
        <li>
          <button
            v-show="hasFilters"
            class="fr-btn fr-icon-filter-line"
            type="button"
            @click.prevent="onReset"
          >
            Réinitialiser
          </button>
        </li>
        <li>
          <button
            class="fr-btn fr-btn--secondary fr-icon-filter-line"
            aria-expanded="false"
            :aria-controls="FILTERS_ID"
            @click="expanded = !expanded"
          >
            {{ expandBtnLabel }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useForm } from 'vee-validate'
  import { FilterType } from '~/utils/constants/filters'
  import type {
    FilterProp,
    SelectedFilters,
    SelectedFilter
  } from '~/types/filter'
  import { getRandomId } from '~/utils/random'

  const DEFER_TIME = 400

  const props = withDefaults(
    defineProps<{
      filters: FilterProp[]
      fullWidthFilters?: boolean
      initialSelectedValues?: { [filterName: string]: string | string[] | null }
    }>(),
    { fullWidthFilters: false, initialSelectedValues: () => ({}) }
  )

  const initialSelectedFilters = computed<SelectedFilters>(() =>
    props.filters.reduce((_initialSelectedFilters, filter) => {
      if (filter.name in props.initialSelectedValues) {
        const initialSelectedValue = props.initialSelectedValues[filter.name]
        if (!initialSelectedValue) {
          return _initialSelectedFilters
        }
        const selectedFilter: SelectedFilter = {
          filterLabel: filter.label,
          value: initialSelectedValue,
          valueLabel: getFilterValueLabel(filter, initialSelectedValue)
        }
        return { ..._initialSelectedFilters, [filter.name]: selectedFilter }
      }
      return _initialSelectedFilters
    }, {} as SelectedFilters)
  )

  const emit = defineEmits<{
    (e: 'filter', filter: { [key: string]: string | string[] }): void
  }>()

  const FILTERS_ID = getRandomId('filters-')
  const form = ref<HTMLFormElement | null>(null)
  const expanded = ref<boolean>(false)
  const selectedFilters = ref<SelectedFilters>(initialSelectedFilters.value)
  // This timeout is used to defer the emission of filters and thus prevent to many API calls or specific race conditions
  const timeout = ref<NodeJS.Timeout | null>(null)

  useForm({
    initialValues: props.initialSelectedValues
  })

  const expandBtnLabel = computed(() =>
    expanded.value ? 'Masquer les filtres' : 'Afficher les filtres'
  )

  const hasFilters = computed<boolean>(
    () => !!Object.keys(selectedFilters.value).length
  )

  function onChangeFilter(value: string | string[], filter: FilterProp) {
    if (!value) {
      delete selectedFilters.value[filter.name]
    } else {
      addFilter(filter, value)
    }

    if (timeout.value) {
      clearTimeout(timeout.value)
      timeout.value = null
    }

    timeout.value = setTimeout(() => {
      emit('filter', selectedFiltersToDataObject(selectedFilters.value))
    }, DEFER_TIME)
  }

  function addFilter(filter: FilterProp, value: string | string[]) {
    selectedFilters.value = {
      ...selectedFilters.value,
      [filter.name]: {
        filterLabel: filter.label,
        value,
        valueLabel: getFilterValueLabel(filter, value)
      }
    }
  }

  function onReset() {
    form.value?.reset()
    selectedFilters.value = {}
    emit('filter', selectedFiltersToDataObject(selectedFilters.value))
  }

  function getFilterValueLabel(filter: FilterProp, value: string | string[]) {
    let valueLabel: string
    if (
      filter.type === FilterType.SelectMultiple ||
      filter.type === FilterType.SelectOne
    ) {
      valueLabel = getSelectedOptionsLabel(filter, value)
    } else {
      valueLabel = value as string
    }
    return valueLabel
  }

  function getSelectedOptionsLabel(
    filter: FilterProp,
    value: string | string[]
  ): string {
    if (filter.type === FilterType.Date) {
      return ''
    }
    const selectedOptions = getSelectedOptions(
      value,
      filter.type === FilterType.SelectMultiple
    )
    return selectedOptions.map(o => filter.options.get(o) || o).join(', ')
  }

  function getSelectedOptions(
    value: string | string[],
    multiple: boolean
  ): string[] {
    if (multiple) {
      return value as string[]
    }
    return [value as string]
  }

  function selectedFiltersToDataObject(selectedFilters: SelectedFilters) {
    const dataObject: { [k: string]: string | string[] } = {}
    Object.entries(selectedFilters).forEach(([name, { value }]) => {
      dataObject[name] = value
    })
    return dataObject
  }
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .filters {
    display: grid;
    grid-template-columns: 1fr;
    column-gap: 1rem;
    justify-content: space-between;
    align-items: flex-end;
  }

  .fr-select {
    width: 100% !important;
  }

  .fr-select-group:last-child {
    margin-bottom: 1.5rem;
  }

  /* To have filters on 2 columns when screen is wide enough */
  @include dsfr-media-query.respond-from('md') {
    .filters:not(.full-width-filters) {
      grid-template-columns: calc(50% - 1rem) calc(50% - 1rem);

      &::before {
        grid-column: 2;
      }
    }
  }

  @include dsfr-media-query.respond-from('lg') {
    .filters:not(.full-width-filters) {
      grid-template-columns: calc(33% - 1rem) calc(33% - 1rem) calc(33% - 1rem);

      &::before {
        grid-column: 3;
      }
    }
  }

  .fr-collapse {
    // Allow multi-select filter dropdown to be fully-displayed
    overflow: visible;
  }

  .filter-summary {
    display: flex;
    align-items: center;

    .fr-tags-group {
      margin-right: 1rem;
    }

    .fr-btns-group {
      margin-left: auto;
    }
  }
</style>
