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
  <template v-else-if="workshopPartnerStats && workshopPartnerStats.length">
    <StatsList :stats="workshopPartnerStats" />
  </template>
  <p v-else>
    Commencez à
    <NuxtLink :to="routes.workshop.AppWorkshopAdd.path()"
      >créer des ateliers</NuxtLink
    >
    pour voir apparaître les statistiques de la répartition des données
    partenaires.
  </p>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import type { StatsListPropType } from '~/types/stat'
  import { routes } from '~/utils/routes'
  import { STATS_NULL_KEY, STATS_NULL_LABEL } from '~/utils/constants/stats'

  const props = defineProps<{
    filters: StatFilterInput
  }>()
  const trpc = useTrpcClient()
  const { data, status, error } =
    await trpc.stat.getWorkshopPartnerStats.useQuery(toRef(() => props.filters))

  const workshopPartnerStats: Ref<StatsListPropType> = computed(
    () =>
      data.value?.map(({ id, name, _count }) => ({
        key: id ?? STATS_NULL_KEY,
        label: name ?? STATS_NULL_LABEL,
        count: _count
      })) ?? []
  )
</script>
