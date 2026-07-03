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

  <template v-else-if="supportProgramStatsList.length">
    <p
      v-if="hasPeriodFilter"
      class="fr-text--xs text--muted"
    >
      Le filtre période s'applique aux entrées sorties des dispositifs.
    </p>
    <StatsList
      :stats="supportProgramStatsList"
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
    await trpcClient.stat.getSupportProgramStats.useQuery(
      toRef(() => props.filters)
    )

  const hasPeriodFilter = computed(() => {
    const { period, fromDate, toDate } = props.filters
    return (
      (period && period !== StatPeriodFilter.Custom) ||
      (period === StatPeriodFilter.Custom && (fromDate || toDate))
    )
  })

  const supportProgramStatsList = computed(() => {
    const list: Array<{
      key: string
      label: string
      count: number
      emphasis?: boolean
    }> = []

    for (const { name, count, entryCount, exitCount } of data.value || []) {
      list.push({ key: name, label: name, count, emphasis: true })

      if (hasPeriodFilter.value) {
        list.push(
          { key: `${name}-entry`, label: 'Entrées', count: entryCount },
          { key: `${name}-exit`, label: 'Sorties', count: exitCount }
        )
      }
    }

    return list
  })
</script>
