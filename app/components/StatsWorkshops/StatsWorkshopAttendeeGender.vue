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
    v-else-if="
      workshopAttendeeGenderStats && workshopAttendeeGenderStats.length
    "
  >
    <StatsPie
      :stats="workshopAttendeeGenderStats"
      pie-label="Nb. participants"
    />
  </template>
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
  import type { StatFilterInput } from '~~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import type { StatsPiePropType } from '~~/types/stat'
  import { getStatColor } from '~~/client/colors'
  import { beneficiaryGenderKeys, getStatLabel } from '~~/client/options'
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
  const trpc = useTrpcClient()

  const { data, status, error } =
    await trpc.stat.getWorkshopAttendeeGenderStats.useQuery(
      toRef(() => props.filters)
    )
  const workshopAttendeeGenderStats: Ref<StatsPiePropType> = computed(
    () =>
      data.value?.map(({ gender, _count }) => ({
        key: gender ?? STATS_NULL_KEY,
        label: getStatLabel(beneficiaryGenderKeys.byKey, gender),
        color: getStatColor(GenderColor, gender),
        count: _count
      })) ?? []
  )
</script>
