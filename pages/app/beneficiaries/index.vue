<template>
  <PageContainer>
    <DsfrBreadcrumb :links="Breadcrumb.AppBeneficiaries()" />
    <div class="beneficiaries-header">
      <PageTitle
        class="title"
        no-margin
        :title="title"
      />
      <NuxtLink
        :to="RoutePath.AppBeneficiariesAdd()"
        class="fr-btn fr-btn--lg fr-btn--icon-left fr-icon-user-add-line action"
      >
        Créer un·e bénéficiaire
      </NuxtLink>
    </div>
    <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
      <div class="fr-col-12">
        <div class="feature-section">
          <BeneficiaryFilters @filter="filters = $event" />
        </div>
        <main class="feature-section fr-py-3w fr-mt-2w">
          <AtomAlert
            v-if="error"
            class="fr-mx-5v"
            :alert-type="AlertType.Error"
            message="La liste des bénéficiaires n'a pas pu être chargée."
          />
          <template v-else>
            <div class="fr-mb-2w results-container">
              <p class="results-count">
                {{ beneficiariesCount }} bénéficiaire(s)
              </p>
              <ExportDataButton
                v-if="application.export.beneficiaries"
                :is-downloading="isDownloading"
                @export="exportBeneficiaries"
              />
            </div>
            <div v-if="pending">
              <AtomLoader class="fr-mx-auto" />
            </div>
            <template v-else>
              <BeneficiaryTable
                v-model:sort="orderBy"
                :items="items"
                :pending="pending"
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
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import {
    FAILED_DOWNLOAD_ERROR_MESSAGE,
    BENEFICIARIES_REQUEST_LIMIT_DEFAULT
  } from '~/utils/constants'
  import type { BeneficiaryFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { BeneficiarySort, SortOrder } from '~/types/table'
  import { getExportUrl } from '~/utils/export/getExportUrl'
  import { getExportFilename } from '~/utils/export/getExportFilename'
  import { Route, Breadcrumb, RouteTitle, RoutePath } from '~/utils/routing'

  const title = RouteTitle.AppBeneficiaries()

  useHead({ title })

  definePageMeta({
    name: Route.AppBeneficiaries
  })

  const { application } = usePermissions()
  const filtersState = useFilters()
  const trpcClient = useTrpcClient()

  const filters = ref<BeneficiaryFilterInput>(
    filtersState.beneficiary.value || {}
  )
  const orderBy = ref<BeneficiarySort[]>([{ usualName: SortOrder.Asc }])
  const page = ref(1)
  const perPage = ref(BENEFICIARIES_REQUEST_LIMIT_DEFAULT)
  const isDownloading = ref(false)

  const { updatePagination } = usePagination(page, perPage, filters)

  const queryInput = computed(() => ({
    page: page.value,
    perPage: perPage.value,
    orderBy: orderBy.value,
    filters: filters.value
  }))

  const {
    data: pageData,
    pending,
    error
  } = await trpcClient.beneficiary.getPage.useQuery(queryInput)

  const beneficiariesCount = computed(() => pageData.value?.count || 0)

  const items = computed(() => pageData.value?.items || [])

  const totalPages = computed(() => pageData.value?.totalPages || 0)

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
      downloadLink.download = getExportFilename('beneficiaires')
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
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .beneficiaries-header {
    display: grid;
    gap: 0.5rem 0.5rem;
    grid-template-areas: 'title' 'action';
    grid-template-columns: auto max-content;
    align-items: center;
  }

  @include dsfr-media-query.respond-from('md') {
    .beneficiaries-header {
      grid-template-areas: 'title action';
    }
  }

  .title {
    grid-area: title;
  }

  .action {
    grid-area: action;
  }
</style>
