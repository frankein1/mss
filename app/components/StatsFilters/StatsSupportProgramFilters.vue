<template>
  <section class="feature-section">
    <h3 class="fr-sr-only">Filtres</h3>
    <AtomFilters
      :filters="statsFilters"
      :expanded-by-default="true"
      @filter="emit('update:filters', $event)"
    />
  </section>
</template>

<script setup lang="ts">
  import { periodKeys } from '~~/client/options'
  import { FilterType } from '~/utils/constants/filters'
  import { withEmptyValue } from '~/utils/options'
  import type { Options } from '~/utils/options'
  import type { SupportProgramStatFilterInput } from '~~/server/schema'
  import type { FilterProp } from '~~/types/filter'
  import { StatPeriodFilter } from '~~/types/stat'

  const props = defineProps<{
    filters: SupportProgramStatFilterInput
    supportProgramNameOptions?: Options
  }>()

  const emit = defineEmits<{
    'update:filters': [filters: SupportProgramStatFilterInput]
  }>()

  const statsFilters = computed(() => {
    const statsFilters: FilterProp[] = []

    if (props.supportProgramNameOptions?.length) {
      statsFilters.push({
        name: 'supportProgramNameIds',
        label: "Dispositifs ou axes d'intervention",
        type: FilterType.SelectMultiple,
        options: props.supportProgramNameOptions,
        alwaysExpanded: true
      })
    }

    statsFilters.push({
      name: 'period',
      label: "Période d'activité du dispositif",
      type: FilterType.SelectOne,
      options: withEmptyValue(periodKeys.options, ''),
      alwaysExpanded: true
    })

    if (props.filters.period === StatPeriodFilter.Custom) {
      statsFilters.push(
        {
          name: 'fromDate',
          label: 'Du',
          type: FilterType.Date,
          alwaysExpanded: true
        },
        {
          name: 'toDate',
          label: 'Au',
          type: FilterType.Date,
          alwaysExpanded: true
        }
      )
    }

    return statsFilters
  })
</script>
