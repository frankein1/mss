<template>
  <div
    id="followups-panel"
    class="fr-tabs__panel fr-tabs__panel--selected fr-px-0"
    role="tabpanel"
    aria-labelledby="followups-tab"
    tabindex="0"
  >
    <AtomAlert
      v-if="error"
      class="fr-mx-4w"
      :alert-type="AlertType.Error"
      message="La liste des synthèses d'entretien n'a pas pu être chargée."
    />
    <template v-else>
      <FollowupsTabPanelFilters
        class="fr-px-5v"
        :is-in-followups-context="true"
        :is-in-help-requests-context="false"
        @filter="filters = $event"
      />
      <hr />
      <p class="fr-mb-2w fr-mx-5v fr-hint-text">
        {{ followupsCount }} synthèse(s) d'entretien
      </p>
      <div v-show="pending">
        <AtomLoader class="fr-mx-auto" />
      </div>
      <FollowupsTabPanelTable
        v-show="!pending"
        :followups="followups"
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
  import { REQUEST_LIMIT_DEFAULT } from '~/utils/constants'
  import type { FollowupFilterInput } from '~/server/schema'
  import { useFiltersStore } from '~/store/filters'
  import { FollowupSort, SortOrder } from '~/types/table'
  import { GetFollowupsOutput, ErrorOutput } from '~/server/routers'

  const filtersStore = useFiltersStore()

  const filters = ref<FollowupFilterInput>(filtersStore.followup || {})
  const orderBy = ref<FollowupSort[]>([{ date: SortOrder.Desc }])
  const page = ref(1)
  const perPage = ref(REQUEST_LIMIT_DEFAULT)

  const {
    data: followupsRequest,
    pending,
    error
  } = useAsyncData<GetFollowupsOutput, ErrorOutput>(
    () =>
      useTrpcClient().followup.getFollowups.query({
        page: page.value,
        perPage: perPage.value,
        orderBy: orderBy.value,
        filters: filters.value
      }),
    {
      default: () => ({
        followups: [],
        count: 0,
        totalPages: 0
      }),
      watch: [filters, page, perPage, orderBy]
    }
  )

  const followupsCount = computed(() => followupsRequest.value?.count || 0)

  const followups = computed(() => followupsRequest.value?.followups || [])

  const totalPages = computed(() => followupsRequest.value?.totalPages || 0)

  function updatePagination({
    pageNumber,
    limitValue
  }: {
    pageNumber: number
    limitValue: number
  }) {
    page.value = pageNumber
    perPage.value = limitValue
  }
</script>
