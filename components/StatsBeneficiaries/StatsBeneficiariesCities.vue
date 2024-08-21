<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des villes n'ont pas pu être chargées."
    />
    <template v-else-if="citiesStats">
      <h4 class="fr-h5">Villes</h4>
      <StatsList
        v-if="citiesStats.length"
        :total-count="beneficiaryCount"
        :stats="citiesStats"
        stats-bar
      />
      <p v-else>
        Commencez à
        <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
          >créer des fiches de bénéficiaires</NuxtLink
        >
        pour voir apparaître les statistiques de la répartition des villes.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { STATS_NULL_LABEL } from '~/client/options'
  import { routes } from '~/utils/routes'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: citiesCounts,
    pending,
    error
  } = await trpcClient.stat.getCityStats.useQuery(props.filters)

  const citiesStats = computed(
    () =>
      citiesCounts.value?.map(({ _count, city }) => ({
        key: city || 'null',
        label: city || STATS_NULL_LABEL,
        count: _count
      })) || []
  )
</script>
