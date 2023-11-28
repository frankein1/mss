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
  import { emailStatusOptions } from '~/client/options/email'
  import { withEmptyValue } from '~/utils/options'

  const emit = defineEmits<{
    filter: [filters: EmailAdminFilterInput]
  }>()

  const emailsFilters = computed(() => {
    const filters: FilterProp[] = [
      {
        name: 'status',
        label: 'Statut',
        options: withEmptyValue(emailStatusOptions, 'Tous les statuts'),
        type: FilterType.SelectOne
      }
    ]
    return filters
  })
</script>
