<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des données mobilité n'ont pas pu être chargées."
  />
  <StatsList
    v-if="mobilityStats"
    :total-count="beneficiaryCount"
    :stats="mobilityStats"
    stats-bar
    :not-filled-route="
      routes.beneficiary.AppBeneficiaries.path({
        notFilled: FilterBeneficiaryNotFilled.BeneficiaryMobility
      })
    "
  />
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
      >créer des fiches de bénéficiaires</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des données
    mobilité.
  </p>
</template>

<script lang="ts" setup>
  import { beneficiaryMobilityKeys, getStatLabel } from '~/client/options'
  import type { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'
  import type { StatsListPropType } from '~/types/stat'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const mobilityStats = ref<StatsListPropType | null>(null)
  try {
    const trpc = useTrpcClient()
    const data = await trpc.stat.getMobilityStats.mutate(props.filters)
    if (data == null) {
      throw new Error('no data')
    }
    mobilityStats.value =
      data.map(({ _count, mobility }) => ({
        key: mobility || 'null',
        label: getStatLabel(beneficiaryMobilityKeys.byKey, mobility),
        count: _count
      })) || []
  } catch (err: unknown) {
    console.error(err)
    error.value = err as Error
  } finally {
    pending.value = false
  }
</script>
