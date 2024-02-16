<template>
  <div class="feature-section">
    <NotificationListHeader />
    <NotificationFilters @filter="filters = $event" />
    <hr v-if="error || pending || !data?.length" />
    <AtomAlert
      v-if="error"
      :alert-type="AlertType.Error"
      message="Les notifications n'ont pas pu être chargées."
    />
    <div
      v-if="pending"
      class="notification-list__loader-container"
    >
      <AtomLoader class="fr-mx-auto" />
    </div>
    <template v-else-if="data">
      <ul
        v-if="data.length"
        class="notifications__list"
      >
        <NotificationItem
          v-for="item in data"
          :key="item.id"
          :notification="item"
          @toggle-read-state="onToggleReadState(item.id, $event)"
        />
      </ul>
      <NotificationListEmptyState
        v-else
        :notification-type="filters?.type"
      />
      <NotificationListReadToggle v-model:read="showReadNotifications" />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { NotificationType } from '@prisma/client'
  import { AlertType } from '~/utils/constants/alert'
  import { NotificationTypeFilterValue } from '~/client/options'

  const filters = ref<{ type?: NotificationTypeFilterValue | '' }>({})
  const showReadNotifications = ref(false)

  const notificationTypes = computed<NotificationType[] | null>(() => {
    switch (filters.value.type) {
      case NotificationTypeFilterValue.DueDate:
        return [
          NotificationType.DueDateOneMonth,
          NotificationType.DueDateToday,
          NotificationType.EndOfSupport
        ]
      case NotificationTypeFilterValue.NewComment:
        return [NotificationType.NewComment]
      case NotificationTypeFilterValue.NewItem:
        return [
          NotificationType.NewDocument,
          NotificationType.NewHistoryElement
        ]
      default:
        return null
    }
  })

  const queryInput = computed(() => ({
    onlyUnread: !showReadNotifications.value,
    types: notificationTypes.value
  }))

  const { data, error, pending } =
    await useTrpcClient().notification.get.useQuery(queryInput)

  function onToggleReadState(notificationId: string, read: boolean) {
    if (data.value) {
      data.value = data.value.map(notification =>
        notification.id === notificationId
          ? { ...notification, read }
          : notification
      )

      if (!showReadNotifications.value && read) {
        data.value = data.value.filter(({ id }) => id !== notificationId)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .feature-section {
    padding: 0;
  }

  .notifications__list {
    --ul-start: 0;
    --xl-block: 0;
    --ul-type: none;
  }

  .notification-list__loader-container {
    padding: 0.5rem 1rem 1.5rem;
  }
</style>
