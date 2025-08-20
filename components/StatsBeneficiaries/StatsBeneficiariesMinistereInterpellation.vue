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
  import type { StatFilterInput } from '~/server/schema'
  import { getStatLabel, ministerKeys } from '~/client/options'
  import type { StatsListPropType } from '~/types/stat'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const ministereInterpellationStats = ref<StatsListPropType | null>(null)
  try {
    const trpc = useTrpcClient()
    const data = await trpc.stat.getMinistereInterpellation.mutate(
      props.filters
    )
    if (data == null) {
      throw new Error('no data')
    }
    ministereInterpellationStats.value =
      data.map(({ _count, ministre }) => ({
        key: ministre,
        label: getStatLabel(ministerKeys.byKey, ministre),
        count: _count
      })) || []
  } catch (err: unknown) {
    console.error(err)
    error.value = err as Error
  } finally {
    pending.value = false
  }
</script>
