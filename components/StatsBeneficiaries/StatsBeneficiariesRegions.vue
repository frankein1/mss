<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des régions n'ont pas pu être chargées."
  />

  <StatsList
    v-if="regionsStats.length"
    :total-count="beneficiaryCount"
    :stats="regionsStats"
    stats-bar
  />
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
      >créer des fiches de bénéficiaires</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des régions.
  </p>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { STATS_NULL_LABEL } from '~/utils/constants/stats'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: regionsCounts,
    pending,
    error
  } = await trpcClient.stat.getRegionStats.useQuery(props.filters)

  const regionsStats = computed(
    () =>
      regionsCounts.value?.map(({ _count, region }) => ({
        key: region || 'null',
        label: region || STATS_NULL_LABEL,
        count: _count
      })) || []
  )
</script>
