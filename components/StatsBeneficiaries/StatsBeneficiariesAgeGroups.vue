<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des tranches d'âge n'ont pas pu être chargées."
  />
  <template v-else-if="ageStats && ageStats.length">
    <StatsPie
      pie-label="Répartition des tranches d'âge"
      :stats="ageStats"
      :total-count="beneficiaryCount"
      :not-filled-route="
        routes.beneficiary.AppBeneficiaries.path({
          notFilled: FilterBeneficiaryNotFilled.AgeGroup
        })
      "
    />
  </template>
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.beneficiary.AppBeneficiariesAdd.path()"
      >créer des fiches de bénéficiaires</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des tranches d'âge.
  </p>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~/server/schema'
  import { AgeGroup, ageGroupKeys, getStatLabel } from '~/client/options'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { getStatColor } from '~/client/colors/stats'
  import type { StatsPiePropType } from '~/types/stat'
  import { FilterBeneficiaryNotFilled } from '~/utils/constants/filters'
  import { ChartColor } from '~/utils/color/chartColors'

  const AgeGroupColors = {
    [AgeGroup.Less18]: ChartColor.LightPink,
    [AgeGroup.Group18_24]: ChartColor.Peach,
    [AgeGroup.Group25_34]: ChartColor.LightBlue,
    [AgeGroup.Group35_44]: ChartColor.Yellow,
    [AgeGroup.Group45_54]: ChartColor.Pink,
    [AgeGroup.Group55_64]: ChartColor.DeepBlue,
    [AgeGroup.More65]: ChartColor.Green
  }

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()
  const { data, error, status } = await trpcClient.stat.getAgeStats.useQuery(
    toRef(() => props.filters)
  )

  const ageStats = computed(
    () =>
      (data.value?.map(({ _count, ageGroup }) => ({
        key: ageGroup,
        label: getStatLabel(ageGroupKeys.byKey, ageGroup),
        color: getStatColor(AgeGroupColors, ageGroup),
        count: _count
      })) || []) as StatsPiePropType
  )
</script>
