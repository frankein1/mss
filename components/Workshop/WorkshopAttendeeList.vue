<template>
  <div class="fr-grid-row fr-grid-row--gutters attendees-container">
    <div class="fr-col-12 fr-mt-3w">
      <div class="registration">
        <img
          src="/pictograms/tickets.svg"
          alt=""
        />
        <p
          class="registration-count"
          role="heading"
          :aria-level="hasSessionName ? '4' : '3'"
        >
          <span class="count-emphasis">{{
            workshop._count.mainAttendees
          }}</span>
          <span v-if="workshop.attendeeLimit"
            >/{{ workshop.attendeeLimit }}</span
          >
          inscription<span v-if="workshop._count.mainAttendees > 1">s</span>
          <span
            v-if="workshop.attendeeLimit"
            class="waiting-count"
            >{{ workshop._count.waitingAttendees }} sur liste d'attente</span
          >
        </p>
        <div
          v-if="workshop.workshopAttendees.length > 0"
          class="action"
        >
          <ExportDataButton
            title="Exporter liste émargement (.xlsx)"
            :is-downloading="isDownloading"
            :has-filters="false"
            @export="getExportedAttendance"
          />
        </div>
      </div>
    </div>
    <div
      v-if="isReferent()"
      class="fr-col-12"
    >
      <DsfrAlert
        description='Votre compte est associé à un rôle utilisateur "référent" qui vous permet de voir uniquement les informations des personnes pour lesquelles vous êtes référent du dossier. Certaines personnes inscrites sont donc peut-être masquées.'
        title="Tous les participants ne sont peut-être pas visibles"
        type="warning"
      />
    </div>
    <div class="fr-col-12">
      <ul
        v-if="attendeeLists.Main?.length"
        class="attendee-list"
      >
        <li
          v-for="(attendee, idx) in attendeeLists.Main"
          :key="idx"
          class="fr-mb-1w"
        >
          <WorkshopAttendeeItem
            :attendee
            :is-workshop-chargeable="workshop.chargeable"
            @delete-attendee="onDeleteAttendee"
            @change-attendance="onChangeAttendance"
            @refresh="emit('refresh')"
          />
        </li>
      </ul>
      <WorkshopAttendeeEmpty v-else />
    </div>
    <div
      v-if="shouldShowWaitingList"
      class="fr-col-12"
    >
      <p
        class="waiting-list"
        role="heading"
        :aria-level="hasSessionName ? '4' : '3'"
      >
        <span class="count-emphasis">{{
          workshop._count.waitingAttendees
        }}</span>
        personne<span v-if="workshop._count.waitingAttendees > 1">s</span>
        sur liste d’attente
      </p>
      <hr />
      <ul
        v-if="attendeeLists.Waiting?.length"
        class="attendee-list"
      >
        <li
          v-for="(attendee, idx) in attendeeLists.Waiting"
          :key="idx"
          class="fr-mb-1w"
        >
          <WorkshopAttendeeItem
            :attendee
            :is-workshop-full
            :is-workshop-chargeable="workshop.chargeable"
            @delete-attendee="onDeleteAttendee"
            @change-attendance="onChangeAttendance"
            @transfer-attendee="onTransferAttendee"
            @refresh="emit('refresh')"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type {
    WorkshopAttendee,
    WorkshopWithAttendeesDetails
  } from '~/types/workshop'
  import {
    WorkshopAttendeeListType,
    type WorkshopAttendeeAttendance
  } from '@prisma/client'
  import {
    FAILED_DOWNLOAD_ERROR_MESSAGE,
    INVALID_CODE_ERROR_MESSAGE
  } from '~/utils/constants'
  import WorkshopAttendeeItem from './WorkshopAttendeeItem.vue'
  import { getExportUrl } from '~/utils/export/getExportUrl'
  import { getExportFilename } from '~/utils/export/getExportFilename'
  import { isTRPCClientError, MSS_ERROR_CODES } from '~/utils/error'
  import { WorkshopAction, EventCategory } from '~/types/matomo'
  import WorkshopCapacityModal from './WorkshopCapacityModal.vue'
  import groupBy from '~/utils/groupBy'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()
  const matomo = useMatomo()
  const modal = useModal()

  const isDownloading = ref(false)

  const { workshop } = defineProps<{
    workshop: WorkshopWithAttendeesDetails
  }>()

  const emit = defineEmits<{ refresh: [] }>()

  const isWorkshopFull = computed(
    () => workshop.attendeeLimit === workshop._count.mainAttendees
  )

  const { isReferent } = useAuthState()

  const hasSessionName = computed(() => {
    return workshop.sessionName != null && workshop.sessionName !== ''
  })

  const shouldShowWaitingList = computed(
    () =>
      workshop.attendeeLimit !== null &&
      (isWorkshopFull.value || workshop._count.waitingAttendees > 0)
  )

  const attendeeLists = computed(() =>
    groupBy(workshop.workshopAttendees, ({ listType }) => listType)
  )

  const transferAttendeeMutation =
    trpcClient.workshop.updateAttendeeListType.useMutation()
  const updateAttendeeAttendanceMutation =
    trpcClient.workshop.updateAttendeeAttendance.useMutation()
  const deleteAttendeeMutation =
    trpcClient.workshop.deleteAttendee.useMutation()

  const onDeleteAttendee = async (attendee: WorkshopAttendee) => {
    const { id, listType, type } = attendee
    const { mutate, error } = deleteAttendeeMutation

    const deletedAttendee = await mutate({ id, type })

    if (error.value || deletedAttendee === null) {
      snackbar.error('La suppression du participant a échoué.')
      return
    }
    emit('refresh')
    matomo.trackEvent(EventCategory.Workshop, WorkshopAction.RemoveAttendee)
    snackbar.success('La suppression du participant a réussi.')
    if (listType === WorkshopAttendeeListType.Main && isWorkshopFull.value) {
      modal.open(WorkshopCapacityModal, {
        triggerOpen: true,
        isFull: false
      })
    }
  }

  function getTransferErrorMessage(
    error: NonNullable<typeof transferAttendeeMutation.error.value>
  ) {
    if (error?.data?.MSS_CODE === MSS_ERROR_CODES.WORKSHOP_ALREADY_FULL) {
      return 'L’atelier est complet. Augmentez la limite de participants pour pouvoir en ajouter de nouveaux.'
    }
    return 'Le transfert du participant a échoué.'
  }

  const onTransferAttendee = async (id: string) => {
    const { mutate, error } = transferAttendeeMutation
    await mutate({
      id,
      listType: WorkshopAttendeeListType.Main
    })

    if (error.value) {
      snackbar.error(getTransferErrorMessage(error.value))
      return
    }
    emit('refresh')
    matomo.trackEvent(EventCategory.Workshop, WorkshopAction.TransferAttendee)
    snackbar.success('Le transfert du participant a réussi.')
  }

  const onChangeAttendance = async (
    id: string,
    attendance: WorkshopAttendeeAttendance
  ) => {
    const { mutate, error } = updateAttendeeAttendanceMutation

    const result = await mutate({ id, attendance })

    if (error.value || !result) {
      snackbar.error('La modification du participant a échoué.')
      return
    }
    emit('refresh')
    snackbar.success('La modification du participant a réussi.')
  }

  const getExportedAttendance = async (code: string) => {
    isDownloading.value = true

    try {
      const exportedFile =
        await trpcClient.workshop.getExportedAttendance.query({
          code,
          workshopId: workshop.id
        })
      if (!exportedFile.data) {
        throw new Error('no data')
      }
      const downloadLink = document.createElement('a')
      downloadLink.href = getExportUrl(exportedFile.data)
      downloadLink.download = getExportFilename('émargement')
      downloadLink.click()
      downloadLink.remove()
      matomo.trackEvent(
        EventCategory.Workshop,
        WorkshopAction.DownloadPresenceList
      )

      useModal().close()
    } catch (err: unknown) {
      if (isTRPCClientError(err)) {
        const msg =
          err.data?.code === 'FORBIDDEN'
            ? INVALID_CODE_ERROR_MESSAGE
            : FAILED_DOWNLOAD_ERROR_MESSAGE
        useSnackbar().error(msg)
      } else {
        useSnackbar().error(FAILED_DOWNLOAD_ERROR_MESSAGE)
      }
    } finally {
      isDownloading.value = false
    }
  }
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .waiting-list {
    font-size: 1.5rem;
    font-weight: 700;

    .count-emphasis {
      font-size: 2.25rem;
      color: var(--primary);
    }
  }

  .registration {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;

    p {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;

      .count-emphasis {
        font-size: 2.25rem;
        color: var(--primary);
      }

      .waiting-count {
        font-size: 1.25rem;
        color: var(--primary);
        margin-left: 1rem;
      }
    }

    div.action {
      flex-grow: 1;
      text-align: end;
    }
  }

  .attendee-list {
    --ul-start: 0;
    --xl-block: 0;
    --ul-type: none;

    list-style-type: var(--ul-type);
    padding-inline-start: var(--ul-start);
  }
</style>
