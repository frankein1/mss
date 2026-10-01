<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Le nombre d’entrées et de sorties n’a pas pu être chargé."
  />
  <StatsArray
    v-else-if="statsArray.length"
    :stats-array="statsArray"
    :headers="['Dispositifs', 'Entrées', 'Sorties']"
  />
  <p v-else>Aucun dispositif ne correspond aux filtres sélectionnés.</p>
</template>

<script lang="ts" setup>
  import type { SupportProgramStatFilterInput } from '~~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import type { StatsArrayPropType } from '~~/types/stat'

  const props = defineProps<{
    filters: SupportProgramStatFilterInput
  }>()

  const trpc = useTrpcClient()
  const { data, status, error } =
    await trpc.stat.getSupportProgramEntriesExitsStats.useQuery(
      toRef(() => props.filters)
    )

  const statsArray = computed<StatsArrayPropType>(
    () =>
      data.value?.map(({ name, entries, exits }) => [name, entries, exits]) ??
      []
  )
</script>
