<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    v-if="error"
    class="feature-section"
  >
    <AtomAlert
      :alert-type="AlertType.Error"
      message="La liste des synthèses d'entretien n'a pas pu être chargée."
    />
  </div>
  <template v-else>
    <section class="feature-section fr-mb-3w">
      <h3 class="fr-sr-only">Filtres</h3>
      <FollowupsFilters v-model:filters="filters" />
    </section>
    <section class="feature-section">
      <h3 class="fr-sr-only">Liste des synthèses d'entretien</h3>

      <div class="fr-mb-2w results-container">
        <p class="fr-hint-text results-count">
          {{ followupsCount }} synthèse(s) d'entretien
        </p>
        <ExportDataButton
          v-if="application.export.history"
          :is-downloading="isDownloading"
          :has-filters="true"
          :export="exportFollowups"
        />
      </div>
      <div v-if="pending">
        <AtomLoader class="fr-mx-auto" />
      </div>
      <template v-else>
        <FollowupsTable
          v-model:sort="orderBy"
          :items="pageItems"
          :pending="pending"
        />
        <AtomPagination
          class="fr-mt-4w"
          :page="pageNumber"
          :per-page="perPage"
          :total-pages="totalPages"
          @change-page="updatePagination($event)"
        />
      </template>
    </section>
  </template>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import {
    FAILED_DOWNLOAD_ERROR_MESSAGE,
    INVALID_CODE_ERROR_MESSAGE,
    REQUEST_LIMIT_DEFAULT
  } from '~/utils/constants'
  import type { FollowupFilterInput } from '~~/server/schema'
  import type { FollowupSort } from '~~/types/table'
  import { SortOrder } from '~~/types/table'
  import { getExportUrl } from '~/utils/export/getExportUrl'
  import { getExportFilename } from '~/utils/export/getExportFilename'
  import { EventCategory, ExportHistoryEventAction } from '~~/types/matomo'
  import type { FilterFollowupNotFilled } from '~/utils/constants/filters'
  import { isTRPCClientError } from '~/utils/error'

  const route = useRoute()
  const filtersState = useFilters()
  const trpcClient = useTrpcClient()

  const notFilled = route.query['not-filled'] as FilterFollowupNotFilled
  if (notFilled) {
    if (filtersState.followup.value) {
      filtersState.followup.value.notFilled = notFilled
    } else {
      filtersState.followup.value = { notFilled }
    }
  }

  const filters = ref<FollowupFilterInput>(filtersState.followup.value || {})
  const orderBy = ref<FollowupSort>({ socialSupport: { date: SortOrder.Desc } })
  const pageNumber = ref(1)
  const perPage = ref(REQUEST_LIMIT_DEFAULT)
  const isDownloading = ref(false)

  const { updatePagination } = usePagination(pageNumber, perPage, filters)

  const { application } = usePermissions()

  const queryInput = computed(() => ({
    orderBy: orderBy.value,
    filters: filters.value,
    page: pageNumber.value,
    perPage: perPage.value
  }))

  const {
    data: pageData,
    pending,
    error
  } = await trpcClient.followup.getPage.useQuery(queryInput)

  const followupsCount = computed(() => pageData.value?.count || 0)

  const pageItems = computed(() => pageData.value?.items || [])

  const totalPages = computed(() => pageData.value?.totalPages || 0)

  const modal = useModal()
  async function exportFollowups(code: string) {
    isDownloading.value = true
    useMatomo().trackEvent(
      EventCategory.ExportHistory,
      ExportHistoryEventAction.Followups
    )

    try {
      const exportedFollowups = await trpcClient.followup.getExport.query({
        code,
        orderBy: orderBy.value,
        filters: filters.value
      })
      if (!exportedFollowups.data) {
        throw new Error('no data')
      }
      const downloadLink = document.createElement('a')
      downloadLink.href = getExportUrl(exportedFollowups.data)
      downloadLink.download = getExportFilename('entretiens')
      downloadLink.click()
      downloadLink.remove()

      modal.close()
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
