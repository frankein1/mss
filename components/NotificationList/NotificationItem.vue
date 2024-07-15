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
      {{ notification.title }}
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
          >{{ notification.description }}</NuxtLink
        >
        {{ notification.descriptionHint }}
      </p>
      <p
        v-if="notification.detail"
        class="fr-text--sm notificationitem__comment"
      >
        {{ notification.detail }}
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
  import { NotificationType } from '@prisma/client'
  import { NotificationItem } from '~/server/trpc/routers'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { notificationTypeClasses } from '~/client/classes/notification'
  import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { formatDate } from '~/utils/formatDate'
  import { routes } from '~/routes'

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
    return notificationTypeClasses[props.notification.type]
  })

  function getItemTab() {
    switch (props.notification.type) {
      case NotificationType.NewDocument:
        return BeneficiaryTab.Documents
      case NotificationType.DueDateToday:
      case NotificationType.DueDateOneMonth:
      case NotificationType.EndOfSupport:
      case NotificationType.NewComment:
      case NotificationType.NewFollowupElement:
      case NotificationType.NewFileInstructionElement:
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
      return routes.beneficiary.AppBeneficiary.path(
        props.notification.beneficiary.id,
        {
          tab: getItemTab(),
          item: getItemId(),
          originPage: routes.user.AppOverview.name
        }
      )
    }
    return routes.structure.AppStructure.path()
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

    &.fr-icon-settings-5-line {
      background-color: var(--beige-gris-galet-975);
      color: var(--beige-gris-galet-sun-407);
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
