<template>
  <PageContainer>
    <DsfrBreadcrumb :links="Breadcrumb.AppBeneficiaries()" />
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
            <div class="fr-mb-2w fr-mx-5v results-container">
              <p class="fr-hint-text results-count">
                {{ beneficiariesCount }} bénéficiaire(s)
              </p>
              <ExportDataButton
                v-if="canExportBeneficiaries(authStore.getAuthUser)"
                :is-downloading="isDownloading"
                @export="exportBeneficiaries"
              />
            </div>
            <div v-show="pending">
              <AtomLoader class="fr-mx-auto" />
            </div>
            <BeneficiaryTable
              v-show="!pending"
              v-model:sort="orderBy"
              :beneficiaries="beneficiaries"
              :pending="pending"
            />
            <AtomPagination
              v-show="!pending"
              class="fr-mt-4w fr-px-5v"
              :page="page"
              :total-pages="totalPages"
              @change-page="updatePagination($event)"
            />

            <UsersActivity
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
  import {
    REQUEST_LIMIT_DEFAULT,
    FAILED_DOWNLOAD_ERROR_MESSAGE
  } from '~/utils/constants'
  import type { BeneficiaryFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { canExportBeneficiaries } from '~/server/security/rules/export'
  import { useAuthStore } from '~/store/auth'
  import { BeneficiarySort, SortOrder } from '~/types/table'
  import { getExportUrl } from '~/utils/export/getExportUrl'
  import { getExportFilename } from '~/utils/export/getExportFilename'
  import { Route, Breadcrumb, RouteTitle, RoutePath } from '~/utils/routing'

  definePageMeta({
    name: Route.AppBeneficiaries
  })

  const filtersStore = useFiltersStore()
  const trpcClient = useTrpcClient()
  const authStore = useAuthStore()

  const filters = ref<BeneficiaryFilterInput>(filtersStore.beneficiary || {})
  const orderBy = ref<BeneficiarySort[]>([{ usualName: SortOrder.Asc }])
  const page = ref(1)
  const perPage = ref(REQUEST_LIMIT_DEFAULT)
  const isDownloading = ref(false)

  const { updatePagination } = usePagination(page, perPage)

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

  async function exportBeneficiaries() {
    isDownloading.value = true
    try {
      const exportedBeneficiaries =
        await trpcClient.beneficiary.exportBeneficiaries.query({
          orderBy: orderBy.value,
          filters: filters.value
        })
      if (!exportedBeneficiaries.data) {
        throw new Error('no data')
      }
      const downloadLink = document.createElement('a')
      downloadLink.href = getExportUrl(exportedBeneficiaries.data)
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

<style lang="scss" scoped>
  .table-container {
    // 21.5rem seems to come up out of the box. It corresponds to the total height of elements existing above the table
    max-height: calc(100vh - 21.5rem);
  }
</style>
