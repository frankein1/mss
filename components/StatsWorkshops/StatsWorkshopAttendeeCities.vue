<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des villes n'ont pas pu être chargées."
  />
  <template v-else-if="citiesStats && citiesStats.length">
    <StatsList
      :stats="citiesStats"
      stats-bar
    />
  </template>
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.workshop.AppWorkshopAdd.path()"
      >créer des ateliers</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des villes des
    participants.
  </p>
</template>

<script lang="ts" setup>
  import type { WorkshopStatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import type { StatsListPropType } from '~/types/stat'
  import { STATS_NULL_LABEL } from '~/utils/constants/stats'

  const props = defineProps<{
    filters: WorkshopStatFilterInput
  }>()
  const trpc = useTrpcClient()
  const { status, error, data } =
    await trpc.stat.getWorkshopAttendeeCityStats.useQuery(
      toRef(() => props.filters)
    )

  const citiesStats: Ref<StatsListPropType> = computed(
    () =>
      data.value?.map(({ _count, city }) => ({
        key: city ?? 'null',
        label: city ?? STATS_NULL_LABEL,
        count: _count
      })) ?? []
  )
</script>
