<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
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
        <p class="fr-hint-text">{{ followupsCount }} synthèse(s) d'entretien</p>
        <ExportDataButton
          :is-downloading="isDownloading"
          @export="exportFollowups"
        />
      </div>
      <div v-show="pending">
        <AtomLoader class="fr-mx-auto" />
      </div>
      <FollowupsTable
        v-show="!pending"
        :followups="followups"
        @sort="onSort"
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
  import { AlertType } from '~/utils/constants/alert'
  import {
    FAILED_DOWNLOAD_ERROR_MESSAGE,
    REQUEST_LIMIT_DEFAULT
  } from '~/utils/constants'
  import type { FollowupFilterInput } from '~/server/schema'
  import { useFiltersStore } from '~/store/filters'
  import { FollowupSort, SortOrder } from '~/types/table'
  import { getExportUrl } from '~/utils/export/getExportUrl'
  import { getExportFilename } from '~/utils/export/getExportFilename'

  const filtersStore = useFiltersStore()
  const trpcClient = useTrpcClient()

  const filters = ref<FollowupFilterInput>(filtersStore.followup || {})
  const orderBy = ref<FollowupSort[]>([{ date: SortOrder.Desc }])
  const page = ref(1)
  const perPage = ref(REQUEST_LIMIT_DEFAULT)
  const isDownloading = ref(false)

  const { updatePagination } = usePagination(page, perPage)
  const { onSort } = useSort<FollowupSort>(orderBy)

  const exportInput = computed(() => ({
    orderBy: orderBy.value,
    filters: filters.value
  }))

  const queryInput = computed(() => ({
    ...exportInput.value,
    page: page.value,
    perPage: perPage.value
  }))

  const {
    data: followupsRequest,
    pending,
    error
  } = await trpcClient.followup.getFollowups.useQuery(queryInput, {
    default: () => ({
      followups: [],
      count: 0,
      totalPages: 0
    }),
    transform: v => v // FIXME: Nuxt can't type array picks too. You can use the transform option for now to get proper types - https://github.com/wobsoriano/trpc-nuxt/issues/22#issuecomment-1270863820
  })

  const followupsCount = computed(() => followupsRequest.value?.count || 0)

  const followups = computed(() => followupsRequest.value?.followups || [])

  const totalPages = computed(() => followupsRequest.value?.totalPages || 0)

  async function exportFollowups() {
    isDownloading.value = true
    try {
      const exportedFollowups = await trpcClient.followup.exportFollowups.query(
        exportInput.value
      )
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
