<template>
  <div class="fr-grid-row fr-grid-row--gutters attendees-container">
    <div class="fr-col-12 fr-mt-3w">
      <div class="registration">
        <img
          src="/pictograms/tickets.svg"
          alt=""
        />
        <p class="registration-count">
          <span class="cont-emphasis">{{
            workshop._count.workshopAttendees
          }}</span>
          inscription<span v-if="workshop._count.workshopAttendees > 1">s</span>
        </p>
        <div
          v-if="attendees.length > 0"
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
        v-if="attendees.length"
        class="attendee-list"
      >
        <li
          v-for="(attendee, idx) in attendees"
          :key="idx"
          class="fr-mb-1w"
        >
          <WorkshopAttendeeItem
            :attendee="attendee"
            @delete-attendee="emit('deleteAttendee', $event)"
            @change-attendance="onChangeAttendance"
          />
        </li>
      </ul>
      <WorkshopAttendeeEmpty v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { WorkshopWithAttendeesDetails } from '~/types/workshop'
  import WorkshopAttendeeItem from './WorkshopAttendeeItem.vue'
  import { WorkshopAttendeeAttendance } from '@prisma/client'
  import {
    FAILED_DOWNLOAD_ERROR_MESSAGE,
    INVALID_CODE_ERROR_MESSAGE
  } from '~/utils/constants'
  import { getExportUrl } from '~/utils/export/getExportUrl'
  import { getExportFilename } from '~/utils/export/getExportFilename'
  import { isTRPCClientError } from '~/utils/error'

  const trpcClient = useTrpcClient()
  const isDownloading = ref(false)

  const { workshop } = defineProps<{
    workshop: WorkshopWithAttendeesDetails
  }>()

  const emit = defineEmits<{
    deleteAttendee: [id: string]
    changeAttendance: [id: string, attendance: WorkshopAttendeeAttendance]
  }>()

  const { isReferent } = useAuthState()

  const attendees = computed(() => {
    return workshop.workshopAttendees
  })

  const onChangeAttendance = (
    attendeeId: string,
    attendance: WorkshopAttendeeAttendance
  ) => {
    emit('changeAttendance', attendeeId, attendance)
  }
  // get Excel file
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

      .cont-emphasis {
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
