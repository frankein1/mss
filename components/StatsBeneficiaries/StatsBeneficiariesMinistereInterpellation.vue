<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des interpellations des ministres n'ont pas pu être chargées."
    />
    <template v-else-if="ministereInterpellationStats">
      <h2 class="fr-h5">Bénéficiaires ayant interpellé chaque ministre</h2>
      <StatsList
        v-if="ministereInterpellationStats.length"
        :total-count="beneficiaryCount"
        :stats="ministereInterpellationStats"
        stats-bar
        :stats-percentage="false"
      />
      <p v-else>
        Commencez à
        <NuxtLink :to="RoutePath.AppBeneficiariesAdd()"
          >créer des fiches de bénéficiaires</NuxtLink
        >
        pour voir apparaître les statistiques de la répartition des
        interpellations des ministres.
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { RoutePath } from '~/utils/routing'
  import { StatFilterInput } from '~/server/schema'
  import { getStatLabel, ministerKeys } from '~/client/options'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: ministereInterpellationCounts,
    pending,
    error
  } = await useTrpcClient().stat.getMinistereInterpellation.useQuery(
    props.filters
  )

  const ministereInterpellationStats = computed(
    () =>
      ministereInterpellationCounts.value?.map(({ _count, ministre }) => ({
        key: ministre,
        label: getStatLabel(ministerKeys.byKey, ministre),
        count: _count
      })) || []
  )
</script>
