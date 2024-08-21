<template>
  <div
    v-if="error"
    class="feature-section"
  >
    <AtomAlert
      :alert-type="AlertType.Error"
      message="La liste des instructions de dossier n'a pas pu être chargée."
    />
  </div>
  <template v-else>
    <section class="feature-section fr-mb-3w">
      <h3 class="fr-sr-only">Filtres</h3>
      <FileInstructionsFilters v-model:filters="filters" />
    </section>

    <section class="feature-section">
      <h3 class="fr-sr-only">Liste des instructions de dossier</h3>

      <div class="fr-mb-2w results-container">
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
          :file-instruction-type-filter="filters.fileInstructionType"
        />
        <AtomPagination
          class="fr-mt-4w"
          :page="page"
          :per-page="perPage"
          :total-pages="totalPages"
          @change-page="updatePagination($event)"
        />
      </template>
    </section>
  </template>
</template>

<script setup lang="ts">
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
