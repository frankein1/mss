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

  <p>Pourcentage calculé sur le nombre total de synthèses d'entretien</p>
  <StatsList
    v-if="ministreStats.length"
    :total-count="totalCount"
    :stats="ministreStats"
  />
  <p v-else>
    Commencez à créer des synthèses d'entretien dans les fiches de bénéficiaires
    pour voir apparaître les statistiques de la répartition des ministres.
  </p>
</template>

<script lang="ts" setup>
  import { getStatLabel, ministerKeys } from '~/client/options'
  import { StatFilterInput } from '~/server/schema'
  import { SupportColor } from '~/client/colors/support'
  import { AlertType } from '~/utils/constants/alert'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const {
    data: ministreCounts,
    pending,
    error
  } = await trpcClient.stat.getFollowupMinistreStats.useQuery(props.filters)

  const ministreStats = computed(
    () =>
      ministreCounts.value?.map(({ _count, ministre }) => ({
        key: ministre || 'null',
        label: getStatLabel(ministerKeys.byKey, ministre),
        color: SupportColor.followups,
        count: _count
      })) || []
  )
</script>
