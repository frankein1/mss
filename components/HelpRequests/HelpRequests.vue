<template>
  <div class="feature-section">
    <AtomAlert
      v-if="error"
      class="fr-mx-4w"
      :alert-type="AlertType.Error"
      message="La liste des instructions de dossier n'a pas pu être chargée."
    />
    <template v-else>
      <HelpRequestsFilters
        class="fr-px-5v"
        @filter="filters = $event"
      />
      <hr />
      <div class="fr-mb-2w fr-mx-5v results-container">
        <p class="fr-hint-text results-count">
          {{ helpRequestsCount }} instruction(s) de dossier
        </p>
        <ExportDataButton
          v-if="application.export.history"
          :is-downloading="isDownloading"
          @export="exportHelpRequests"
        />
      </div>
      <div v-if="pending">
        <AtomLoader class="fr-mx-auto" />
      </div>
      <template v-else>
        <HelpRequestsTable
          v-model:sort="orderBy"
          :items="items"
          :pending="pending"
          @help-request-updated="onHelpRequestUpdated"
        />
        <AtomPagination
          class="fr-mt-4w fr-px-5v"
          :page="page"
          :per-page="perPage"
          :total-pages="totalPages"
          @change-page="updatePagination($event)"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { HelpRequestPageItem } from './types'
  import { HelpRequestFilterInput } from '~/server/schema'
  import { HelpRequestSort, SortOrder } from '~/types/table'
  import { AlertType } from '~/utils/constants/alert'
  import {
    REQUEST_LIMIT_DEFAULT,
    FAILED_DOWNLOAD_ERROR_MESSAGE
  } from '~/utils/constants'
  import { getExportUrl } from '~/utils/export/getExportUrl'
  import { getExportFilename } from '~/utils/export/getExportFilename'

  const filtersState = useFilters()
  const trpcClient = useTrpcClient()
  const { application } = usePermissions()

  const filters = ref<HelpRequestFilterInput>(
    filtersState.helpRequest.value || {}
  )
  const orderBy = ref<HelpRequestSort>({
    socialSupport: { date: SortOrder.Desc }
  })
  const page = ref(1)
  const perPage = ref(REQUEST_LIMIT_DEFAULT)
  const isDownloading = ref(false)

  const { updatePagination } = usePagination(page, perPage, filters)

  const queryInput = computed(() => ({
    orderBy: orderBy.value,
    filters: filters.value,
    page: page.value,
    perPage: perPage.value
  }))

  const {
    data: pageData,
    pending,
    error
  } = await trpcClient.helpRequest.getPage.useQuery(queryInput)

  const helpRequestsCount = computed(() => pageData.value?.count || 0)

  const items = computed(() => pageData.value?.items || [])

  const totalPages = computed(() => pageData.value?.totalPages || 0)

  function onHelpRequestUpdated(updatedHelpRequest: HelpRequestPageItem) {
    if (!pageData.value) {
      return
    }

    pageData.value.items = pageData.value.items.map(item =>
      item.helpRequest.id === updatedHelpRequest.helpRequest.id
        ? updatedHelpRequest
        : item
    )
  }

  async function exportHelpRequests() {
    isDownloading.value = true
    try {
      const exportedHelpRequests =
        await trpcClient.helpRequest.exportHelpRequests.query({
          orderBy: orderBy.value,
          filters: filters.value
        })
      if (!exportedHelpRequests.data) {
        throw new Error('no data')
      }
      const downloadLink = document.createElement('a')
      downloadLink.href = getExportUrl(exportedHelpRequests.data)
      downloadLink.download = getExportFilename('instructions_dosser')
      downloadLink.click()
      downloadLink.remove()
    } catch {
      useSnackbar().error(FAILED_DOWNLOAD_ERROR_MESSAGE)
    } finally {
      isDownloading.value = false
    }
  }
</script>
