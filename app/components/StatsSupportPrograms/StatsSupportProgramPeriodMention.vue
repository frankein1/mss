<template>
  <p
    v-if="isPeriodFiltered"
    class="fr-text--xs text--muted fr-mb-4v"
  >
    Statistiques calculées uniquement sur les dispositifs ayant une date
    d’entrée ou de sortie dans la période sélectionnée.
  </p>
</template>

<script lang="ts" setup>
  import type { SupportProgramStatFilterInput } from '~~/server/schema'
  import { StatPeriodFilter } from '~~/types/stat'

  const props = defineProps<{
    filters: SupportProgramStatFilterInput
  }>()

  // Same condition as prepareSupportProgramStatFilters: a custom period
  // without any date does not filter anything
  const isPeriodFiltered = computed(
    () =>
      !!props.filters.period &&
      (props.filters.period !== StatPeriodFilter.Custom ||
        !!props.filters.fromDate ||
        !!props.filters.toDate)
  )
</script>
