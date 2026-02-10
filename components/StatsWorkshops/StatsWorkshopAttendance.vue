<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Le décompte des ateliers n‘a pas pu être chargé."
  />
  <template
    v-else-if="workshopAttendanceStats && workshopAttendanceStats.length"
  >
    <StatsPie
      :stats="workshopAttendanceStats"
      pie-label="Nb. participants"
    />
  </template>
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
  import { WorkshopAttendeeAttendance } from '~/prisma/generated/browser'
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
  const trpc = useTrpcClient()

  const { data, error, status } =
    await trpc.stat.getWorkshopAttendanceStats.useQuery(
      toRef(() => props.filters)
    )

  const workshopAttendanceStats: Ref<StatsPiePropType> = computed(
    () =>
      data.value?.map(({ attendance, _count }) => ({
        key: attendance ?? STATS_NULL_KEY,
        label: getStatLabel(workshopAttendeeAttendanceKeys.byKey, attendance),
        color: getStatColor(AttendanceColor, attendance),
        count: _count
      })) ?? []
  )
</script>
