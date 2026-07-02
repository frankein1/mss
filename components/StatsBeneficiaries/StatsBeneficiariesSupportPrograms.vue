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
    <p v-if="hasPeriodFilter">
      <button
        aria-describedby="tooltip-support-programs-period"
        type="button"
        class="fr-btn--tooltip fr-btn"
      >
        infobulle
      </button>
      <span
        id="tooltip-support-programs-period"
        class="fr-tooltip fr-placement"
        role="tooltip"
        >Le filtre de période ne s'applique pas à cette carte.
      </span>
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
    if (!data.value?.length) {
      return []
    }

    return data.value.map(({ name, count }) => ({
      key: name,
      label: name,
      count
    }))
  })
</script>
