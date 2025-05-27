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
    v-if="ageStats"
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

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    beneficiaryCount: number
    filters: StatFilterInput
  }>()

  const error = ref<boolean>(false)
  const pending = ref<boolean>(false)
  const ageStats = ref<StatsPiePropType | null>(null)
  const router = trpcClient.stat
  const updatedAge = router.getAgeStatsPost.useMutation()

  onMounted(async () => {
    pending.value = true
    useTrpcMutation({
      mutation: () => updatedAge.mutate(props.filters),
      onSuccess: data => {
        console.log(data)
        if (updatedAge.error.value) {
          error.value = true
          return
        }
        pending.value = false
        ageStats.value = (data?.map(({ _count, ageGroup }) => ({
          key: ageGroup,
          label: getStatLabel(ageGroupKeys.byKey, ageGroup),
          color: getStatColor(AgeGroupColors, ageGroup),
          count: _count
        })) || []) as StatsPiePropType
      },
      onFailure: () => {
        error.value = true
      }
    })
  })
</script>
