<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des villes n'ont pas pu être chargées."
  />

  <template v-else-if="citiesStats && citiesStats.length">
    <StatsList
      :total-count="beneficiaryCount"
      :stats="citiesStats"
      stats-bar
      :not-filled-route="
        routes.beneficiary.AppBeneficiaries.path({
          notFilled: FilterBeneficiaryNotFilled.City
        })
      "
    />
  </template>
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
      >créer des fiches de bénéficiaires</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des villes.
  </p>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { STATS_NULL_LABEL } from '~/utils/constants/stats'
  import { routes } from '~/utils/routes'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()
  const { data, error, status } = await trpcClient.stat.getCityStats.useQuery(
    toRef(() => props.filters)
  )
  const citiesStats = computed(
    () =>
      data.value?.map(({ _count, city }) => ({
        key: city || 'null',
        label: city || STATS_NULL_LABEL,
        count: _count
      })) || []
  )
</script>
