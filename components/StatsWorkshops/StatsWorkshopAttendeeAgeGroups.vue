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
      pie-label="Nb. participants"
      :stats="ageStats"
    />
  </template>
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.workshop.AppWorkshopAdd.path()"
      >créer des ateliers</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des tranches d'âge
    des participants.
  </p>
</template>

<script lang="ts" setup>
  import type { WorkshopStatFilterInput } from '~/server/schema'
  import { AgeGroup, ageGroupKeys, getStatLabel } from '~/client/options'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { getStatColor } from '~/client/colors/stats'
  import type { StatsPiePropType } from '~/types/stat'
  import { ChartColor } from '~/utils/color/chartColors'
  import { STATS_NULL_KEY } from '~/utils/constants/stats'

  const AgeGroupColors = {
    [AgeGroup.Less18]: ChartColor.LightPink,
    [AgeGroup.Group18_24]: ChartColor.Peach,
    [AgeGroup.Group25_34]: ChartColor.LightBlue,
    [AgeGroup.Group35_44]: ChartColor.Yellow,
    [AgeGroup.Group45_54]: ChartColor.Pink,
    [AgeGroup.Group55_64]: ChartColor.DeepBlue,
    [AgeGroup.More65]: ChartColor.Green,
    [AgeGroup.Custom]: ChartColor.Gray
  }

  const props = defineProps<{
    filters: WorkshopStatFilterInput
  }>()
  const trpc = useTrpcClient()

  const { status, error, data } =
    await trpc.stat.getWorkshopAttendeeAgeStats.useQuery(
      toRef(() => props.filters)
    )

  const ageStats: Ref<StatsPiePropType> = computed(
    () =>
      data.value?.map(({ ageGroup, _count }) => ({
        key: ageGroup ?? STATS_NULL_KEY,
        label: getStatLabel(ageGroupKeys.byKey, ageGroup),
        color: getStatColor(AgeGroupColors, ageGroup),
        count: _count
      })) ?? []
  )
</script>
