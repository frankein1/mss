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
  <OpenModalHack />
</template>

<script setup lang="ts">
  import { NotificationType } from '@prisma/client'
  import { AlertType } from '~/utils/constants/alert'
  import { NotificationTypeFilterValue } from '~/client/options'
  import { NOTIFICATIONS_REQUEST_LIMIT_DEFAULT } from '~/utils/constants'
  import ArchiveNotificationModal from '~/components/Archive/ArchiveNotificationModal.vue'
  import { routes } from '~/utils/routes'
  import { formatBeneficiaryName } from '~/utils/beneficiary'
  import { NotificationItemType } from './types'

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
          NotificationType.NewSocialSupportSubject,
          NotificationType.NewFollowupElement,
          NotificationType.NewFileInstructionElement
        ]
      case NotificationTypeFilterValue.Archive:
        return ['ArchiveDue']
      default:
        return [
          // All expect Archive type
          NotificationType.NewDocument,
          NotificationType.NewComment,
          NotificationType.DueDateToday,
          NotificationType.DueDateOneMonth,
          NotificationType.EndOfSupport,
          NotificationType.NewFileInstructionElement,
          NotificationType.UpdateFileInstructionElement,
          NotificationType.NewFollowupElement,
          NotificationType.UpdateFollowupElement,
          NotificationType.NewSocialSupportSubject
        ]
    }
  })

  // 94dea7ab-92e9-479a-9795-e4fdd4ef42af

  const queryInput = computed(() => {
    return {
      onlyUnread: !showReadNotifications.value,
      types: notificationTypes.value,
      perPage: NOTIFICATIONS_REQUEST_LIMIT_DEFAULT,
      page: 1
    }
  })

  const { data, error, pending } =
    await trpcClient.notification.get.useQuery(queryInput)

  const notifications = computed(() => {
    return addArchiveNotifications(
      data.value?.notifications as NotificationItemType[],
      filters.value.type
    )
  })
  const totalCount = computed(() => data.value?.totalCount || 0)

  const canSeeMore = computed(
    () => notifications.value.length < totalCount.value
  )

  watch(filters, () => {
    page.value = 1
  })

  const addArchiveNotifications = (
    baseNotifications: NotificationItemType[],
    filterType: NotificationTypeFilterValue | '' | undefined
  ) => {
    if (filterType != null) {
      return baseNotifications
    }
    if (filterType === NotificationTypeFilterValue.Archive) {
      return archiveNotifications.value
    }
    const notifs = archiveNotifications.value.slice(0, 3)
    if (data.value?.notifications && data.value.notifications.length > 0) {
      return notifs.concat(data.value.notifications as NotificationItemType[])
    }
    return notifs
  }

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

  // get archive notifications
  const { data: archiveData, refresh: refreshArchiveData } =
    await trpcClient.archiveNotification.get.useQuery()

  const beneficiariesToArchived = computed(() => {
    if (archiveData && archiveData.value) {
      return archiveData.value.map(notification => ({
        archiveDate: notification.archiveDate,
        beneficiary: notification.beneficiary,
        actionUrl: notification.beneficiary?.id
          ? routes.beneficiary.AppBeneficiariesArchive.path(
              notification.beneficiary.id
            )
          : null
      }))
    }
  })
  const archiveNotifications = computed(() => {
    if (archiveData.value && archiveData.value.length > 0) {
      return archiveData.value.map(
        notification =>
          ({
            id: notification.id,
            read: notification.read,
            title: 'Archive',
            beneficiary: notification.beneficiary,
            type: 'ArchiveDue',
            descriptionHint: notification.archiveDate
              ? `Dossier sans activité depuis 2 ans : suppression prévue le ${notification.archiveDate.toLocaleDateString()}.`
              : `Dossier sans activité depuis 2 ans.`,
            description: 'Gérer le dossier',
            detail: notification.detail,
            created: notification.created
          }) as NotificationItemType
      )
    }
    return []
  })

  const modal = useModal()
  refreshArchiveData()
  const unwatch = watch([modal.isReady, beneficiariesToArchived], () => {
    if (
      modal.isReady &&
      beneficiariesToArchived.value &&
      beneficiariesToArchived.value.length > 0
    ) {
      const firstNotification = beneficiariesToArchived.value[0]
      const beneficiaryNames = beneficiariesToArchived.value.map(notification =>
        formatBeneficiaryName({
          title: null,
          firstName: notification?.beneficiary?.firstName
            ? notification.beneficiary.firstName
            : '',
          usualName: notification?.beneficiary?.usualName
            ? notification.beneficiary.usualName
            : ''
        })
      )
      modal.open(ArchiveNotificationModal, {
        triggerOpen: true,
        title:
          beneficiariesToArchived.value.length > 1
            ? `Plusieurs dossiers sont inactifs depuis 2 ans : une action est requise.`
            : `Le dossier de ${beneficiaryNames[0]} est inactif depuis 2 ans : une action est requise.`,
        beneficiaryNames: beneficiaryNames,
        validate: () => {
          navigateTo(firstNotification.actionUrl)
          modal.close()
        }
      })

      unwatch()
    }
  })
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
