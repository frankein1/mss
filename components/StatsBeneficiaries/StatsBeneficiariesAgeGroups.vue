<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des tranches d'âge n'ont pas pu être chargées."
  />
  <StatsPie
    v-if="ageStats.length"
    pie-label="Répartition des tranches d'âge"
    :stats="ageStats"
    :total-count="beneficiaryCount"
    :not-filled-route="
      routes.beneficiary.AppBeneficiaries.path({
        notFilled: FilterBeneficiaryNotFilled.AgeGroup
      })
    "
  />
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
      >créer des fiches de bénéficiaires</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des tranches d'âge.
  </p>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { AgeGroup, ageGroupKeys, getStatLabel } from '~/client/options'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { getStatColor } from '~/client/colors/stats'
  import { StatsPiePropType } from '~/types/stat'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'

  const AgeGroupColors = {
    [AgeGroup.Less25]: '#BABAFF',
    [AgeGroup.Group25_34]: '#A8A8FF',
    [AgeGroup.Group35_44]: '#8585f6',
    [AgeGroup.Group45_54]: '#6a6af4',
    [AgeGroup.Group55_64]: '#313178',
    [AgeGroup.More65]: '#272747'
  }

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const {
    data: ageCounts,
    pending,
    error
  } = await trpcClient.stat.getAgeStats.useQuery(props.filters)

  const ageStats = computed(
    () =>
      (ageCounts.value?.map(({ _count, ageGroup }) => ({
        key: ageGroup,
        label: getStatLabel(ageGroupKeys.byKey, ageGroup),
        color: getStatColor(AgeGroupColors, ageGroup),
        count: _count
      })) || []) as StatsPiePropType
  )
</script>
