<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des données mobilité n'ont pas pu être chargées."
    />
    <template v-else-if="mobilityStats">
      <h2 class="fr-h5">Données mobilité</h2>
      <StatsList
        v-if="mobilityStats.length"
        :total-count="beneficiaryCount"
        :stats="mobilityStats"
        stats-bar
      />
      <p v-else>
        Commencez à
        <NuxtLink
          :to="Routes.BeneficiariesAdd"
          target="_self"
          >créer des fiches de bénéficiaires</NuxtLink
        >
        pour voir apparaître les statistiques de la répartition des données
        mobilité.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { beneficiaryMobilityLabels } from '~/client/options/beneficiary'
  import { StatFilterInput } from '~/server/schema/filter.schema'
  import { STATS_NULL_LABEL } from '~/utils/constants'
  import { AlertType } from '~~/utils/constants/alert'
  import { Routes } from '~/utils/routing/routes'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: mobilityCounts,
    pending,
    error
  } = useAsyncData(
    () => trpcClient.stat.getMobilityStats.query(props.filters),
    {
      default: () => [],
      watch: [props.filters]
    }
  )

  const mobilityStats = computed(
    () =>
      mobilityCounts.value?.map(({ _count, mobility }) => ({
        key: mobility,
        label: beneficiaryMobilityLabels[mobility] || STATS_NULL_LABEL,
        count: parseInt(_count)
      })) || []
  )
</script>
