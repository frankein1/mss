<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des régions n'ont pas pu être chargées."
  />

  <template v-else-if="regionsStats && regionsStats.length">
    <StatsList
      :total-count="beneficiaryCount"
      :stats="regionsStats"
      stats-bar
      :not-filled-route="
        routes.beneficiary.AppBeneficiaries.path({
          notFilled: FilterBeneficiaryNotFilled.Region
        })
      "
    />
  </template>
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
      >créer des fiches de bénéficiaires</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des régions.
  </p>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { STATS_NULL_LABEL } from '~/utils/constants/stats'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()

  const { data, error, status } = await trpcClient.stat.getRegionStats.useQuery(
    toRef(() => props.filters)
  )

  const regionsStats = computed(
    () =>
      data.value?.map(({ _count, region }) => ({
        key: region || 'null',
        label: region || STATS_NULL_LABEL,
        count: _count
      })) || []
  )
</script>
