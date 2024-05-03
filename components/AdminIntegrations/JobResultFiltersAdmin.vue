<template>
  <AtomFilters
    :filters="integrationsFilters"
    @filter="emit('filter', $event)"
  />
</template>

<script setup lang="ts">
  import { FilterType } from '~/utils/constants/filters'
  import type { JobResultAdminFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import { jobResultStatusKeys } from '~/client/options'
  import { withEmptyValue } from '~/utils/options'

  const emit = defineEmits<{
    filter: [filters: JobResultAdminFilterInput]
  }>()

  const integrationsFilters = computed(() => {
    const filters: FilterProp[] = [
      {
        name: 'status',
        label: 'Statut',
        options: withEmptyValue(
          jobResultStatusKeys.options,
          'Tous les statuts'
        ),
        type: FilterType.SelectOne,
        alwaysExpanded: true
      }
    ]
    return filters
  })
</script>
