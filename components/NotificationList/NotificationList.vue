<template>
  <div class="feature-section">
    <NotificationListHeader />
    <NotificationFilters @filter="filters = $event" />
    <hr v-if="error || pending || !notifications.length" />
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
    <template v-if="data">
      <ul
        v-if="notifications.length"
        class="notifications__list"
      >
        <NotificationItem
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
          @toggle-read-state="onToggleReadState(notification.id, $event)"
        />
      </ul>
      <NotificationListEmptyState
        v-else
        :notification-type="filters?.type"
      />
      <hr />
      <div class="notification-list__footer">
        <button
          v-if="canSeeMore"
          class="fr-btn fr-btn--tertiary fr-btn--sm"
          @click="page++"
        >
          Voir plus
        </button>
        <NotificationListReadToggle
          v-model:read="showReadNotifications"
          class="fr-ml-auto"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { NotificationType } from '@prisma/client'
  import { AlertType } from '~/utils/constants/alert'
  import { NotificationTypeFilterValue } from '~/client/options'
  import { NOTIFICATIONS_REQUEST_LIMIT_DEFAULT } from '~/utils/constants'

  const trpcClient = useTrpcClient()

  const filters = ref<{ type?: NotificationTypeFilterValue | '' }>({})
  const showReadNotifications = ref(false)
  const page = ref(1)

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
    types: notificationTypes.value,
    perPage: NOTIFICATIONS_REQUEST_LIMIT_DEFAULT,
    page: 1
  }))

  const { data, error, pending } =
    await trpcClient.notification.get.useQuery(queryInput)

  const notifications = computed(() => data.value?.notifications || [])
  const totalCount = computed(() => data.value?.totalCount || 0)

  const canSeeMore = computed(
    () => notifications.value.length < totalCount.value
  )

  watch(filters, () => {
    page.value = 1
  })

  watch(page, async page => {
    if (page === 1) {
      return
    }
    const newPage = await loadNotificationPage()
    if (!data.value) {
      data.value = newPage
      return
    }

    data.value = {
      ...data.value,
      notifications: [...data.value.notifications, ...newPage.notifications]
    }
  })

  function loadNotificationPage() {
    return trpcClient.notification.get.query({
      ...queryInput.value,
      page: page.value
    })
  }

  /**
   * It does not use the refresh function from `useQuery` as multiple pages may have been loaded
   */
  function onToggleReadState(notificationId: string, read: boolean) {
    if (data.value) {
      data.value = {
        totalCount: data.value.totalCount,
        notifications: data.value.notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, read }
            : notification
        )
      }

      if (!showReadNotifications.value && read) {
        data.value = {
          totalCount: data.value.totalCount - 1,
          notifications: data.value.notifications.filter(
            ({ id }) => id !== notificationId
          )
        }
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

  .notification-list__footer {
    padding: 0 1.5rem 0.5rem;
    display: flex;

    > .fr-btn.fr-btn--sm {
      height: fit-content;
    }
  }
</style>
