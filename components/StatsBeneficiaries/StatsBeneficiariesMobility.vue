<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des données mobilité n'ont pas pu être chargées."
  />

  <template v-else-if="mobilityStats && mobilityStats.length">
    <StatsList
      :total-count="beneficiaryCount"
      :stats="mobilityStats"
      stats-bar
      :not-filled-route="
        routes.beneficiary.AppBeneficiaries.path({
          notFilled: FilterBeneficiaryNotFilled.BeneficiaryMobility
        })
      "
    />
  </template>
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

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()

  const { data, error, status } =
    await trpcClient.stat.getMobilityStats.useQuery(toRef(() => props.filters))

  const mobilityStats = computed(
    () =>
      data.value?.map(({ _count, mobility }) => ({
        key: mobility || 'null',
        label: getStatLabel(beneficiaryMobilityKeys.byKey, mobility),
        count: _count
      })) || []
  )
</script>
