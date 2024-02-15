<template>
  <div class="fr-px-3w fr-py-2w">
    <AtomFilters
      :filters="notificationFilters"
      full-width-filters
      no-reset
      :default-values="defaultValues"
      @filter="emit('filter', $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import { FilterProp } from '~/types/filter'
  import { FilterType } from '~/utils/constants/filters'
  import {
    notificationTypeOptions,
    NotificationTypeFilterValue
  } from '~/client/options'

  type NotificationFilter = {
    type?: NotificationTypeFilterValue | ''
  }

  const emit = defineEmits<{
    filter: [filters: NotificationFilter]
  }>()

  const notificationFilters: FilterProp[] = [
    {
      name: 'type',
      label: 'Type de notification',
      options: withEmptyValue(notificationTypeOptions, 'Toutes'),
      type: FilterType.Radio,
      alwaysExpanded: true,
      asTag: true,
      noLabel: true
    }
  ]

  const defaultValues: NotificationFilter = { type: '' }
</script>
