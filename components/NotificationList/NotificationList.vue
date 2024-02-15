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
        class="notifications__list fr-mb-2w"
      >
        <li
          v-for="item in data"
          :key="item.notification.id"
          class="notifications__item"
        >
          <NotificationItem
            :notification="item.notification"
            :beneficiary="item.beneficiary"
            @toggle-read-state="onToggleReadState"
          />
        </li>
      </ul>
      <NotificationListEmptyState
        v-else
        :notification-type="filters?.type"
      />
      <NotificationReadToggle v-model:read="showReadNotifications" />
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

  const {
    data,
    error,
    pending,
    refresh: notificationsRefresh
  } = await useTrpcClient().notification.get.useQuery(queryInput)

  function onToggleReadState() {
    notificationsRefresh()
  }
</script>

<style lang="scss" scope>
  @use '@gouvfr/dsfr/module/color/mixin/element' as dsfr-color-element;

  .feature-section {
    padding: 0;
  }

  .notifications__list {
    --ul-start: 0;
    --xl-block: 0;
    --ul-type: none;
  }

  .notifications__list > *:not(:last-child) {
    margin-bottom: 0.75rem;
  }

  .notifications__separator {
    --text-spacing: 0 0 0.5rem;
  }

  .notifications__button {
    margin: 0 auto;
    display: block;
  }

  .notifications__item {
    @include dsfr-color-element.box-shadow(default grey, (), all-1-out);

    border-radius: 0.25rem;
    display: grid;
    gap: 0.25rem 2rem;
    grid-template-areas: 'type-icon beneficiary read' 'date type read';
    grid-template-columns: min-content auto min-content;
    padding: 0.5rem;
  }

  .notification-list__loader-container {
    padding: 0.5rem 1rem 1.5rem;
  }
</style>
