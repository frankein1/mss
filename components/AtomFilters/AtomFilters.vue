<template>
  <form
    ref="form"
    novalidate
  >
    <div
      :id="FILTERS_ID"
      class="filters"
      :class="{
        'full-width-filters': fullWidthFilters
      }"
    >
      <AtomFilter
        v-for="filter in expandedByDefaultFilters"
        :key="filter.name"
        :filter="filter"
        @change-filter="onChangeFilter(filter)"
      />
      <template v-if="expanded && collapsedByDefaultFilters.length">
        <AtomFilter
          v-for="filter in collapsedByDefaultFilters"
          :key="filter.name"
          :filter="filter"
          @change-filter="onChangeFilter(filter)"
        />
      </template>
    </div>
  </form>
  <ul
    v-if="hiddenTag.label"
    class="fr-tags-group fr-mt-4v"
  >
    <li>
      <p class="fr-tag fr-icon-filter-line fr-tag--icon-left fr-mb-0">
        {{ hiddenTag.label }} : {{ hiddenTag.value }}
      </p>
    </li>
  </ul>
  <div
    v-if="!noReset || collapsedByDefaultFilters.length"
    class="filter-summary"
    :class="{ 'filter-summary__no-margin': noMargin }"
  >
    <div
      v-if="collapsedByDefaultFilters.length"
      class="filter-left-section"
    >
      <p
        v-if="resultsLabel"
        class="fr-mb-0"
      >
        {{ resultsLabel }}
      </p>
    </div>
    <ul class="fr-btns-group fr-btns-group--icon-left fr-btns-group--inline">
      <li v-if="!noReset">
        <button
          v-show="hasFilters"
          class="fr-btn fr-btn--tertiary-no-outline fr-icon-close-circle-line"
          type="button"
          @click.prevent="onReset"
        >
          Réinitialiser
        </button>
      </li>
      <li v-if="collapsedByDefaultFilters.length">
        <button
          class="fr-btn fr-btn--tertiary-no-outline fr-icon-filter-fill"
          aria-expanded="false"
          :aria-controls="FILTERS_ID"
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
    SelectedFilter,
    FilterValue,
    FilterValues
  } from '~/types/filter'
  import { INPUT_DEFER_DURATION } from '~/utils/constants'
  import { getOptionLabel } from '~/utils/options'

  const matomo = useMatomo()

  const props = withDefaults(
    defineProps<{
      filters: FilterProp[]
      fullWidthFilters?: boolean
      noReset?: boolean
      /**
       * Use initial values if the initial values must not persist on form reset
       * i.e for initial values from application state
       */
      initialSelectedValues?: FilterValues
      /**
       * Label for the collapsed values selected
       */
      resultsLabel?: string
      noMargin?: boolean
      /**
       * Use default values if the initial values have to be set on form reset
       */
      defaultValues?: FilterValues
      /**
       * All filters are expanded by default
       */
      expandedByDefault?: boolean
    }>(),
    {
      fullWidthFilters: false,
      noReset: false,
      initialSelectedValues: undefined,
      resultsLabel: undefined,
      defaultValues: undefined,
      expandedByDefault: false
    }
  )

  const collapsedByDefaultFilters = computed(() =>
    props.filters.filter(filter => !filter.alwaysExpanded)
  )

  const expandedByDefaultFilters = computed(() =>
    props.filters.filter(filter => filter.alwaysExpanded)
  )

  const emit = defineEmits<{
    filter: [filter: FilterValues]
  }>()

  const FILTERS_ID = 'filters-' + useId()
  const form = ref<HTMLFormElement | null>(null)
  const expanded = ref<boolean>(props.expandedByDefault)

  const {
    controlledValues: selectedFilters,
    resetForm,
    setFieldValue
  } = useForm({
    initialValues: props.initialSelectedValues || props.defaultValues || {}
  })

  const expandBtnLabel = computed(() =>
    expanded.value ? 'Voir moins de filtres' : 'Voir tous les filtres'
  )

  function isSetValue(
    value: FilterValue | null | undefined
  ): value is FilterValue {
    return !!(value && (!Array.isArray(value) || value.length))
  }

  const hasFilters = computed<boolean>(
    () => !!Object.values(selectedFilters.value).filter(isSetValue).length
  )

  const hiddenTag = computed(() => {
    const notFilled = selectedFilters.value.notFilled
    const notFiledFilter = props.filters.find(
      filter => filter.type === FilterType.NotFilled
    )
    if (!notFiledFilter) {
      return {}
    }
    const options = notFiledFilter.options

    return {
      label: options.find(o => o.value === notFilled)?.label || undefined,
      value: 'non renseigné'
    }
  })

  const collapsedSelectedFilters = computed<SelectedFilters>(() =>
    Object.entries(selectedFilters.value).reduce(
      (_collapsedSelectedFilters, [name, value]) => {
        if (!isSetValue(value)) {
          return _collapsedSelectedFilters
        }

        const filter = collapsedByDefaultFilters.value.find(
          collapsed => collapsed.name === name
        )

        if (!filter) {
          return _collapsedSelectedFilters
        }

        const selectedFilter: SelectedFilter =
          filter.type === FilterType.NotFilled
            ? {
                filterLabel: getFilterValueLabel(filter, value),
                value: getFilterValue(filter, value),
                valueLabel: filter.label
              }
            : {
                filterLabel: filter.label,
                value: getFilterValue(filter, value),
                valueLabel: getFilterValueLabel(filter, value)
              }

        return { ..._collapsedSelectedFilters, [name]: selectedFilter }
      },
      {} as SelectedFilters
    )
  )

  const hasCollapsedSelectedFilters = computed(
    () => !!Object.keys(collapsedSelectedFilters.value).length
  )

  const hasNotFilledFilterActive = computed(
    () => !!collapsedSelectedFilters.value['notFilled']
  )

  /** Collapsed filters summary is shown if the filters are not is the expanded state
   *  When the not-filled filter is active its summary is always shown even if the expanded state
   */
  const showCollapsedFiltersSummary = computed(
    () =>
      (!expanded.value || hasNotFilledFilterActive.value) &&
      hasCollapsedSelectedFilters.value
  )

  const emitableSelectedFilters = computed(() =>
    Object.entries(selectedFilters.value).reduce(
      (emitable, [filterName, filterValue]) =>
        isSetValue(filterValue)
          ? { ...emitable, [filterName]: filterValue }
          : emitable,
      {} as { [key: string]: FilterValue }
    )
  )

  // Set a newly added filter to its default value (i.e. when changing between history stats tabs)
  watch(
    () => props.filters,
    (newFilters, oldFilters) => {
      const hasDefaultValues =
        props.defaultValues &&
        Object.values(props.defaultValues).filter(
          v => v !== null && v !== undefined
        ).length

      if (!hasDefaultValues) {
        return
      }

      const addedFilters = newFilters.filter(({ name: newName }) =>
        oldFilters.every(({ name: oldName }) => oldName !== newName)
      )
      if (!addedFilters.length) {
        return
      }

      addedFilters.forEach(({ name }) => {
        if (!props.defaultValues) {
          return
        }

        const defaultValue = props.defaultValues[name]
        if (defaultValue === null || defaultValue === undefined) {
          return
        }

        setFieldValue(name, defaultValue)
      })
    }
  )

  watch(emitableSelectedFilters, (emitable, oldvalue) => {
    const filterContentHasChanged =
      JSON.stringify(oldvalue) !== JSON.stringify(emitable)
    if (filterContentHasChanged) {
      emit('filter', emitable)
    }
  })

  const onChangeFilter = useDefer(
    INPUT_DEFER_DURATION,
    (filter: FilterProp) => {
      if (filter.matomoEventCategory && filter.matomoEventAction) {
        matomo.trackEvent(filter.matomoEventCategory, filter.matomoEventAction)
      }
    }
  )

  function getFilterValue(
    filter: FilterProp,
    value: FilterValue
  ): string | string[] {
    return filter.type === FilterType.Date
      ? dayjs(value as string | Date).format('YYYY-MM-DD')
      : (value as string | string[])
  }

  function onReset() {
    form.value?.reset()
    const resetValues = props.defaultValues || {}
    resetForm({ values: resetValues }, { force: true })
    emit('filter', resetValues)
  }

  function getFilterValueLabel(filter: FilterProp, value: FilterValue) {
    let valueLabel: string
    if (filter.type === FilterType.Date) {
      valueLabel = dayjs(value as string | Date).format('YYYY-MM-DD')
    } else if (
      filter.type === FilterType.SelectMultiple ||
      filter.type === FilterType.SelectOne ||
      filter.type === FilterType.Radio ||
      filter.type === FilterType.NotFilled
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
    return selectedOptions
      .map(o => getOptionLabel(filter.options, o) || o)
      .join(', ')
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
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .filters {
    display: grid;
    grid-template-columns: 1fr;
    column-gap: 1rem;
    justify-content: space-between;
    align-items: flex-end;

    // Allow multi-select filter dropdown to be fully-displayed
    overflow: visible;
  }

  .fr-select {
    width: 100% !important;
  }

  .fr-select-group:last-child,
  .fr-input-group:last-child {
    margin-bottom: 1.5rem;
  }

  /* To have filters on 2 columns when screen is wide enough */
  @include dsfr-media-query.respond-from('lg') {
    .filters:not(.full-width-filters) {
      grid-template-columns: repeat(2, 1fr);

      .filter-radio:not(.filter-radio--as-tag) {
        grid-column: span 2;
      }

      // For collapsable filters
      &::before {
        grid-column: 2;
      }
    }
  }

  @include dsfr-media-query.respond-from('xl') {
    .filters:not(.full-width-filters) {
      grid-template-columns: repeat(6, 1fr);

      // For collapsable filters
      &::before {
        grid-column: 6;
      }

      .filter-radio:not(.filter-radio--as-tag) {
        grid-column: span 6;
      }

      > * {
        grid-column: span 2;
      }
    }
  }

  .filter-summary {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;

    @include dsfr-media-query.respond-from('md') {
      margin-top: 1rem;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;

      .fr-btns-group {
        flex-wrap: nowrap;
      }
    }

    .fr-tags-group {
      margin-right: 1rem;
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
