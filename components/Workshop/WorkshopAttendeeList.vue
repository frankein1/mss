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
            workshop._count.workshopAttendees
          }}</span>
          inscription<span v-if="workshop._count.workshopAttendees > 1">s</span>
        </p>
        <div
          v-if="workshop.workshopAttendees.length > 0"
          class="action"
        >
          <ExportDataButton
            title="Exporter liste émargement (.xlsx)"
            :is-downloading="isDownloading"
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
        v-if="workshop.workshopAttendees.length"
        class="attendee-list"
      >
        <li
          v-for="(attendee, idx) in workshop.workshopAttendees"
          :key="idx"
          class="fr-mb-1w"
        >
          <WorkshopAttendeeItem
            :attendee
            @delete-attendee="onDeleteAttendee"
            @change-attendance="onChangeAttendance"
          />
        </li>
      </ul>
      <WorkshopAttendeeEmpty v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { WorkshopWithAttendeesDetails } from '~/types/workshop'
  import type {
    WorkshopAttendeeAttendance,
    WorkshopAttendeeType
  } from '@prisma/client'
  import {
    FAILED_DOWNLOAD_ERROR_MESSAGE,
    INVALID_CODE_ERROR_MESSAGE
  } from '~/utils/constants'
  import WorkshopAttendeeItem from './WorkshopAttendeeItem.vue'
  import { getExportUrl } from '~/utils/export/getExportUrl'
  import { getExportFilename } from '~/utils/export/getExportFilename'
  import { isTRPCClientError } from '~/utils/error'
  import { WorkshopAction, EventCategory } from '~/types/matomo'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()
  const matomo = useMatomo()

  const isDownloading = ref(false)

  const { workshop } = defineProps<{
    workshop: WorkshopWithAttendeesDetails
  }>()

  const emit = defineEmits<{ refresh: [] }>()

  const { isReferent } = useAuthState()

  const hasSessionName = computed(() => {
    return workshop.sessionName != null && workshop.sessionName !== ''
  })

  const onDeleteAttendee = async (id: string, type: WorkshopAttendeeType) => {
    const { mutate, error } = trpcClient.workshop.deleteAttendee.useMutation()

    const deletedAttendee = await mutate({ id, type })

    if (error.value || deletedAttendee === null) {
      snackbar.error('La suppression du participant a échoué.')
      return
    }
    emit('refresh')
    matomo.trackEvent(EventCategory.Workshop, WorkshopAction.RemoveAttendee)
    snackbar.success('La suppression du participant a réussi.')
  }

  const onChangeAttendance = async (
    id: string,
    attendance: WorkshopAttendeeAttendance
  ) => {
    const { mutate, error } =
      trpcClient.workshop.updateAttendeeAttendance.useMutation()

    const result = await mutate({ id, attendance })

    if (error.value || result === null) {
      snackbar.error('La modification du participant a échoué.')
      return
    }
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
