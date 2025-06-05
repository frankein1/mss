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
    Commencez à créer des instructions de dossier dans les fiches de
    bénéficiaires pour voir apparaître les statistiques de la répartition des
    statuts.
  </p>
</template>

<script lang="ts" setup>
  import { SocialSupportStatus } from '@prisma/client'
  import { StatFilterInput } from '~/server/schema'
  import { ChartColor } from '~/utils/color/chartColors'
  import { AlertType } from '~/utils/constants/alert'
  import { useLoadStatisticsWithPost } from '~/composables/useLoadStatisticsWithPost'

  const { socialSupportStatusKeys } = useSocialSupportStatus()

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const {
    data: statusCounts,
    error,
    pending
  } = await useLoadStatisticsWithPost(
    'getHelpRequestStatusStats',
    toRef(props.filters)
  )

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
    if (status === SocialSupportStatus.WaitingAdditionalInformation) {
      return ChartColor.Yellow
    }
    if (status === SocialSupportStatus.InvestigationOngoing) {
      return ChartColor.LightBlue
    }
    if (status === SocialSupportStatus.Accepted) {
      return ChartColor.Green
    }
    if (status === SocialSupportStatus.Refused) {
      return ChartColor.Pink
    }
    if (status === SocialSupportStatus.Adjourned) {
      return ChartColor.Peach
    }
    if (status === SocialSupportStatus.ClosedByBeneficiary) {
      return ChartColor.DeepBlue
    }
    if (status === SocialSupportStatus.ClosedByAgent) {
      return ChartColor.LightPink
    }
    if (status === SocialSupportStatus.Dismissed) {
      return ChartColor.GreenArchipel
    }
    return ChartColor.Gray
  }
</script>
