<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des départements ou services de l'administration centrale n'ont pas pu être chargées."
    />
    <template v-else-if="ministereDepartementServiceAcStats">
      <h2 class="fr-h5">
        Départements ou services de l'administration centrale
      </h2>
      <StatsList
        v-if="ministereDepartementServiceAcStats.length"
        :total-count="beneficiaryCount"
        :stats="ministereDepartementServiceAcStats"
        stats-bar
      />
      <p v-else>
        Commencez à
        <NuxtLink :to="RoutePath.AppBeneficiariesAdd()"
          >créer des fiches de bénéficiaires</NuxtLink
        >
        pour voir apparaître les statistiques de la répartition des départements
        ou services de l'administration centrale.
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath } from '~/utils/routing'
  import { StatFilterInput } from '~/server/schema'
  import { getStatLabel } from '~/client/options/stat'
  import { ministereDepartmentServiceAcLabels } from '~/client/options/ministry'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: ministereDepartementServiceAcCounts,
    pending,
    error
  } = await useTrpcClient().stat.getMinistereDepartementServiceAc.useQuery(
    props.filters
  )

  const ministereDepartementServiceAcStats = computed(
    () =>
      ministereDepartementServiceAcCounts.value?.map(
        ({ _count, ministereDepartementServiceAc }) => ({
          key: ministereDepartementServiceAc || 'null',
          label: getStatLabel(
            ministereDepartmentServiceAcLabels,
            ministereDepartementServiceAc
          ),
          count: _count
        })
      ) || []
  )
</script>
