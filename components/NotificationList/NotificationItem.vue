<template>
  <li
    class="notification-item-container"
    :class="{ notificationitem__read: notification.read }"
  >
    <div class="notification-item-icon">
      <div
        class="notificationitem__icon"
        :class="[notificationIcon]"
        aria-hidden="true"
      ></div>
    </div>
    <div class="notification-item-title">
      <p class="fr-text--sm fr-text--bold fr-mb-0">
        {{ notification.title }}
      </p>
    </div>
    <div class="notification-item-content">
      <div>
        <p
          v-if="notification.beneficiary"
          class="notificationitem__beneficiary"
        >
          {{ formatBeneficiaryDisplayName(notification.beneficiary) }}
        </p>
        <p
          v-if="notification.type === NotificationType.ArchiveDueToday"
          class="fr-mb-0"
        >
          {{ notification.descriptionHint }}
          <br />
          <NuxtLink
            v-if="itemLink && !notification.onClick"
            class="fr-link"
            :to="itemLink"
            >{{ notification.description }}
          </NuxtLink>
          <button
            v-if="notification.onClick"
            class="fr-link underline"
            @click="notification.onClick"
          >
            {{ notification.description }}
          </button>
        </p>
        <p
          v-else
          class="fr-mb-0"
        >
          <NuxtLink
            v-if="itemLink"
            class="fr-link"
            :to="itemLink"
            >{{ notification.description }}
          </NuxtLink>
          {{ notification.descriptionHint }}
        </p>
        <p
          v-if="notification.detail"
          class="fr-text--sm notificationitem__comment"
        >
          {{ notification.detail }}
        </p>
      </div>
    </div>
    <div class="notification-item-date">
      <p class="fr-text--xs notificationitem__date">
        {{ formatDateToLocalTimezone(notification.created) }}
      </p>
    </div>
    <div class="notification-item-checkbox">
      <form
        v-if="notification.read != null"
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
  import { NotificationType } from '~/prisma/generated/client'
  import { BeneficiaryTab } from '~/utils/constants/beneficiary'
  import { notificationTypeClasses } from '~/client/classes/notification'
  import { formatBeneficiaryDisplayName } from '~/utils/beneficiary'
  import { routes } from '~/utils/routes'
  import type { NotificationItemType } from './types'

  const props = defineProps<{
    notification: NotificationItemType
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
      case NotificationType.UpdateFollowupElement:
      case NotificationType.NewFileInstructionElement:
      case NotificationType.UpdateFileInstructionElement:
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
    if (
      (props.notification.type === NotificationType.ArchiveDueToday ||
        props.notification.type === NotificationType.ArchiveDueOneMonth ||
        props.notification.type === NotificationType.ArchiveDueSevenDays) &&
      props.notification.beneficiary
    ) {
      return routes.beneficiary.AppBeneficiariesArchive.path(
        props.notification.beneficiary.id
      )
    }
    if (props.notification.beneficiary) {
      return routes.file.AppFile.path(
        props.notification.beneficiary.familyFile.id,
        {
          tab: getItemTab(),
          item: getItemId(),
          beneficiaryId: props.notification.beneficiary.id,
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
  @use '@gouvfr/dsfr/src/dsfr/core/index' as dsfr;
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .notification-item-container {
    border-top: 1px solid var(--border-default-grey);
    padding: 1rem 1.5rem;
    display: grid;
    grid-template-columns: 3rem auto 2rem;
    grid-template-rows: repeat(3, auto);
    grid-gap: 1rem;
    align-items: center;

    &:not(.notificationitem__read) {
      background-color: var(--background-alt-blue-france);
    }

    .notification-item-icon {
      grid-area: 1 / 1 / 2 / 2;
    }

    .notification-item-title {
      grid-area: 1 / 2 / 2 / 4;
    }

    .notification-item-content {
      grid-area: 2 / 1 / 3 / 4;
    }

    .notification-item-date {
      grid-area: 3 / 1 / 4 / 3;
      place-self: end start;
    }

    .notification-item-checkbox {
      grid-area: 3 / 3 / 4 / 4;
    }

    @include dsfr-media-query.respond-from('lg') {
      grid-template-columns: 3rem 6.5rem auto auto;
      grid-template-rows: repeat(2, auto);

      .notification-item-icon {
        grid-area: 1 / 1 / 3 / 2;
      }

      .notification-item-title {
        grid-area: 1 / 2 / 3 / 3;
      }

      .notification-item-content {
        grid-area: 1 / 3 / 3 / 4;
      }

      .notification-item-date {
        grid-area: 1 / 4 / 2 / 5;
        place-self: start end;
      }

      .notification-item-checkbox {
        grid-area: 2 / 4 / 3 / 5;
        justify-self: end;
      }
    }
  }

  .notificationitem__icon {
    padding: 0.75rem;
    border-radius: 50%;
    width: 48px;
    height: 48px;

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

    &.ri-folder-close-line {
      background-color: #fee9e7;
      color: #a94645;
    }
  }

  .ri-folder-close-line::before {
    content: url('data:image/svg+xml,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H13V19H4V5H9.58579L11.5858 7H20V12H22V6C22 5.44772 21.5523 5 21 5H12.4142L10.4142 3H3ZM20.4143 17.9999L22.5356 20.1212L21.1214 21.5354L19.0001 19.4141L16.8788 21.5354L15.4646 20.1212L17.5859 17.9999L15.4646 15.8786L16.8788 14.4644L19.0001 16.5857L21.1214 14.4644L22.5356 15.8786L20.4143 17.9999Z" fill="%23A94645"/></svg>');
    width: 24px;
    height: 24px;
    background-color: inherit;
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
