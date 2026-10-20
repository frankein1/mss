<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les motifs de sortie n’ont pas pu être chargés."
  />
  <StatsList
    v-else-if="exitReasonStats.length"
    :stats="exitReasonStats"
  />
  <p v-else>Aucun dispositif ne correspond aux filtres sélectionnés.</p>
</template>

<script lang="ts" setup>
  import type { SupportProgramStatFilterInput } from '~~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import type { StatsListPropType } from '~~/types/stat'
  import { STATS_NULL_KEY, STATS_NULL_LABEL } from '~/utils/constants/stats'

  const props = defineProps<{
    filters: SupportProgramStatFilterInput
  }>()
  const trpc = useTrpcClient()

  const { data, status, error } =
    await trpc.stat.getSupportProgramExitReasonStats.useQuery(
      toRef(() => props.filters)
    )

  const exitReasonStats: Ref<StatsListPropType> = computed(
    () =>
      data.value?.map(({ id, name, _count }) => ({
        key: id ?? STATS_NULL_KEY,
        label: name ?? STATS_NULL_LABEL,
        count: _count
      })) ?? []
  )
</script>
