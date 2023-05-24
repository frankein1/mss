<template>
  <div class="fr-col-12 fr-col-lg-5 fr-col-offset-lg-7 main-container fr-p-2w">
    <h2 class="fr-text--lg fr-mb-1w">Notifications</h2>
    <hr class="notification-separator" />
    <AtomAlert
      v-if="error"
      :alert-type="AlertType.Error"
      message="Les notifications n'ont pas pu être chargées."
    />
    <!-- <AtomFilters
      v-else-if="notifications?.length || filters"
      :filters="NOTIFICATION_FILTERS"
      full-width-filters
      @filter="onFilter"
    /> -->
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <template v-else-if="data">
      <ul
        v-if="data.length"
        class="notification-list fr-mb-2w"
      >
        <NotificationItem
          v-for="item in data"
          :key="item.notification.id"
          :notification="item.notification"
          :beneficiary="item.beneficiary"
          @toggle-read-state="onToggleReadState()"
        />
      </ul>
      <p
        v-else
        class="fr-mb-2w no-notification-text"
      >
        Aucune notification
      </p>
      <hr class="notification-separator" />
      <button
        class="fr-btn fr-btn--sm fr-btn--tertiary toggle-read-notifications-btn"
        @click="onToggleReadNotifications"
      >
        {{ toggleReadNotificationsBtnLabel }}
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { notificationTypeOptions } from '~/client/options/notification'
  import { AlertType } from '~~/utils/constants/alert'

  const NOTIFICATION_FILTERS = [
    {
      name: 'type',
      label: 'Type',
      options: withEmptyValue(notificationTypeOptions, 'Tous les types')
    }
  ]

  // const filters = ref(null)
  const showReadNotifications = ref(false)

  const {
    data,
    error,
    pending,
    refresh: notificationsRefresh
  } = useTrpcClient().notification.get.useQuery({
    onlyUnread: !showReadNotifications.value
  })

  const toggleReadNotificationsBtnLabel = computed(() =>
    showReadNotifications.value
      ? 'Voir les notifications non lues'
      : 'Voir les notifications déjà lues'
  )

  // watch(filters, notificationsRefresh)

  function onToggleReadState() {
    notificationsRefresh()
  }

  function onToggleReadNotifications() {
    showReadNotifications.value = !showReadNotifications.value
    notificationsRefresh()
  }
</script>

<style scope>
  .notification-list {
    --ul-start: 0;
    --xl-block: 0;
    --ul-type: none;
  }

  .notification-list > *:not(:last-child) {
    margin-bottom: 0.75rem;
  }

  .no-notification-text {
    color: var(--text-mention-grey);
    text-align: center;
  }

  .notification-separator {
    --text-spacing: 0 0 0.5rem;
  }

  .toggle-read-notifications-btn {
    margin: 0 auto;
    display: block;
  }
</style>
