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
        :stats="data.financialHelpRequestCounts"
        :stats-percentage="false"
        :with-sum="false"
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
