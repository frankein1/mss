<template>
  <AtomFilters
    :filters="usersFilters"
    @filter="emit('filter', $event)"
  />
</template>

<script setup lang="ts">
  import { FilterType } from '~/utils/constants/filters'
  import type { UserAdminFilterInput } from '~/server/schema'
  import type { FilterProp } from '~/types/filter'
  import { userRoleOptions } from '~/client/options/user'
  import { withEmptyValue } from '~/utils/options'

  const emit = defineEmits<{
    filter: [filters: UserAdminFilterInput]
  }>()

  const usersFilters = computed(() => {
    const filters: FilterProp[] = [
      {
        name: 'role',
        label: 'Rôle',
        options: withEmptyValue(userRoleOptions, 'Tous les rôles'),
        type: FilterType.SelectOne
      }
    ]
    return filters
  })
</script>
