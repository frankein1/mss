<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des statuts n'ont pas pu être chargées."
  />
  <template v-else-if="statusStats && statusStats.length">
    <StatsPie
      v-if="statusStats"
      pie-label="Répartion des statuts"
      :stats="statusStats"
      :total-count="totalCount"
    />
  </template>
  <p v-else>
    Commencez à créer des synthèses d'entretien dans les fiches de bénéficiaires
    pour voir apparaître les statistiques de la répartition des statuts.
  </p>
</template>

<script lang="ts" setup>
  import { SocialSupportStatus } from '~/prisma/generated/browser'
  import type { StatFilterInput } from '~/server/schema'
  import type { StatsPiePropType } from '~/types/stat'
  import { ChartColor } from '~/utils/color/chartColors'
  import { AlertType } from '~/utils/constants/alert'

  const { socialSupportStatusKeys } = useSocialSupportStatus()

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()

  const { data, error, status } =
    await trpcClient.stat.getFollowupStatusStats.useQuery(
      toRef(() => props.filters)
    )

  const statusStats = computed(
    () =>
      (data.value?.map(({ _count, status }) => ({
        key: status,
        label: socialSupportStatusKeys.value.value(status) || '',
        color: getColor(status),
        count: _count
      })) || []) as StatsPiePropType
  )

  function getColor(status: SocialSupportStatus) {
    if (status === SocialSupportStatus.Todo) {
      return ChartColor.LightBlue
    }
    if (status === SocialSupportStatus.InProgress) {
      return ChartColor.Peach
    }
    if (status === SocialSupportStatus.Done) {
      return ChartColor.Green
    }
    return ChartColor.Gray
  }
</script>
