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
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'
  import { StatsListPropType } from '~/types/stat'

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const error = ref<boolean>(false)
  const pending = ref<boolean>(false)
  const mobilityStats = ref<StatsListPropType | null>(null)

  onMounted(async () => {
    pending.value = true
    // Do not use useMutation() or useTrpcMutation()
    // it cause issues with response #id matching
    const trpc = useTrpcClient()
    const data = await trpc.stat.getMobilityStatsPost.mutate(props.filters)
    if (data == null) {
      error.value = true
      return
    }
    mobilityStats.value =
      data.map(({ _count, mobility }) => ({
        key: mobility || 'null',
        label: getStatLabel(beneficiaryMobilityKeys.byKey, mobility),
        count: _count
      })) || []
    pending.value = false
  })
</script>
