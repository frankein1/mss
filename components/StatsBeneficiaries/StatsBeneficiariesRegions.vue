<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des régions n'ont pas pu être chargées."
  />

  <StatsList
    v-if="regionsStats"
    :total-count="beneficiaryCount"
    :stats="regionsStats"
    stats-bar
    :not-filled-route="
      routes.beneficiary.AppBeneficiaries.path({
        notFilled: FilterBeneficiaryNotFilled.Region
      })
    "
  />
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
      >créer des fiches de bénéficiaires</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des régions.
  </p>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { STATS_NULL_LABEL } from '~/utils/constants/stats'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'
  import type { StatsListPropType } from '~/types/stat'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const regionsStats = ref<StatsListPropType | null>(null)

  try {
    const trpc = useTrpcClient()
    const data = await trpc.stat.getRegionStats.mutate(props.filters)
    if (data == null) {
      throw new Error('no data')
    }
    regionsStats.value =
      data.map(({ _count, region }) => ({
        key: region || 'null',
        label: region || STATS_NULL_LABEL,
        count: _count
      })) || []
  } catch (err: unknown) {
    console.error(err)
    error.value = err as Error
  } finally {
    pending.value = false
  }
</script>
