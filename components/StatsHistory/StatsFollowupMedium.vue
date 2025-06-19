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
    v-if="followupMediumStats"
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
  import { StatsListPropType } from '~/types/stat'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const followupMediumStats = ref<StatsListPropType | null>(null)

  try {
    const trpc = useTrpcClient()
    const data = await trpc.stat.getFollowupMediumStats.mutate(props.filters)
    if (data == null) {
      throw new Error('no data')
    }
    followupMediumStats.value =
      data.map(({ _count, medium }) => ({
        key: medium,
        label: followupMediumKeys.value(medium) || '',
        color: SupportColor.followups,
        count: _count
      })) || []
  } catch (err: unknown) {
    console.error(err)
    error.value = err as Error
  } finally {
    pending.value = false
  }
</script>
