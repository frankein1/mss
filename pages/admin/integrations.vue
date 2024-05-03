<template>
  <div class="fr-container--fluid fr-p-2w">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <h1>Data Inclusion</h1>
      </div>

      <div class="fr-col-12">
        <h2>Import des structures</h2>
      </div>
      <div class="fr-col-12">
        <JobResultFiltersAdmin
          class="fr-px-5v fr-mt-2w"
          @filter="filters = $event"
        />

        <JobResultTableAdmin
          v-show="!pending"
          v-model:sort="orderBy"
          :jobs
          :count
          :pending
          @refresh-emails="refresh"
        />

        <AtomPagination
          v-show="!pending"
          class="fr-mt-4w fr-px-5v"
          :page
          :per-page="perPage"
          :total-pages="totalPages"
          @change-page="updatePagination($event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { JobResultAdminSort, SortOrder } from '~/types/table'
  import { REQUEST_LIMIT_DEFAULT } from '~/utils/constants'
  import type { JobResultAdminFilterInput } from '~/server/schema'

  const trpcClient = useTrpcClient()

  const filters = ref<JobResultAdminFilterInput>({})
  const orderBy = ref<JobResultAdminSort>({ startDate: SortOrder.Desc })
  const page = ref(1)
  const perPage = ref(REQUEST_LIMIT_DEFAULT)

  const { updatePagination } = usePagination(page, perPage, filters)

  const queryInput = computed(() => ({
    filters: filters.value,
    orderBy: orderBy.value,
    page: page.value,
    perPage: perPage.value
  }))

  const { data, pending, refresh } =
    await trpcClient.admin.getJobResults.useQuery(queryInput)

  const jobs = computed(() => data.value?.jobs || [])

  const count = computed(() => data.value?.count || 0)

  const totalPages = computed(() => data.value?.totalPages || 0)
</script>
