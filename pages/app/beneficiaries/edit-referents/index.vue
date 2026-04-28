<template>
  <PageContainer no-max-width>
    <AtomBreadcrumb
      :links="breadcrumbs.beneficiary.AppBeneficiariesEditReferents()"
    />
    <div class="beneficiaries-header">
      <PageTitle
        class="title"
        no-margin
        :title="title"
      />
    </div>
    <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
      <div class="fr-col-12">
        <section class="feature-section">
          <DsfrStepper
            :steps
            :current-step
          />
        </section>
      </div>
      <div
        v-if="currentStep === 1"
        class="fr-col-12"
      >
        <h2 class="fr-sr-only">Filtres</h2>
        <section class="feature-section beneficiary-filters">
          <BeneficiaryFilters @filter="filters = $event" />
        </section>
        <section class="feature-section fr-mt-2w">
          <h2 class="fr-sr-only">Liste des bénéficiaires</h2>
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
              <button
                class="fr-btn fr-btn-primary fr-btn--sm"
                :disabled="selectedBeneficiaries.length < 1"
                @click="currentStep = 2"
              >
                Etape suivante
              </button>
            </div>
            <AtomAlert
              v-if="selectedBeneficiaries.length >= SELECTION_LIMIT"
              class="fr-mx-5v"
              :alert-type="AlertType.Warning"
              :message="`Limite de sélection atteinte : ${SELECTION_LIMIT} bénéficiaires.`"
            />
            <div v-if="pending">
              <AtomLoader class="fr-mx-auto" />
            </div>
            <template v-else>
              <BeneficiaryTable
                v-model:sort="orderBy"
                v-model:selected-beneficiaries="selectedBeneficiaries"
                :beneficiary-list="items"
                :pending="pending"
                :selection-limit="SELECTION_LIMIT"
                selectable
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
        </section>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { BENEFICIARIES_REQUEST_LIMIT_DEFAULT } from '~/utils/constants'
  import type { BeneficiaryFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import type { BeneficiarySort } from '~/types/table'
  import { SortOrder } from '~/types/table'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import type { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'

  const title = routes.beneficiary.AppBeneficiariesEditReferents.title

  useHead({ title })

  definePageMeta({
    name: routes.beneficiary.AppBeneficiariesEditReferents.name
  })

  const route = useRoute()
  const filtersState = useFilters()
  const trpcClient = useTrpcClient()

  const notFilled = route.query['not-filled'] as FilterBeneficiaryNotFilled
  if (notFilled) {
    if (filtersState.beneficiary.value) {
      filtersState.beneficiary.value.notFilled = notFilled
    } else {
      filtersState.beneficiary.value = { notFilled }
    }
  }

  const filters = ref<BeneficiaryFilterInput>(
    filtersState.beneficiary.value || {}
  )
  const orderBy = ref<BeneficiarySort>({ usualName: SortOrder.Asc })
  const page = ref(1)
  const perPage = ref(BENEFICIARIES_REQUEST_LIMIT_DEFAULT)
  const SELECTION_LIMIT = 20
  const currentStep = ref(1)
  const selectedBeneficiaries = ref<{ id: string; familyId: string }[]>([])

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
  } = await trpcClient.beneficiary.getBeneficiaryList.useQuery(queryInput)

  const beneficiariesCount = computed(() => pageData.value?.count || 0)

  const items = computed(() => pageData.value?.items || [])

  const totalPages = computed(() => pageData.value?.totalPages || 0)

  // Steps
  const steps = [
    `Sélectionner les bénéficiaires à mettre à jour`,
    'Modifier les agents référents des bénéficiaires',
    'Confirmation'
  ]
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .beneficiaries-header {
    display: grid;
    gap: 0.5rem;
    grid-template-areas: 'title' 'action';
    grid-template-columns: auto max-content;
    align-items: center;
  }

  @include dsfr-media-query.respond-from('lg') {
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

  /* stylelint-disable selector-class-pattern */
  .beneficiary-filters {
    :deep(.fromAge),
    :deep(.toAge) {
      .fr-input-wrap::before {
        bottom: 0.75rem;
        margin: auto;
        pointer-events: none;
        position: absolute;
        right: 1.75rem;
        top: 0.75rem;
        content: 'an(s)';
        line-height: 1rem;
      }

      .fr-input {
        padding-right: 4rem;
      }
    }
  }
  /* stylelint-enable selector-class-pattern */
</style>
