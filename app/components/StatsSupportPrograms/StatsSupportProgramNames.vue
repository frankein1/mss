<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Le nombre de bénéficiaires par dispositif n’a pas pu être chargé."
  />
  <StatsList
    v-else-if="supportProgramNameStats.length"
    :stats="supportProgramNameStats"
    :total-count="data?.total"
    :with-sum="false"
  />
  <p v-else>Aucun dispositif ne correspond aux filtres sélectionnés.</p>
</template>

<script lang="ts" setup>
  import type { SupportProgramStatFilterInput } from '~~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import type { StatsListPropType } from '~~/types/stat'

  const props = defineProps<{
    filters: SupportProgramStatFilterInput
  }>()
  const trpc = useTrpcClient()

  const { data, status, error } =
    await trpc.stat.getSupportProgramNameStats.useQuery(
      toRef(() => props.filters)
    )

  const supportProgramNameStats: Ref<StatsListPropType> = computed(
    () =>
      data.value?.supportProgramNames.map(({ id, name, _count }) => ({
        key: id,
        label: name,
        count: _count
      })) ?? []
  )
</script>
