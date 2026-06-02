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

  <template v-else-if="deviceStatsList.length">
    <StatsList
      :stats="deviceStatsList"
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
  import { StatPeriodFilter } from '~/types/stat'

  const props = defineProps<{
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()
  const { data, error, status } =
    await trpcClient.stat.getBeneficiaryDeviceStats.useQuery(
      toRef(() => props.filters)
    )

  const hasPeriodFilter = computed(() => {
    const { period, fromDate, toDate } = props.filters
    return (
      (period && period !== StatPeriodFilter.Custom) ||
      (period === StatPeriodFilter.Custom && (fromDate || toDate))
    )
  })

  const deviceStatsList = computed(() => {
    if (!data.value?.length) {return []}

    const list: Array<{
      key: string
      label: string
      count: number
      emphasis?: boolean
    }> = []

    for (const { name, count, entryCount, exitCount } of data.value) {
      list.push({ key: name, label: name, count, emphasis: true })

      if (hasPeriodFilter.value) {
        list.push(
          {
            key: `${name}-entry`,
            label: 'Entrée',
            count: entryCount,
            emphasis: false
          },
          {
            key: `${name}-exit`,
            label: 'Sortie',
            count: exitCount,
            emphasis: false
          }
        )
      }
    }

    return list
  })
</script>
