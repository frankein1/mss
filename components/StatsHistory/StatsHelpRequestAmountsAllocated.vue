<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    :message="`Les statistiques de la répartition des montants accordés n'ont pas pu être chargées.`"
  />
  <template v-else-if="amounts?.count.count">
    <StatsList
      v-if="count"
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
  import { StatFilterInput } from '~/server/schema'
  import { SupportColor } from '~/client/colors'
  import { helpRequestFieldLabels } from '~/client/labels'
  import { useLoadStatisticsWithPost } from '~/composables/useLoadStatisticsWithPost'

  const props = defineProps<{ filters: StatFilterInput }>()

  const {
    data: amounts,
    error,
    pending
  } = await useLoadStatisticsWithPost(
    'getHelpRequestAmountsAllocated',
    toRef(props.filters)
  )

  const count = computed(() =>
    amounts.value
      ? [
          {
            ...amounts.value.count,
            color: SupportColor.helpRequests,
            emphasis: true
          }
        ]
      : null
  )

  const stats = computed(() =>
    (amounts.value?.breakdown || []).map(amount => ({
      ...amount,
      color: SupportColor.helpRequests
    }))
  )
</script>
