<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Le décompte des ateliers n‘a pas pu être chargé."
  />
  <StatsPie
    v-if="workshopAttendeeGenderStats"
    :stats="workshopAttendeeGenderStats"
    pie-label="Répartion des genres des participants"
  />
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.workshop.AppWorkshopAdd.path()"
      >créer des ateliers</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des genres des
    participants.
  </p>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import type { StatsPiePropType } from '~/types/stat'
  import { getStatColor } from '~/client/colors'
  import { beneficiaryGenderKeys, getStatLabel } from '~/client/options'
  import { Gender } from '@prisma/client'
  import { ChartColor } from '~/utils/color/chartColors'
  import { STATS_NULL_KEY } from '~/utils/constants/stats'
  import { routes } from '~/utils/routes'

  const GenderColor = {
    [Gender.Female]: ChartColor.Peach,
    [Gender.Male]: ChartColor.LightBlue,
    [Gender.Other]: ChartColor.Yellow
  }

  const props = defineProps<{
    filters: StatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const trpc = useTrpcClient()

  const workshopAttendeeGenderStats = ref<StatsPiePropType | null>(null)

  watchEffect(async () => {
    try {
      const data = await trpc.stat.getWorkshopAttendeeGenderStats.mutate(
        props.filters
      )
      if (data == null) {
        throw new Error('no data')
      }
      workshopAttendeeGenderStats.value = data.map(({ gender, _count }) => ({
        key: gender ?? STATS_NULL_KEY,
        label: getStatLabel(beneficiaryGenderKeys.byKey, gender),
        color: getStatColor(GenderColor, gender),
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
