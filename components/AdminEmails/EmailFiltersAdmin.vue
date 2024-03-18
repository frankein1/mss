<template>
  <AtomFilters
    :filters="emailsFilters"
    @filter="emit('filter', $event)"
  />
</template>

<script setup lang="ts">
  import { FilterType } from '~/utils/constants/filters'
  import type { EmailAdminFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import { emailStatusKeys } from '~/client/options'
  import { withEmptyValue } from '~/utils/options'

  const emit = defineEmits<{
    filter: [filters: EmailAdminFilterInput]
  }>()

  const emailsFilters = computed(() => {
    const filters: FilterProp[] = [
      {
        name: 'status',
        label: 'Statut',
        options: withEmptyValue(emailStatusKeys.options, 'Tous les statuts'),
        type: FilterType.SelectOne
      }
    ]
    return filters
  })
</script>
