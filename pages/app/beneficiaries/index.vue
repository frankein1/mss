<template>
  <div class="fr-container fr-p-5w">
    <TheHeader title="Bénéficiaires" />
    <BeneficiarySearchbar class="fr-mt-3w" />
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
            <AtomLoader
              v-show="pending"
              class="fr-mx-auto"
            />
            <div
              v-show="!pending"
              ref="tableContainer"
              class="table-container"
              tabindex="0"
            >
              <div
                class="fr-table fr-table--bordered fr-table--no-caption fr-mb-0 fr-pt-0"
              >
                <table>
                  <caption>
                    Liste des bénéficiaires
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">
                        Nom
                        <AtomSortButton @sort="onSort($event, 'usualName')" />
                      </th>
                      <th scope="col">
                        Prénom
                        <AtomSortButton @sort="onSort($event, 'firstName')" />
                      </th>
                      <th scope="col">Âge</th>
                      <th scope="col">Date de naissance</th>
                      <th scope="col">Adresse postale</th>
                      <th scope="col">Ville</th>
                      <th scope="col">Téléphone</th>
                      <th scope="col">Types d'accompagnement</th>
                      <th scope="col">Référents</th>
                      <th scope="col">Statut du dossier</th>
                      <th scope="col">N° dossier</th>
                    </tr>
                  </thead>
                  <tbody>
                    <BeneficiaryRow
                      v-for="beneficiary in beneficiaries"
                      :key="beneficiary.id"
                      :beneficiary="beneficiary"
                    />
                  </tbody>
                </table>
              </div>
            </div>
            <AtomPagination
              v-show="!pending"
              class="fr-mt-4w fr-px-5v"
              :page="page"
              :total-pages="beneficiariesRequest?.totalPages || 0"
              @change-page="updatePagination($event)"
            />

            <!-- TODO: add this component -->
            <!-- <HistoryItem
              class="fr-mt-4w fr-px-5v"
              collection="beneficiary"
              :route-with-params="Routes.Beneficiary"
            /> -->
          </template>
        </main>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useFiltersStore } from '~/store/filters'
  import { REQUEST_LIMIT_DEFAULT } from '~/utils/constants'
  // import { Routes } from '~/utils/routing/routes'
  import type { BeneficiaryFilterRawInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import type { ErrorOutput, GetBeneficiariesOutput } from '~/server/routers'
  import type { SortOrder } from '~/types/table'

  const filtersStore = useFiltersStore()
  const trpcClient = useTrpcClient()

  const filters = ref<BeneficiaryFilterRawInput>(filtersStore.beneficiary || {})
  const orderBy = ref<Array<{ [k: string]: SortOrder }>>([])
  const page = ref(1)
  const perPage = ref(REQUEST_LIMIT_DEFAULT)
  const tableContainer = ref<HTMLDivElement | null>(null)

  const {
    data: beneficiariesRequest,
    pending,
    error
  } = useAsyncData<GetBeneficiariesOutput, ErrorOutput>(
    () =>
      trpcClient.beneficiary.getBeneficiaries.query({
        page: page.value,
        perPage: perPage.value,
        orderBy: orderBy.value,
        filters: filters.value
      }),
    {
      default: () => ({
        beneficiaries: [],
        count: 0,
        totalPages: 0
      }),
      watch: [filters, page, perPage, orderBy]
    }
  )

  const beneficiariesCount = computed(
    () => beneficiariesRequest.value?.count || 0
  )

  const beneficiaries = computed(
    () => beneficiariesRequest.value?.beneficiaries || []
  )

  watch(pending, _pending => {
    const tableContainerValue = tableContainer.value
    // Scroll the table container to top after reloading
    if (tableContainerValue && !_pending) {
      nextTick(() => (tableContainerValue.scrollTop = 0))
    }
  })

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

  function onSort(sortDir: SortOrder | null, field: string) {
    orderBy.value = orderBy.value.filter(s => Object.keys(s)[0] !== field)
    if (!sortDir) {
      return
    }
    orderBy.value.push({ [field]: sortDir })
  }
</script>

<style lang="scss" scoped>
  .table-container {
    // 21.5rem seems to come up out of the box. It corresponds to the total height of elements existing above the table
    max-height: calc(100vh - 21.5rem);
  }
</style>
