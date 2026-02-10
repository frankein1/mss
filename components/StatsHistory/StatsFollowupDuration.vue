<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la durée des entretiens n'ont pas pu être chargées."
  />
  <template v-else-if="durationStats && durationStats.length">
    <StatsPie
      pie-label="Répartion des durées des entretiens"
      :stats="durationStats"
      :total-count="totalCount"
      :not-filled-route="
        routes.file.AppHistory.path({
          notFilled: FilterFollowupNotFilled.Duration,
          tab: HistoryTab.Followups
        })
      "
    />
  </template>
  <p v-else>
    Commencez à créer des synthèses d'entretien dans les fiches de bénéficiaires
    pour voir apparaître les statistiques de la répartition des organismes
    prescripteurs.
  </p>
</template>

<script lang="ts" setup>
  import { FollowupDuration } from '~/prisma/generated/browser'
  import { followupDurationKeys, getStatLabel } from '~/client/options'
  import type { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { FilterFollowupNotFilled } from '~/utils/constants/filters'
  import { HistoryTab } from '~/utils/constants/history'
  import { ChartColor } from '~/utils/color/chartColors'
  import type { StatsPiePropType } from '~/types/stat'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()
  const { data, error, status } =
    await trpcClient.stat.getFollowupDurationStats.useQuery(
      toRef(() => props.filters)
    )

  const durationStats = computed(
    () =>
      (data.value?.map(({ _count, duration }) => {
        return {
          key: duration || 'null',
          label: getStatLabel(followupDurationKeys.byKey, duration),
          color: getColor(duration),
          count: _count
        }
      }) || []) as StatsPiePropType
  )

  function getColor(duration: FollowupDuration | null) {
    if (duration === FollowupDuration.Half) {
      return ChartColor.Peach
    }
    if (duration === FollowupDuration.Hour) {
      return ChartColor.Green
    }
    if (duration === FollowupDuration.MoreThanHour) {
      return ChartColor.Yellow
    }
    if (duration === FollowupDuration.Quarter) {
      return ChartColor.Pink
    }
    if (duration === FollowupDuration.ThreeQuarter) {
      return ChartColor.LightBlue
    }
    return ChartColor.Gray
  }
</script>
