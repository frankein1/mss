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
  <StatsList
    v-if="workshopNameStats"
    :stats-percentage="false"
    :stats="workshopNameStats"
  />
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

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const trpc = useTrpcClient()

  const workshopNameStats = ref<StatsListPropType | null>(null)

  watchEffect(async () => {
    try {
      const data = await trpc.stat.getWorkshopNameStats.mutate(props.filters)
      if (data == null) {
        throw new Error('no data')
      }
      workshopNameStats.value = data.map(({ id, name, _count }) => ({
        key: id,
        label: name,
        count: _count.workshops
      }))
    } catch (err: unknown) {
      console.error(err)
      error.value = err as Error
    } finally {
      pending.value = false
    }
  })
</script>
