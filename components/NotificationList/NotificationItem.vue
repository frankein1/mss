<template>
  <h3 class="notificationitem__type">
    <NuxtLink
      class="fr-link"
      :to="itemLink"
      target="_self"
    >
      {{ itemTitle }}
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
    formatBeneficiaryDisplayName(beneficiary)
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
  import { Beneficiary, NotificationType } from '@prisma/client'
  import { NotificationItem } from './types'
  import { BeneficiaryTab } from '~~/utils/constants/beneficiary'
  import { Route, RoutePath } from '~/utils/routing'
  import { notificationTypeClasses } from '~/client/classes/notification'
  import { notificationTypeLabels } from '~/client/options/notification'
  import { formatUserDisplayName } from '~/utils/user'

  const props = defineProps<{
    notification: NotificationItem
    beneficiary: Beneficiary
  }>()

  const emit = defineEmits<{
    toggleReadState: []
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
      case NotificationType.DueDateToday:
      case NotificationType.DueDateOneMonth:
      case NotificationType.EndOfSupport:
      case NotificationType.NewComment:
      case NotificationType.NewHistoryElement:
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
    RoutePath.AppBeneficiary(beneficiary.value.id, {
      tab: getItemTab(),
      item: getItemId(),
      originPage: Route.AppOverview
    })
  )

  const itemTitle = computed(() => {
    if (props.notification.type === NotificationType.NewHistoryElement) {
      if (props.notification.helpRequest?.createdBy) {
        return `Une instruction de dossier a été ajoutée par ${formatUserDisplayName(
          props.notification.helpRequest.createdBy
        )}`
      }
      if (props.notification.followup?.createdBy) {
        return `Une synthèse d'entretien a été ajoutée par ${formatUserDisplayName(
          props.notification.followup.createdBy
        )}`
      }
    }
    return notificationTypeLabels[props.notification.type]
  })

  function onToggleRead() {
    useTrpcMutation({
      mutation: () =>
        useTrpcClient().notification.update.mutate({
          id: props.notification.id,
          read: !isRead.value
        }),
      onSuccess: () => {
        emit('toggleReadState')
      },
      onFailure: () => {
        useSnackbar().error(
          "L'état de la notification n'a pas pu être mis à jour."
        )
      }
    })
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
