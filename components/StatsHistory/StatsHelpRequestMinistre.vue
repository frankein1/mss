<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des ministres n'ont pas pu être chargées."
  />
  <template v-else-if="ministreStats && ministreStats.length">
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
  import type { StatFilterInput } from '~/server/schema'
  import { SupportColor } from '~/client/colors/support'
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()
  const { data, error, status } =
    await trpcClient.stat.getHelpRequestMinistreStats.useQuery(
      toRef(() => props.filters)
    )

  const ministreStats = computed(
    () =>
      data.value?.map(({ _count, ministre }) => ({
        key: ministre || 'null',
        label: getStatLabel(ministerKeys.byKey, ministre),
        color: SupportColor.helpRequests,
        count: _count
      })) || []
  )
</script>
