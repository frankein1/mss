<template>
  <h3 class="notificationitem__type">
    <NuxtLink
      class="fr-link"
      :to="itemLink"
      target="_self"
    >
      {{ notificationTypeLabels[notification.type] }}
    </NuxtLink>
  </h3>
  <span
    :class="[
      'notificationitem__icon',
      notificationTypeClasses[notification.type]
    ]"
    aria-hidden="true"
  ></span>
  <span class="notificationitem__date">{{
    formatDate(notification.created)
  }}</span>
  <span class="notificationitem__beneficiary">{{
    getBeneficiaryDisplayName(beneficiary)
  }}</span>
  <button
    ref="toggleReadButton"
    class="notificationitem__button fr-btn fr-btn--sm fr-icon-check-line"
    :class="{ 'fr-btn--tertiary': !isRead }"
    :title="toggleReadButtonLabel"
    @click="onToggleRead"
  >
    {{ toggleReadButtonLabel }}
  </button>
</template>

<script setup lang="ts">
  import { Beneficiary, Notification, NotificationType } from '@prisma/client'
  import { BeneficiaryTab } from '~~/utils/constants/beneficiary-tabs'
  import { RoutePath } from '~/utils/routing'
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
    return documentId || helpRequestId || followupId || undefined
  }

  const itemLink = computed(() =>
    RoutePath.Beneficiary(beneficiary.value.id, {
      tab: getItemTab(),
      item: getItemId(),
      originPage: route.path
    })
  )

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

  .notificationitem__type {
    @include dsfr.text-style(sm);

    grid-area: type;
    margin-bottom: 0;
    color: var(--primary);
  }

  .notificationitem__icon {
    grid-area: type-icon;
    color: var(--primary);
  }

  .notificationitem__date {
    @include dsfr.text-style(sm);

    grid-area: date;
    color: var(--primary);
  }

  .notificationitem__beneficiary {
    grid-area: beneficiary;
    font-weight: 700;
  }

  .notificationitem__button {
    grid-area: read;
    align-self: center;
  }
</style>
