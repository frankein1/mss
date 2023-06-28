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
          :to="RoutePath.BeneficiariesAdd()"
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
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~~/utils/constants/alert'
  import { RoutePath } from '~/utils/routing'
  import { getStatLabel } from '~/client/options/stat'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: mobilityCounts,
    pending,
    error
  } = await trpcClient.stat.getMobilityStats.useQuery(props.filters, {
    default: () => [],
    transform: v => v // FIXME: Nuxt can't type array picks too. You can use the transform option for now to get proper types - https://github.com/wobsoriano/trpc-nuxt/issues/22#issuecomment-1270863820
  })

  const mobilityStats = computed(
    () =>
      mobilityCounts.value?.map(({ _count, mobility }) => ({
        key: mobility || 'null',
        label: getStatLabel(beneficiaryMobilityLabels, mobility),
        count: _count
      })) || []
  )
</script>
