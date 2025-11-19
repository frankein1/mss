<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des types d'entretiens n'ont pas pu être chargées."
  />
  <template v-else-if="followupMediumStats && followupMediumStats.length">
    <StatsList
      :total-count="totalCount"
      :stats="followupMediumStats"
    />
  </template>
  <p v-else>
    Commencez à créer des synthèses d'entretien dans les fiches de bénéficiaires
    pour voir apparaître les statistiques de la répartition des types
    d'entretiens.
  </p>
</template>

<script lang="ts" setup>
  import { followupMediumKeys } from '~/client/options'
  import type { StatFilterInput } from '~/server/schema'
  import { SupportColor } from '~/client/colors/support'
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()
  const { data, error, status } =
    await trpcClient.stat.getFollowupMediumStats.useQuery(
      toRef(() => props.filters)
    )

  const followupMediumStats = computed(
    () =>
      data.value?.map(({ _count, medium }) => ({
        key: medium,
        label: followupMediumKeys.value(medium) || '',
        color: SupportColor.followups,
        count: _count
      })) || []
  )
</script>
