<template>
  <div class="feature-section">
    <AtomAlert
      v-if="error"
      class="fr-mx-4w"
      :alert-type="AlertType.Error"
      message="La liste des instructions de demande d'aide n'a pas pu être chargée."
    />
    <template v-else>
      <HelpRequestsFilters
        class="fr-px-5v"
        @filter="filters = $event"
      />
      <hr />
      <div class="fr-mb-2w fr-mx-5v results-container">
        <p class="fr-hint-text results-count">
          {{ helpRequestsCount }} instruction(s) de demande d'aide
        </p>
        <ExportDataButton
          v-if="canExportHistory(authStore.getAuthUser)"
          :is-downloading="isDownloading"
          @export="exportHelpRequests"
        />
      </div>
      <div v-show="pending">
        <AtomLoader class="fr-mx-auto" />
      </div>
      <HelpRequestsTable
        v-show="!pending"
        v-model:sort="orderBy"
        :help-requests="helpRequests"
        :pending="pending"
        @help-request-updated="onHelpRequestUpdated"
      />
      <AtomPagination
        v-show="!pending"
        class="fr-mt-4w fr-px-5v"
        :page="page"
        :total-pages="totalPages"
        @change-page="updatePagination($event)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { HelpRequestItem } from './types'
  import { HelpRequestFilterInput } from '~/server/schema'
  import { HelpRequestSort, SortOrder } from '~/types/table'
  import { AlertType } from '~/utils/constants/alert'
  import { canExportHistory } from '~/server/security'
  import { useAuthStore } from '~/store/auth'
  import { useFiltersStore } from '~/store/filters'
  import {
    REQUEST_LIMIT_DEFAULT,
    FAILED_DOWNLOAD_ERROR_MESSAGE
  } from '~/utils/constants'
  import { getExportUrl } from '~/utils/export/getExportUrl'
  import { getExportFilename } from '~/utils/export/getExportFilename'

  const filtersStore = useFiltersStore()
  const trpcClient = useTrpcClient()
  const authStore = useAuthStore()

  const filters = ref<HelpRequestFilterInput>(filtersStore.helpRequest || {})
  const orderBy = ref<HelpRequestSort[]>([{ openingDate: SortOrder.Desc }])
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
    data: helpRequestsRequest,
    pending,
    error
  } = await trpcClient.helpRequest.getHelpRequests.useQuery(queryInput)

  const helpRequestsCount = computed(
    () => helpRequestsRequest.value?.count || 0
  )

  const helpRequests = computed(
    () => helpRequestsRequest.value?.helpRequests || []
  )

  const totalPages = computed(() => helpRequestsRequest.value?.totalPages || 0)

  function onHelpRequestUpdated(updatedHelpRequest: HelpRequestItem) {
    if (!helpRequestsRequest.value) {
      return
    }
    helpRequestsRequest.value.helpRequests =
      helpRequestsRequest.value.helpRequests.map(h =>
        h.id === updatedHelpRequest.id ? updatedHelpRequest : h
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
      downloadLink.download = getExportFilename('demandes_daide')
      downloadLink.click()
      downloadLink.remove()
    } catch {
      useSnackbar().error(FAILED_DOWNLOAD_ERROR_MESSAGE)
    } finally {
      isDownloading.value = false
    }
  }
</script>
