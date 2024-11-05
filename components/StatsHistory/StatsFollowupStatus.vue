<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des statuts n'ont pas pu être chargées."
  />
  <StatsPie
    v-if="statusStats.length"
    pie-label="Répartion des statuts"
    :stats="statusStats"
    :total-count="totalCount"
  />
  <p v-else>
    Commencez à créer des synthèses d'entretien dans les fiches de bénéficiaires
    pour voir apparaître les statistiques de la répartition des statuts.
  </p>
</template>

<script lang="ts" setup>
  import { SocialSupportStatus } from '@prisma/client'
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'

  const trpcClient = useTrpcClient()
  const { socialSupportStatusKeys } = useSocialSupportStatus()

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const {
    data: statusCounts,
    error,
    pending
  } = await trpcClient.stat.getFollowupStatusStats.useQuery(props.filters)

  const statusStats = computed(
    () =>
      statusCounts.value?.map(({ _count, status }) => ({
        key: status,
        label: socialSupportStatusKeys.value.value(status) || '',
        color: getColor(status),
        count: _count
      })) || []
  )

  function getColor(status: SocialSupportStatus) {
    if (status === SocialSupportStatus.Todo) {
      return '#3bea7e'
    }
    if (status === SocialSupportStatus.InProgress) {
      return '#7AB1E8'
    }
    if (status === SocialSupportStatus.Done) {
      return '#6f45f7'
    }
    return ''
  }
</script>
