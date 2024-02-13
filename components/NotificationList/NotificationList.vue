<template>
  <div class="main-container fr-p-2w">
    <h2 class="fr-text--lg fr-mb-1w">Notifications</h2>
    <hr class="notifications__separator" />
    <AtomAlert
      v-if="error"
      :alert-type="AlertType.Error"
      message="Les notifications n'ont pas pu être chargées."
    />
    <AtomFilters
      v-else-if="data?.length || notificationType"
      :filters="notificationFilters"
      full-width-filters
      @filter="onFilter"
    />
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
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
      <p
        v-else
        class="fr-mb-2w notifications__info"
      >
        Aucune notification
      </p>
      <hr class="notifications__separator" />
      <button
        class="fr-btn fr-btn--sm fr-btn--tertiary notifications__button"
        @click="onToggleReadNotifications"
      >
        {{ toggleReadNotificationsBtnLabel }}
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { NotificationType } from '@prisma/client'
  import { notificationTypeOptions } from '~/client/options'
  import { FilterProp } from '~/types/filter'
  import { AlertType } from '~/utils/constants/alert'
  import { FilterType } from '~/utils/constants/filters'

  const notificationFilters: FilterProp[] = [
    {
      name: 'type',
      label: 'Type',
      options: withEmptyValue(notificationTypeOptions, 'Tous les types'),
      type: FilterType.SelectOne
    }
  ]

  const notificationType = ref<NotificationType | null>(null)
  const showReadNotifications = ref(false)

  const queryInput = computed(() => ({
    onlyUnread: !showReadNotifications.value,
    type: notificationType.value
  }))

  const {
    data,
    error,
    pending,
    refresh: notificationsRefresh
  } = await useTrpcClient().notification.get.useQuery(queryInput)

  const toggleReadNotificationsBtnLabel = computed(() =>
    showReadNotifications.value
      ? 'Voir les notifications non lues'
      : 'Voir les notifications déjà lues'
  )

  function onFilter(filter: any) {
    notificationType.value = filter.type
  }

  watch(notificationType, () => {
    notificationsRefresh()
  })

  function onToggleReadState() {
    notificationsRefresh()
  }

  function onToggleReadNotifications() {
    showReadNotifications.value = !showReadNotifications.value
    notificationsRefresh()
  }
</script>

<style lang="scss" scope>
  @use '@gouvfr/dsfr/module/color/mixin/element' as dsfr-color-element;

  .notifications__list {
    --ul-start: 0;
    --xl-block: 0;
    --ul-type: none;
  }

  .notifications__list > *:not(:last-child) {
    margin-bottom: 0.75rem;
  }

  .notifications__info {
    color: var(--text-mention-grey);
    text-align: center;
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
</style>
