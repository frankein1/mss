<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des interpellations des ministres n'ont pas pu être chargées."
  />
  <StatsList
    v-if="ministereInterpellationStats.length"
    :total-count="beneficiaryCount"
    :stats="ministereInterpellationStats"
    stats-bar
    :stats-percentage="false"
  />
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
      >créer des fiches de bénéficiaires</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des interpellations
    des ministres.
  </p>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { StatFilterInput } from '~/server/schema'
  import { getStatLabel, ministerKeys } from '~/client/options'
  import { useLoadStatisticsWithPost } from '~/composables/useLoadStatisticsWithPost'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: ministereInterpellationCounts,
    pending,
    error
  } = await useLoadStatisticsWithPost(
    'getMinistereInterpellation',
    toRef(props.filters)
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
