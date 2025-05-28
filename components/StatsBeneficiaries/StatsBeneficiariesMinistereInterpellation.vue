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
    v-if="ministereInterpellationStats"
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
  import { StatsListPropType } from '~/types/stat'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const error = ref<boolean>(false)
  const pending = ref<boolean>(false)
  const ministereInterpellationStats = ref<StatsListPropType | null>(null)

  onMounted(async () => {
    pending.value = true
    // Do not use useMutation() or useTrpcMutation()
    // it cause issues with response #id matching
    const trpc = useTrpcClient()
    const data = await trpc.stat.getMinistereInterpellationStatsPost.mutate(
      props.filters
    )
    if (data == null) {
      error.value = true
      return
    }
    ministereInterpellationStats.value =
      data.map(({ _count, ministre }) => ({
        key: ministre,
        label: getStatLabel(ministerKeys.byKey, ministre),
        count: _count
      })) || []
    pending.value = false
  })
</script>
