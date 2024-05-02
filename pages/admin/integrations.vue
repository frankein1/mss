<template>
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <h1>Data Inclusion</h1>
      </div>

      <div class="fr-col-12">
        <h2>Jobs d'import des structures</h2>
      </div>
      <div class="fr-col-12">
        <JobResultFiltersAdmin
          class="fr-px-5v fr-mt-2w"
          @filter="filters = $event"
        />
        <JobResultTableAdmin
          v-show="!pending"
          v-model:sort="orderBy"
          :jobs="jobs"
          :pending="pending"
          @refresh-emails="refresh"
        />
        <AtomPagination
          v-show="!pending"
          class="fr-mt-4w fr-px-5v"
          :page="page"
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
  // import { formatSearchPattern } from '~/utils/formatSearchPattern'
  import type { JobResultAdminFilterInput } from '~/server/schema'

  const trpcClient = useTrpcClient()

  // const search = ref<string>()
  const filters = ref<JobResultAdminFilterInput>({})
  const orderBy = ref<JobResultAdminSort>({ startDate: SortOrder.Desc })
  const page = ref(1)
  const perPage = ref(REQUEST_LIMIT_DEFAULT)

  const { updatePagination } = usePagination(page, perPage, filters)

  const queryInput = computed(() => ({
    name: 'data-inclusion-structure-import',
    // search: search.value,
    filters: filters.value,
    orderBy: orderBy.value,
    page: page.value,
    perPage: perPage.value
  }))

  const { data, pending, refresh } =
    await trpcClient.admin.getJobResults.useQuery(queryInput)

  const jobs = computed(() => data.value?.jobs || [])

  const totalPages = computed(() => data.value?.totalPages || 0)

  // function onSearch(event: Event) {
  //   const input = event.target as HTMLInputElement
  //   const value = formatSearchPattern(input.value)
  //   search.value = value
  // }
</script>
