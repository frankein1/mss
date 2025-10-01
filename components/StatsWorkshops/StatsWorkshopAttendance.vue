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
    v-if="workshopAttendanceStats"
    :stats="workshopAttendanceStats"
    pie-label="Répartion des présences des participants"
  />
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.workshop.AppWorkshopAdd.path()"
      >créer des ateliers</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des présences des
    participants.
  </p>
</template>

<script lang="ts" setup>
  import type { WorkshopStatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import type { StatsPiePropType } from '~/types/stat'
  import { getStatColor } from '~/client/colors'
  import {
    getStatLabel,
    workshopAttendeeAttendanceKeys
  } from '~/client/options'
  import { WorkshopAttendeeAttendance } from '@prisma/client'
  import { ChartColor } from '~/utils/color/chartColors'
  import { STATS_NULL_KEY } from '~/utils/constants/stats'
  import { routes } from '~/utils/routes'

  const AttendanceColor = {
    [WorkshopAttendeeAttendance.Seen]: ChartColor.Peach,
    [WorkshopAttendeeAttendance.Excused]: ChartColor.LightBlue,
    [WorkshopAttendeeAttendance.NoShow]: ChartColor.Yellow
  }

  const props = defineProps<{
    filters: WorkshopStatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const trpc = useTrpcClient()

  const workshopAttendanceStats = ref<StatsPiePropType | null>(null)

  watchEffect(async () => {
    try {
      const data = await trpc.stat.getWorkshopAttendanceStats.mutate(
        props.filters
      )
      if (data == null) {
        throw new Error('no data')
      }
      workshopAttendanceStats.value = data.map(({ attendance, _count }) => ({
        key: attendance ?? STATS_NULL_KEY,
        label: getStatLabel(workshopAttendeeAttendanceKeys.byKey, attendance),
        color: getStatColor(AttendanceColor, attendance),
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
