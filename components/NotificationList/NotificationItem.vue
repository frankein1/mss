<template>
  <li
    class="notificationitem"
    :class="{ notificationitem__read: notification.read }"
  >
    <span
      class="notificationitem__icon"
      :class="[notificationIcon]"
      aria-hidden="true"
    ></span>
    <h3 class="fr-text--sm fr-mb-0">
      {{ notificationTitle }}
    </h3>
    <div>
      <p
        v-if="notification.beneficiary"
        class="notificationitem__beneficiary"
      >
        {{ formatBeneficiaryDisplayName(notification.beneficiary) }}
      </p>
      <p class="fr-mb-0">
        <NuxtLink
          v-if="itemLink"
          class="fr-link"
          :to="itemLink"
          >{{ notificationDescription }}</NuxtLink
        >
        {{ notificationDescriptionDetail }}
      </p>
      <p
        v-if="notification.comment"
        class="fr-text--sm notificationitem__comment"
      >
        {{ notification.comment.content }}
      </p>
    </div>
    <div class="notificationitem__end">
      <p class="fr-text--xs notificationitem__date">
        {{ formatDate(notification.created) }}
      </p>
      <form
        ref="form"
        class="notificationitem__read-form"
      >
        <VeeCheckbox
          :label="toggleLabel"
          name="read"
          no-label
        />
      </form>
    </div>
  </li>
</template>

<script setup lang="ts">
  import { NotificationType, SocialSupportType } from '@prisma/client'
  import dayjs from 'dayjs'
  import { NotificationItem } from '~/server/trpc/routers'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { Route, RoutePath } from '~/utils/routing'
  import { notificationTypeClasses } from '~/client/classes/notification'
  import { notificationTypeKeys } from '~/client/options'
  import { formatUserDisplayName } from '~/utils/user'
  import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { formatDate } from '~/utils/formatDate'

  const props = defineProps<{
    notification: NotificationItem
  }>()

  const emit = defineEmits<{
    toggleReadState: [read: boolean]
  }>()

  const form = ref<HTMLFormElement | null>(null)

  const { controlledValues } = useForm<{ read: boolean }>({
    initialValues: { read: !!props.notification.read }
  })

  const notificationIcon = computed(() => {
    if (props.notification.type === 'NewHistoryElement') {
      if (props.notification.socialSupport?.socialSupportType === 'Followup') {
        return 'fr-icon-draft-line'
      }
      return 'fr-icon-questionnaire-line'
    }
    return notificationTypeClasses[props.notification.type]
  })

  const notificationTitle = computed(() => {
    return props.notification.title
  })

  const notificationDescription = computed(() => {
    const created = dayjs(props.notification.created)
    const dateInAMonth = dayjs(props.notification.created).add(1, 'month')

    switch (props.notification.type) {
      case 'DueDateOneMonth':
        return getDateNotificationDescription(
          dateInAMonth,
          'Échéance dans un mois',
          'Échéance'
        )
      case 'DueDateToday':
        return getDateNotificationDescription(created, 'Échéance')
      case 'EndOfSupport':
        return getDateNotificationDescription(created, 'Fin de prise en charge')
      default:
        return props.notification.description
    }
  })

  function getDateNotificationDescription(
    date: dayjs.Dayjs,
    label: string,
    pastLabel?: string
  ) {
    if (date.isSame(dayjs(), 'date')) {
      return `${label} aujourd'hui`
    }
    if (date.isSame(dayjs().subtract(1, 'day'), 'date')) {
      return `${label} hier`
    }
    if (date.isAfter(dayjs(), 'date')) {
      return `${label} le ${formatDate(date.toDate())}`
    }
    return `${pastLabel || label} passée le ${formatDate(date.toDate())}`
  }

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
    const { documentId, socialSupportId } = props.notification
    return documentId || socialSupportId || undefined
  }

  const itemLink = computed(() => {
    if (props.notification.beneficiary) {
      return RoutePath.AppBeneficiary(props.notification.beneficiary.id, {
        tab: getItemTab(),
        item: getItemId(),
        originPage: Route.AppOverview
      })
    }
    return null
  })

  const notificationDescriptionDetail = computed(() => {
    const itemCreatedByLabel = props.notification.itemCreatedBy
      ? formatUserDisplayName(props.notification.itemCreatedBy)
      : ''

    switch (props.notification.type) {
      case 'NewHistoryElement':
        return `ajoutée par ${itemCreatedByLabel}`
      case 'NewDocument':
      case 'NewComment':
        return `ajouté par ${itemCreatedByLabel}`
      case 'DueDateOneMonth':
      case 'DueDateToday':
      case 'EndOfSupport':
        if (
          props.notification.socialSupport?.socialSupportType === 'Followup'
        ) {
          return `sur la synthèse d'entretien`
        }
        return "sur l'instruction de dossier"
      default:
        return ''
    }
  })

  const toggleLabel = computed(() =>
    props.notification.read ? 'Marquer comme non lu' : 'Marquer comme lu'
  )

  watch(controlledValues, ({ read }) => {
    if (read !== props.notification.read) {
      updateReadState(read)
    }
  })

  function updateReadState(read: boolean) {
    useTrpcMutation({
      mutation: () =>
        useTrpcClient().notification.update.mutate({
          id: props.notification.id,
          read
        }),
      onSuccess: () => {
        emit('toggleReadState', read)
      },
      onFailure: () => {
        useSnackbar().error(
          "L'état de la notification n'a pas pu être mis à jour.",
          () => form.value?.querySelector('input')?.focus()
        )
      }
    })
  }
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/core/index' as dsfr;

  .notificationitem {
    border-top: 1px solid var(--border-default-grey);
    padding: 1rem 1.5rem;
    display: grid;
    grid-template-columns: auto 1fr 3fr min-content;
    gap: 1rem;
    align-items: center;

    &:not(.notificationitem__read) {
      background-color: var(--background-alt-blue-france);
    }
  }

  .notificationitem__icon {
    padding: 0.75rem;
    border-radius: 50%;

    &.fr-icon-file-text-line {
      background-color: var(--background-alt-yellow-tournesol);
      color: var(--text-label-yellow-tournesol);
    }

    &.fr-icon-calendar-event-line {
      background-color: var(--background-contrast-pink-tuile);
      color: var(--text-label-pink-tuile);
    }

    &.fr-icon-message-2-line {
      background-color: var(--background-contrast-blue-ecume);
      color: var(--text-label-blue-ecume);
    }

    &.fr-icon-questionnaire-line {
      background-color: var(--background-contrast-purple-glycine);
      color: var(--text-label-purple-glycine);
    }

    &.fr-icon-draft-line {
      background-color: var(--background-contrast-green-archipel);
      color: var(--text-label-green-archipel);
    }
  }

  .notificationitem__beneficiary {
    font-weight: 700;
    margin-bottom: 0;
  }

  .notificationitem__comment {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .notificationitem__end {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .notificationitem__comment,
  .notificationitem__date {
    color: var(--text-default-grey);
    margin-bottom: 0;
  }

  .notificationitem__read-form {
    align-self: flex-end;
  }

  .fr-link {
    font-weight: 700;
  }
</style>
