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
        @change-filter="onChangeFilter(filter)"
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
        @change-filter="onChangeFilter(filter)"
      />
    </div>
  </form>
  <div
    v-if="!noReset || collapsedByDefaultFilters.length"
    class="filter-summary"
    :class="{ 'filter-summary__no-margin': noMargin }"
  >
    <div
      v-if="collapsedByDefaultFilters.length"
      class="filter-left-section"
    >
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
    <ul class="fr-btns-group fr-btns-group--icon-left fr-btns-group--inline-lg">
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
    SelectedFilter,
    FilterValue,
    FilterValues
  } from '~/types/filter'
  import { getRandomId } from '~/utils/random'
  import { INPUT_DEFER_DURATION } from '~/utils/constants'

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
      resultsLabel?: string
      noMargin?: boolean
      /**
       * Use default values if the initial values have to be set on form reset
       */
      defaultValues?: FilterValues
    }>(),
    {
      fullWidthFilters: false,
      noReset: false,
      initialSelectedValues: undefined,
      resultsLabel: undefined,
      defaultValues: undefined
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

  const COLLAPSED_FILTERS_ID = getRandomId('filters-')
  const form = ref<HTMLFormElement | null>(null)
  const expanded = ref<boolean>(false)

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

        const selectedFilter: SelectedFilter = {
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

  watch(emitableSelectedFilters, emitable => {
    emit('filter', emitable)
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
      filter.type === FilterType.Radio
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

  .fr-select-group:last-child,
  .fr-input-group:last-child {
    margin-bottom: 1.5rem;
  }

  /* To have filters on 2 columns when screen is wide enough */
  @include dsfr-media-query.respond-from('md') {
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

  @include dsfr-media-query.respond-from('lg') {
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
