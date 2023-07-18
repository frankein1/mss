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
    <template v-else-if="financialHelpRequests">
      <h2 class="fr-h5">Aides financières</h2>
      <StatsList
        :stats="financialHelpRequestsCounts"
        :stats-percentage="false"
      />
      <p class="fr-text--bold stats-total-amount">
        Montant total des aides délivrées par la structure
        <span class="fr-h3"
          >{{ financialHelpRequestsTotalAmount.toFixed(2) }}€</span
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
  import { Prisma, HelpRequestStatus } from '@prisma/client'
  import { StatFilterInput } from '~/server/schema'
  import { StatList } from '~/types/stat'
  import { AlertType } from '~/utils/constants/alert'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    filters: StatFilterInput
  }>()

  const {
    data: financialHelpRequests,
    pending,
    error
  } = await trpcClient.stat.getFinancialHelpRequestsStats.useQuery(
    props.filters,
    {
      default: () => [],
      transform: v => v // FIXME: Nuxt can't type array picks too. You can use the transform option for now to get proper types - https://github.com/wobsoriano/trpc-nuxt/issues/22#issuecomment-1270863820
    }
  )

  const financialHelpRequestsCount = computed(
    () => financialHelpRequests.value?.length || 0
  )

  const internalFinancialHelpRequests = computed(
    () =>
      financialHelpRequests.value?.filter(
        request => !request.externalStructure
      ) || []
  )

  const internalFinancialHelpRequestsCount = computed(
    () => internalFinancialHelpRequests.value.length
  )

  const externalFinancialHelpRequestsCount = computed(
    () =>
      financialHelpRequestsCount.value -
      internalFinancialHelpRequestsCount.value
  )

  const financialHelpRequestsCounts = computed(() => {
    const requestsCounts = {
      total: {
        key: 'total',
        label: 'Nombre de demandes',
        count: financialHelpRequestsCount.value
      },
      internal: {
        key: 'internal',
        label: 'Instruites en interne',
        count: internalFinancialHelpRequestsCount.value
      },
      external: {
        key: 'external',
        label: 'Instruites en externe',
        count: externalFinancialHelpRequestsCount.value
      }
    }
    const requestsCountsArray = Object.values(requestsCounts)
    requestsCountsArray.sort((a, b) => b.count - a.count)
    return requestsCountsArray
  })

  const financialHelpRequestsTotalAmount = computed(() =>
    internalFinancialHelpRequests.value
      .reduce((total, request) => {
        if (request.status !== HelpRequestStatus.Accepted) {
          return total
        }
        const allocatedAmount = new Prisma.Decimal(
          request.allocatedAmount || 0
        ).toNumber()
        return total + allocatedAmount
      }, 0)
      .toFixed(2)
  )

  const financialHelpRequestsAmountByType = computed(() => {
    const requestsAmountByType: { [k: string]: StatList & { count: number } } =
      {}
    internalFinancialHelpRequests.value.forEach(request => {
      if (
        request.allocatedAmount &&
        request.status === HelpRequestStatus.Accepted
      ) {
        if (request.type.id in requestsAmountByType) {
          requestsAmountByType[request.type.id].count += new Prisma.Decimal(
            request.allocatedAmount || 0
          ).toNumber()
        } else {
          requestsAmountByType[request.type.id] = {
            key: request.type.id,
            label: request.type.name,
            color: '#E4794A',
            count: new Prisma.Decimal(request.allocatedAmount || 0).toNumber()
          }
        }
      }
    })
    const requestsAmountByTypeArray: Array<StatList> =
      Object.values(requestsAmountByType)
    requestsAmountByTypeArray.sort(
      (a, b) => (b.count as number) - (a.count as number)
    )
    return requestsAmountByTypeArray
  })
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
