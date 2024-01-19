<template>
  <form
    ref="form"
    novalidate
  >
    <div
      v-if="expandedByDefaultFilters.length"
      class="filters"
      :class="{
        'full-width-filters': fullWidthFilters
      }"
    >
      <AtomFilter
        v-for="filter in expandedByDefaultFilters"
        :key="filter.name"
        :filter="filter"
        @change-filter="onChangeFilter($event, filter)"
      />
    </div>
    <div
      v-if="collapsedByDefaultFilters.length"
      :id="COLLAPSED_FILTERS_ID"
      class="fr-collapse filters"
      :class="{
        'full-width-filters': fullWidthFilters
      }"
    >
      <AtomFilter
        v-for="filter in collapsedByDefaultFilters"
        :key="filter.name"
        :filter="filter"
        @change-filter="onChangeFilter($event, filter)"
      />
    </div>
  </form>
  <div
    v-if="collapsedByDefaultFilters.length"
    class="filter-summary"
    :class="{ 'filter-summary__no-margin': noMargin }"
  >
    <div class="filter-left-section">
      <p v-if="resultsLabel">{{ resultsLabel }}</p>
      <ul
        v-show="!expanded && hasCollapsedSelectedFilters"
        class="fr-tags-group"
      >
        <li
          v-for="(
            { filterLabel, valueLabel }, name
          ) in collapsedSelectedFilters"
          :key="name"
        >
          <p class="fr-tag fr-icon-filter-line fr-tag--icon-left">
            {{ filterLabel }} : {{ valueLabel }}
          </p>
        </li>
      </ul>
    </div>
    <ul
      v-if="!noReset || collapsedByDefaultFilters.length"
      class="fr-btns-group fr-btns-group--icon-left fr-btns-group--inline-lg"
    >
      <li v-if="!noReset">
        <button
          v-show="hasFilters"
          class="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-close-circle-line"
          type="button"
          @click.prevent="onReset"
        >
          Réinitialiser
        </button>
      </li>
      <li v-if="collapsedByDefaultFilters.length">
        <button
          class="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-right"
          :class="{
            'fr-icon-arrow-down-s-line': !expanded,
            'fr-icon-arrow-up-s-line': expanded
          }"
          aria-expanded="false"
          :aria-controls="COLLAPSED_FILTERS_ID"
          @click="expanded = !expanded"
        >
          {{ expandBtnLabel }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs'
  import { FilterType } from '~/utils/constants/filters'
  import type {
    FilterProp,
    SelectedFilters,
    SelectedFilter
  } from '~/types/filter'
  import { getRandomId } from '~/utils/random'
  import { INPUT_DEFER_DURATION } from '~/utils/constants'

  const matomo = useMatomo()

  const props = withDefaults(
    defineProps<{
      filters: FilterProp[]
      fullWidthFilters?: boolean
      noReset?: boolean
      initialSelectedValues?: {
        [filterName: string]: string | string[] | Date | null
      }
      resultsLabel?: string
      noMargin?: boolean
    }>(),
    {
      fullWidthFilters: false,
      noReset: false,
      initialSelectedValues: () => ({}),
      resultsLabel: undefined
    }
  )

  const collapsedByDefaultFilters = computed(() =>
    props.filters.filter(filter => !filter.alwaysExpanded)
  )

  const expandedByDefaultFilters = computed(() =>
    props.filters.filter(filter => filter.alwaysExpanded)
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
          value: getFilterInitialValue(filter, initialSelectedValue),
          valueLabel: getFilterValueLabel(filter, initialSelectedValue)
        }
        return { ..._initialSelectedFilters, [filter.name]: selectedFilter }
      }
      return _initialSelectedFilters
    }, {} as SelectedFilters)
  )

  const emit = defineEmits<{
    filter: [filter: { [key: string]: string | string[] }]
  }>()

  const COLLAPSED_FILTERS_ID = getRandomId('filters-')
  const form = ref<HTMLFormElement | null>(null)
  const expanded = ref<boolean>(false)
  const selectedFilters = ref<SelectedFilters>(initialSelectedFilters.value)

  useForm({
    initialValues: props.initialSelectedValues
  })

  const expandBtnLabel = computed(() =>
    expanded.value ? 'Voir moins de filtres' : 'Voir tous les filtres'
  )

  const hasFilters = computed<boolean>(
    () => !!Object.keys(selectedFilters.value).length
  )

  const collapsedSelectedFilters = computed<SelectedFilters>(() =>
    Object.entries(selectedFilters.value).reduce(
      (collapsedSelectedFilters, [name, value]) => {
        const isCollapsed = collapsedByDefaultFilters.value.some(
          collapsed => collapsed.name === name
        )

        return isCollapsed
          ? { ...collapsedSelectedFilters, [name]: value }
          : collapsedSelectedFilters
      },
      {} as SelectedFilters
    )
  )

  const hasCollapsedSelectedFilters = computed(
    () => !!Object.keys(collapsedSelectedFilters.value).length
  )

  function getFilterInitialValue(
    filter: FilterProp,
    initialSelectedValue: string | string[] | Date
  ): string | string[] {
    return filter.type === FilterType.Date
      ? dayjs(initialSelectedValue as string | Date).format('YYYY-MM-DD')
      : (initialSelectedValue as string | string[])
  }

  const onChangeFilter = useDefer(
    INPUT_DEFER_DURATION,
    (value: string | string[], filter: FilterProp) => {
      if (!value || !value.length) {
        delete selectedFilters.value[filter.name]
      } else {
        addFilter(filter, value)
      }

      emit('filter', selectedFiltersToDataObject(selectedFilters.value))

      if (filter.matomoEventCategory && filter.matomoEventAction) {
        matomo.trackEvent(
          filter.matomoEventCategory,
          filter.matomoEventAction
        )
      }
    }
  )

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

  function getFilterValueLabel(
    filter: FilterProp,
    value: string | string[] | Date
  ) {
    let valueLabel: string
    if (filter.type === FilterType.Date) {
      valueLabel = dayjs(value as string | Date).format('YYYY-MM-DD')
    } else if (
      filter.type === FilterType.SelectMultiple ||
      filter.type === FilterType.SelectOne
    ) {
      valueLabel = getSelectedOptionsLabel(filter, value as string | string[])
    } else {
      valueLabel = value as string
    }
    return valueLabel
  }

  function getSelectedOptionsLabel(
    filter: FilterProp,
    value: string | string[]
  ): string {
    if (filter.type === FilterType.Date || filter.type === FilterType.Search) {
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
      grid-template-columns: repeat(2, 1fr);

      // For collapsable filters
      &::before {
        grid-column: 2;
      }

      > *:first-child:last-child {
        grid-column: span 2;
      }
    }
  }

  @include dsfr-media-query.respond-from('lg') {
    .filters:not(.full-width-filters) {
      grid-template-columns: repeat(6, 1fr);

      // For collapsable filters
      &::before {
        grid-column: 6;
      }

      > * {
        grid-column: span 2;
      }

      > *:first-child {
        &:last-child {
          grid-column: span 6;
        }

        &:nth-last-child(2) {
          grid-column: span 3;
        }
      }

      > *:last-child:nth-child(2) {
        grid-column: span 3;
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
      display: flex;
      flex-wrap: nowrap;
      flex: 1 0 auto;
      justify-content: flex-end;

      &:not(.fr-btns-group--sm, .fr-btns-group--lg).fr-btns-group--icon-left
        .fr-btn[class*=' fr-icon-'] {
        margin-bottom: 0;
      }
    }
  }

  .filter-summary__no-margin {
    .fr-btns-group {
      gap: 1rem;

      button {
        margin: 0;
      }
    }

    .filter-left-section {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 1rem;

      p {
        margin: 0;
      }

      ul {
        gap: 1rem;
      }

      li {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>
