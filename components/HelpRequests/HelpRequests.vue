<template>
  <div>
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
      <p class="fr-mb-2w fr-mx-5v fr-hint-text">
        {{ helpRequestsCount }} instructions(s) de demande d'aide
      </p>
      <div v-show="pending">
        <AtomLoader class="fr-mx-auto" />
      </div>
      <HelpRequestsTable
        v-show="!pending"
        :help-requests="helpRequests"
        @sort="onSort"
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
  import { useFiltersStore } from '~/store/filters'
  import { REQUEST_LIMIT_DEFAULT } from '~/utils/constants'

  const filtersStore = useFiltersStore()

  const filters = ref<HelpRequestFilterInput>(filtersStore.helpRequest || {})
  const orderBy = ref<HelpRequestSort[]>([{ openingDate: SortOrder.Desc }])
  const page = ref(1)
  const perPage = ref(REQUEST_LIMIT_DEFAULT)

  const { updatePagination } = usePagination(page, perPage)
  const { onSort } = useSort<HelpRequestSort>(orderBy)

  const queryInput = computed(() => ({
    page: page.value,
    perPage: perPage.value,
    orderBy: orderBy.value,
    filters: filters.value
  }))

  const {
    data: helpRequestsRequest,
    pending,
    error
  } = await useTrpcClient().helpRequest.getHelpRequests.useQuery(queryInput, {
    default: () => ({
      helpRequests: [],
      count: 0,
      totalPages: 0
    }),
    transform: v => v // FIXME: Nuxt can't type array picks too. You can use the transform option for now to get proper types - https://github.com/wobsoriano/trpc-nuxt/issues/22#issuecomment-1270863820
  })

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
</script>
