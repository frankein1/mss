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
    v-if="statusStats"
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
  import type { StatFilterInput } from '~/server/schema'
  import type { StatsPiePropType } from '~/types/stat'
  import { ChartColor } from '~/utils/color/chartColors'
  import { AlertType } from '~/utils/constants/alert'

  const { socialSupportStatusKeys } = useSocialSupportStatus()

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const statusStats = ref<StatsPiePropType | null>(null)
  try {
    const trpc = useTrpcClient()
    const data = await trpc.stat.getFollowupStatusStats.mutate(props.filters)
    if (data == null) {
      throw new Error('no data')
    }
    statusStats.value = (data.map(({ _count, status }) => ({
      key: status,
      label: socialSupportStatusKeys.value.value(status) || '',
      color: getColor(status),
      count: _count
    })) || []) as StatsPiePropType
  } catch (err: unknown) {
    console.error(err)
    error.value = err as Error
  } finally {
    pending.value = false
  }

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
