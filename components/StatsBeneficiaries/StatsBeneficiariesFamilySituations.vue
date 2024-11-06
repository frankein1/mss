<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des situations familiales n'ont pas pu être chargées."
  />

  <StatsList
    v-if="familySituationsStats.length"
    :total-count="beneficiaryCount"
    :stats="familySituationsStats"
    stats-bar
    :not-filled-route="
      routes.beneficiary.AppBeneficiaries.path({
        notFilled: FilterBeneficiaryNotFilled.BeneficiaryFamilySituation
      })
    "
  />
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
      >créer des fiches de bénéficiaires</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des situations
    familiales.
  </p>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { getStatLabel, familySituationKeys } from '~/client/options'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: familySituationsCounts,
    pending,
    error
  } = await trpcClient.stat.getFamilyStats.useQuery(props.filters)

  const familySituationsStats = computed(
    () =>
      familySituationsCounts.value?.map(({ _count, familySituation }) => ({
        key: familySituation || 'null',
        label: getStatLabel(familySituationKeys.byKey, familySituation),
        count: _count
      })) || []
  )
</script>
