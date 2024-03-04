<template>
  <div class="feature-section">
    <AtomAlert
      v-if="error"
      class="fr-mx-4w"
      :alert-type="AlertType.Error"
      message="La liste des instructions de dossier n'a pas pu être chargée."
    />
    <template v-else>
      <FileInstructionsFilters
        v-model:filters="filters"
        class="fr-px-5v"
      />
      <hr />
      <div class="fr-mb-2w fr-mx-5v results-container">
        <p class="fr-hint-text results-count">
          {{ fileInstructionCount }} instruction(s) de dossier
        </p>
        <ExportDataButton
          v-if="application.export.history"
          :is-downloading="isDownloading"
          @export="exportFileInstructions"
        />
      </div>
      <div v-if="pending">
        <AtomLoader class="fr-mx-auto" />
      </div>
      <template v-else>
        <FileInstructionsTable
          v-model:sort="orderBy"
          :items="items"
          :pending="pending"
          @file-instruction-updated="onFileInstructionUpdated"
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
  import { FileInstructionPageItem } from './types'
  import { FileInstructionFilterInput } from '~/server/schema'
  import { FileInstructionSort, SortOrder } from '~/types/table'
  import { AlertType } from '~/utils/constants/alert'
  import {
    REQUEST_LIMIT_DEFAULT,
    FAILED_DOWNLOAD_ERROR_MESSAGE
  } from '~/utils/constants'
  import { getExportUrl } from '~/utils/export/getExportUrl'
  import { getExportFilename } from '~/utils/export/getExportFilename'
  import { EventCategory, ExportHistoryEventAction } from '~/types/matomo'

  const filtersState = useFilters()
  const trpcClient = useTrpcClient()
  const { application } = usePermissions()

  const filters = ref<FileInstructionFilterInput>(
    filtersState.fileInstruction.value || {}
  )
  const orderBy = ref<FileInstructionSort>({
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
  } = await trpcClient.fileInstruction.getPage.useQuery(queryInput)

  const fileInstructionCount = computed(() => pageData.value?.count || 0)

  const items = computed(() => pageData.value?.items || [])

  const totalPages = computed(() => pageData.value?.totalPages || 0)

  function onFileInstructionUpdated(
    updatedFileInstruction: FileInstructionPageItem
  ) {
    if (!pageData.value) {
      return
    }

    pageData.value.items = pageData.value.items.map(item =>
      item.fileInstruction.id === updatedFileInstruction.fileInstruction.id
        ? updatedFileInstruction
        : item
    )
  }

  async function exportFileInstructions() {
    isDownloading.value = true
    useMatomo().trackEvent(
      EventCategory.ExportHistory,
      ExportHistoryEventAction.FileInstructions
    )

    try {
      const exportedFileInstructions =
        await trpcClient.fileInstruction.exportFileInstructions.query({
          orderBy: orderBy.value,
          filters: filters.value
        })
      if (!exportedFileInstructions.data) {
        throw new Error('no data')
      }
      const downloadLink = document.createElement('a')
      downloadLink.href = getExportUrl(exportedFileInstructions.data)
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
