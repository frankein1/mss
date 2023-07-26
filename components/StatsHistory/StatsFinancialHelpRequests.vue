<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques des aides financières n'ont pas pu être chargées."
    />
    <template v-else-if="data">
      <h2 class="fr-h5">Aides financières</h2>
      <StatsList
        :stats="financialHelpRequestCounts"
        :stats-percentage="false"
      />
      <p class="fr-text--bold stats-total-amount">
        Montant total des aides délivrées par la structure
        <span class="fr-h3"
          >{{ financialHelpRequestTotalAmount.toFixed(2) }}€</span
        >
      </p>
      <StatsList
        :stats="financialHelpRequestsAmountByType"
        :stats-percentage="false"
        unit="€"
        :to-fixed="2"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    filters: StatFilterInput
  }>()

  const { data, pending, error } =
    await trpcClient.stat.getFinancialHelpRequestsStats.useQuery(props.filters)

  const financialHelpRequestCount = computed(
    () => data.value?.financialHelpRequestCount || 0
  )

  const internalFinancialHelpRequestCount = computed(
    () => data.value?.internalFinancialHelpRequestCount || 0
  )

  const externalFinancialHelpRequestCount = computed(
    () =>
      financialHelpRequestCount.value - internalFinancialHelpRequestCount.value
  )

  const financialHelpRequestCounts = computed(() => {
    const requestsCounts = {
      total: {
        key: 'total',
        label: 'Nombre de demandes',
        count: financialHelpRequestCount.value
      },
      internal: {
        key: 'internal',
        label: 'Instruites en interne',
        count: internalFinancialHelpRequestCount.value
      },
      external: {
        key: 'external',
        label: 'Instruites en externe',
        count: externalFinancialHelpRequestCount.value
      }
    }
    const requestsCountsArray = Object.values(requestsCounts)
    requestsCountsArray.sort((a, b) => b.count - a.count)
    return requestsCountsArray
  })

  const financialHelpRequestTotalAmount = computed(
    () => data.value?.financialHelpRequestTotalAmount || 0
  )

  const financialHelpRequestsAmountByType = computed(
    () =>
      data.value?.financialHelpRequestAmountByType.map(
        ({ type, allocatedAmount }) => ({
          key: type.id,
          label: type.name,
          color: '#E4794A',
          count: allocatedAmount
        })
      ) || []
  )
</script>

<style scoped>
  .stats-total-amount {
    display: flex;
    flex-direction: column;
  }

  .stats-total-amount span {
    color: var(--orange-terre-battue-main-645);
    margin-bottom: 0;
  }
</style>
