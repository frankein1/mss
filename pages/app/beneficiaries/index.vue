<template>
  <PageContainer>
    <PageBreadcrumb :links="Breadcrumb.AppBeneficiaries()" />
    <PageTitle :title="RouteTitle.AppBeneficiaries()" />
    <BeneficiarySearchbar />
    <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
      <div class="fr-col-12">
        <main class="main-container fr-py-3w">
          <AtomAlert
            v-if="error"
            class="fr-mx-5v"
            :alert-type="AlertType.Error"
            message="La liste des bénéficiaires n'a pas pu être chargée."
          />
          <template v-else>
            <BeneficiaryFilters
              class="fr-px-5v"
              @filter="filters = $event"
            />
            <hr />
            <p class="fr-mb-2w fr-mx-5v fr-hint-text">
              {{ beneficiariesCount }} bénéficiaire(s)
            </p>
            <div v-show="pending">
              <AtomLoader class="fr-mx-auto" />
            </div>
            <BeneficiaryTable
              v-show="!pending"
              :beneficiaries="beneficiaries"
              :pending="pending"
              @sort="onSort"
            />
            <AtomPagination
              v-show="!pending"
              class="fr-mt-4w fr-px-5v"
              :page="page"
              :total-pages="totalPages"
              @change-page="updatePagination($event)"
            />

            <MutationLogs
              class="fr-mt-4w fr-px-5v"
              collection="beneficiaries"
              :route-with-params="RoutePath.AppBeneficiary"
            />
          </template>
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { useFiltersStore } from '~/store/filters'
  import { REQUEST_LIMIT_DEFAULT } from '~/utils/constants'
  // import { RoutePath } from '~/utils/routing'
  import type { BeneficiaryFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import type { BeneficiarySort } from '~/types/table'
  import { Route, Breadcrumb, RouteTitle, RoutePath } from '~/utils/routing'

  definePageMeta({
    name: Route.AppBeneficiaries
  })

  const filtersStore = useFiltersStore()
  const trpcClient = useTrpcClient()

  const filters = ref<BeneficiaryFilterInput>(filtersStore.beneficiary || {})
  const orderBy = ref<BeneficiarySort[]>([])
  const page = ref(1)
  const perPage = ref(REQUEST_LIMIT_DEFAULT)

  const { updatePagination } = usePagination(page, perPage)
  const { onSort } = useSort<BeneficiarySort>(orderBy)

  const queryInput = computed(() => ({
    page: page.value,
    perPage: perPage.value,
    orderBy: orderBy.value,
    filters: filters.value
  }))

  const {
    data: beneficiariesRequest,
    pending,
    error
  } = await trpcClient.beneficiary.getBeneficiaries.useQuery(queryInput, {
    default: () => ({
      beneficiaries: [],
      count: 0,
      totalPages: 0
    }),
    transform: v => v // FIXME: Nuxt can't type array picks too. You can use the transform option for now to get proper types - https://github.com/wobsoriano/trpc-nuxt/issues/22#issuecomment-1270863820
  })

  const beneficiariesCount = computed(
    () => beneficiariesRequest.value?.count || 0
  )

  const beneficiaries = computed(
    () => beneficiariesRequest.value?.beneficiaries || []
  )

  const totalPages = computed(() => beneficiariesRequest.value?.totalPages || 0)
</script>

<style lang="scss" scoped>
  .table-container {
    // 21.5rem seems to come up out of the box. It corresponds to the total height of elements existing above the table
    max-height: calc(100vh - 21.5rem);
  }
</style>
