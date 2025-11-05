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
  <template v-else-if="workshopNameStats && workshopNameStats.length">
    <StatsList
      :stats-percentage="false"
      :stats="workshopNameStats"
    />
  </template>
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.workshop.AppWorkshopAdd.path()"
      >créer des ateliers</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des séances.
  </p>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import type { StatsListPropType } from '~/types/stat'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    filters: StatFilterInput
  }>()
  const trpc = useTrpcClient()
  const { data, status, error } = await trpc.stat.getWorkshopNameStats.useQuery(
    toRef(() => props.filters)
  )
  const workshopNameStats: Ref<StatsListPropType> = computed(
    () =>
      data.value?.map(({ id, name, _count }) => ({
        key: id,
        label: name,
        count: _count
      })) ?? []
  )
</script>
