<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques des dispositifs n'ont pas pu être chargées."
  />

  <template v-else-if="deviceStats && deviceStats.length">
    <StatsList
      :stats="deviceStats"
      :stats-percentage="false"
      :display-total="false"
    />
  </template>
  <p v-else>
    Aucun dispositif n'est associé aux bénéficiaires pour cette période.
  </p>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()
  const { data, error, status } =
    await trpcClient.stat.getBeneficiaryDeviceStats.useQuery(
      toRef(() => props.filters)
    )

  const deviceStats = computed(
    () =>
      data.value?.map(({ name, count }) => ({
        key: name,
        label: name,
        count
      })) ?? []
  )
</script>
