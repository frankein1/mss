<template>
  <li class="notification">
    <h3 class="notification-type">
      <NuxtLink
        class="fr-link"
        :to="itemLink"
        target="_self"
      >
        {{ notificationTypeLabels[notification.type] }}
      </NuxtLink>
    </h3>
    <span
      :class="['notification-icon', notificationTypeClasses[notification.type]]"
      aria-hidden="true"
    ></span>
    <span class="notification-date">{{
      formatDate(notification.created)
    }}</span>
    <span class="notification-beneficiary">{{
      getBeneficiaryDisplayName(beneficiary)
    }}</span>
    <button
      ref="toggleReadButton"
      class="notification-toggle-read fr-btn fr-btn--sm fr-icon-check-line"
      :class="{ 'fr-btn--tertiary': !isRead }"
      :title="toggleReadButtonLabel"
      @click="onToggleRead"
    >
      {{ toggleReadButtonLabel }}
    </button>
  </li>
</template>

<script setup lang="ts">
  import { Beneficiary, Notification, NotificationType } from '@prisma/client'
  import { ORIGIN_PAGE_PARAMETER } from '~~/utils/constants'
  import { BeneficiaryTab } from '~~/utils/constants/beneficiary-tabs'
  import { Routes } from '~/utils/routing/routes'
  import { notificationTypeClasses } from '~/client/classes/notification'
  import { notificationTypeLabels } from '~/client/options/notification'

  const route = useRoute()

  const props = defineProps<{
    notification: Notification
    beneficiary: Beneficiary
  }>()

  const emit = defineEmits<{
    (e: 'toggleReadState'): void
  }>()

  const beneficiary = computed(() => props.beneficiary)

  const isRead = computed(() => props.notification.read)

  const toggleReadButtonLabel = computed(() =>
    isRead.value ? 'Marquer comme non-lu' : 'Marquer comme lu'
  )

  const beneficiaryLink = computed(() =>
    Routes.Beneficiary(beneficiary.value.id)
  )

  function getItemTab() {
    switch (props.notification.type) {
      case NotificationType.NewDocument:
        return BeneficiaryTab.Documents
      case NotificationType.DueDate:
      case NotificationType.EndOfSupport:
      case NotificationType.NewComment:
        return BeneficiaryTab.History
      default:
        return BeneficiaryTab.Details
    }
  }

  function getItemId() {
    const { documentId, helpRequestId, followupId } = props.notification
    return documentId || helpRequestId || followupId
  }

  const itemLink = computed(() => {
    return {
      path: `${beneficiaryLink.value}`,
      query: {
        tab: getItemTab(),
        item: getItemId(),
        [ORIGIN_PAGE_PARAMETER]: route.path
      }
    }
  })

  async function onToggleRead() {
    await useTrpcClient().notification.update.mutate({
      id: props.notification.id,
      read: !isRead.value
    })
    emit('toggleReadState')
  }
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/core/index' as dsfr;
  @use '@gouvfr/dsfr/module/color/mixin/element' as dsfr-color-element;

  .notification {
    @include dsfr-color-element.box-shadow(default grey, (), all-1-out);

    border-radius: 0.25rem;
    display: grid;
    row-gap: 0.25rem;
    column-gap: 2rem;
    grid-template-areas: 'type-icon beneficiary read' 'date type read';
    grid-template-columns: min-content auto min-content;
    padding: 0.5rem;
  }

  .notification-type {
    @include dsfr.text-style(sm);

    grid-area: type;
    margin-bottom: 0;
    color: var(--primary);
  }

  .notification-icon {
    grid-area: type-icon;
    color: var(--primary);
  }

  .notification-date {
    @include dsfr.text-style(sm);

    grid-area: date;
    color: var(--primary);
  }

  .notification-beneficiary {
    grid-area: beneficiary;
    font-weight: 700;
  }

  .notification-toggle-read {
    grid-area: read;
    align-self: center;
  }
</style>
