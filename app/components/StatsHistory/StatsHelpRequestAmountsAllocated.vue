<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    :message="`Les statistiques de la répartition des montants accordés n'ont pas pu être chargées.`"
  />
  <template v-else-if="stats && stats.length && count">
    <StatsList
      :stats="count"
      :display-total="false"
      :big-text="true"
      :stats-percentage="false"
    />
    <hr />
    <StatsList
      :stats
      :to-fixed="2"
      with-sub-count
      stats-bar
      :stats-percentage="false"
      :sub-count-label="helpRequestFieldLabels.askedAmount"
      unit="€"
      :display-total="false"
    />
  </template>
  <p v-else>
    Aucune demande d'aide financière accordée n'a été enregistrée pour le
    moment.
  </p>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import type { StatFilterInput } from '~~/server/schema'
  import { SupportColor } from '~~/client/colors'
  import { helpRequestFieldLabels } from '~~/client/labels'

  const props = defineProps<{ filters: StatFilterInput }>()

  const trpcClient = useTrpcClient()
  const { data, error, status } =
    await trpcClient.stat.getHelpRequestAmountsAllocated.useQuery(
      toRef(() => props.filters)
    )
  if (data.value == null) {
    throw new Error('no data')
  }

  const count = computed(() => {
    if (data.value?.count.count == null || data.value?.count.count === 0) {
      return null
    }
    return [
      {
        ...data.value.count,
        color: SupportColor.helpRequests,
        emphasis: true
      }
    ]
  })

  const stats = computed(() =>
    (data.value?.breakdown || []).map(amount => ({
      ...amount,
      color: SupportColor.helpRequests
    }))
  )
</script>
