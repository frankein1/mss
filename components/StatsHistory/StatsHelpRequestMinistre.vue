<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des ministres n'ont pas pu être chargées."
  />
  <template v-else-if="ministreStats.length">
    <p class="fr-text--xs text--muted">
      Pourcentage calculé sur le nombre total d'instructions de dossier
    </p>
    <StatsList
      :total-count="totalCount"
      :stats="ministreStats"
    />
  </template>

  <p v-else>
    Commencez à créer des instructions de dossier dans les fiches de
    bénéficiaires pour voir apparaître les statistiques de la répartition des
    ministres.
  </p>
</template>

<script lang="ts" setup>
  import { ministerKeys, getStatLabel } from '~/client/options'
  import { StatFilterInput } from '~/server/schema'
  import { SupportColor } from '~/client/colors/support'
  import { AlertType } from '~/utils/constants/alert'
  import { useLoadStatisticsWithPost } from '~/composables/useLoadStatisticsWithPost'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const {
    data: ministreCounts,
    pending,
    error
  } = await useLoadStatisticsWithPost(
    'getHelpRequestMinistreStats',
    toRef(props.filters)
  )

  const ministreStats = computed(
    () =>
      ministreCounts.value?.map(({ _count, ministre }) => ({
        key: ministre || 'null',
        label: getStatLabel(ministerKeys.byKey, ministre),
        color: SupportColor.helpRequests,
        count: _count
      })) || []
  )
</script>
