<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="feature-section">
    <AtomAlert
      v-if="error"
      class="fr-mx-4w"
      :alert-type="AlertType.Error"
      message="La liste des synthèses d'entretien n'a pas pu être chargée."
    />
    <template v-else>
      <FollowupsFilters
        class="fr-px-5v"
        @filter="filters = $event"
      />
      <hr />
      <div class="fr-mb-2w fr-mx-5v results-container">
        <p class="fr-hint-text results-count">
          {{ followupsCount }} synthèse(s) d'entretien
        </p>
        <ExportDataButton
          v-if="application.export.history"
          :is-downloading="isDownloading"
          @export="exportFollowups"
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
          class="fr-mt-4w fr-px-5v"
          :page="pageNumber"
          :per-page="perPage"
          :total-pages="totalPages"
          @change-page="updatePagination($event)"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import {
    FAILED_DOWNLOAD_ERROR_MESSAGE,
    REQUEST_LIMIT_DEFAULT
  } from '~/utils/constants'
  import type { FollowupFilterInput } from '~/server/schema'
  import { FollowupSort, SortOrder } from '~/types/table'
  import { getExportUrl } from '~/utils/export/getExportUrl'
  import { getExportFilename } from '~/utils/export/getExportFilename'

  const filtersState = useFilters()
  const trpcClient = useTrpcClient()

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

  async function exportFollowups() {
    isDownloading.value = true
    try {
      const exportedFollowups = await trpcClient.followup.getExport.query({
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
    } catch {
      useSnackbar().error(FAILED_DOWNLOAD_ERROR_MESSAGE)
    } finally {
      isDownloading.value = false
    }
  }
</script>
