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
  />
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
    [AgeGroup.More65]: ChartColor.Green
  }

  const props = defineProps<{
    filters: WorkshopStatFilterInput
  }>()
  const trpc = useTrpcClient()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const ageStats = ref<StatsPiePropType | null>(null)

  watchEffect(async () => {
    try {
      const data = await trpc.stat.getWorkshopAttendeeAgeStats.mutate(
        props.filters
      )
      if (data == null) {
        throw new Error('no data')
      }
      ageStats.value = data.map(({ ageGroup, _count }) => ({
        key: ageGroup ?? STATS_NULL_KEY,
        label: getStatLabel(ageGroupKeys.byKey, ageGroup),
        color: getStatColor(AgeGroupColors, ageGroup),
        count: _count
      }))
    } catch (err: unknown) {
      console.error(err)
      error.value = err as Error
    } finally {
      pending.value = false
    }
  })
</script>
