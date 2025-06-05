<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des types d'entretiens n'ont pas pu être chargées."
  />
  <StatsList
    v-if="followupMediumStats.length"
    :total-count="totalCount"
    :stats="followupMediumStats"
  />
  <p v-else>
    Commencez à créer des synthèses d'entretien dans les fiches de bénéficiaires
    pour voir apparaître les statistiques de la répartition des types
    d'entretiens.
  </p>
</template>

<script lang="ts" setup>
  import { followupMediumKeys } from '~/client/options'
  import { StatFilterInput } from '~/server/schema'
  import { SupportColor } from '~/client/colors/support'
  import { AlertType } from '~/utils/constants/alert'
  import { useLoadStatisticsWithPost } from '~/composables/useLoadStatisticsWithPost'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const {
    data: followupMediumCounts,
    error,
    pending
  } = await useLoadStatisticsWithPost(
    'getFollowupMediumStats',
    toRef(props.filters)
  )

  const followupMediumStats = computed(
    () =>
      followupMediumCounts.value?.map(({ _count, medium }) => ({
        key: medium,
        label: followupMediumKeys.value(medium) || '',
        color: SupportColor.followups,
        count: _count
      })) || []
  )
</script>
