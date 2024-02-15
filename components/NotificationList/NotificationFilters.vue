<template>
  <div class="fr-px-3w fr-py-2w">
    <AtomFilters
      :filters="notificationFilters"
      full-width-filters
      no-reset
      :default-values="defaultValues"
      @filter="onFilter"
    />
  </div>
</template>

<script setup lang="ts">
  import { NotificationType } from '@prisma/client'
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
    filter: [filters: { types?: NotificationType[] }]
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

  function onFilter(filters: NotificationFilter | undefined) {
    if (!filters?.type) {
      emit('filter', {})
      return
    }

    switch (filters.type) {
      case NotificationTypeFilterValue.DueDate:
        emit('filter', {
          types: [
            NotificationType.DueDateOneMonth,
            NotificationType.DueDateToday,
            NotificationType.EndOfSupport
          ]
        })
        break
      case NotificationTypeFilterValue.NewComment:
        emit('filter', { types: [NotificationType.NewComment] })
        break
      case NotificationTypeFilterValue.NewItem:
        emit('filter', {
          types: [
            NotificationType.NewDocument,
            NotificationType.NewHistoryElement
          ]
        })
        break
      default:
        emit('filter', {})
    }
  }
</script>
