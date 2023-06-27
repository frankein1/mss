<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des organismes prescripteurs n'ont pas pu être chargées."
    />
    <template v-else-if="prescribingOrganizationStats">
      <h2 class="fr-h5">Organismes prescripteurs</h2>
      <p>Pourcentage calculé sur le nombre total de demandes d'aide</p>
      <StatsList
        v-if="prescribingOrganizationStats.length"
        :total-count="totalCount"
        :stats="prescribingOrganizationStats"
      />
      <p v-else>
        Commencez à créer des instructions de demande d'aides dans les fiches de
        bénéficiaires pour voir apparaître les statistiques de la répartition
        des organismes prescripteurs.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { StatList } from '~/types/stat'
  import { AlertType } from '~/utils/constants/alert'
  import { STATS_NULL_LABEL } from '~/client/options/stat'
  import { SupportColor } from '~/client/colors/support'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const {
    data: prescribingOrganizationCounts,
    pending,
    error
  } = useAsyncData<
    Array<{ prescribingOrganization: { id: string; name: string } | null }>
  >(
    () =>
      trpcClient.stat.getHelpRequestPrescribingOrganizationStats.query(
        props.filters
      ),
    {
      default: () => [],
      watch: [props.filters]
    }
  )

  const prescribingOrganizationStats = computed(() => {
    const _prescribingOrganizationStats: { [k: string]: StatList } = {}
    prescribingOrganizationCounts.value?.forEach(historyItem => {
      const prescribingOrganizationId =
        historyItem.prescribingOrganization?.id || 'null'
      if (prescribingOrganizationId in _prescribingOrganizationStats) {
        _prescribingOrganizationStats[prescribingOrganizationId].count++
      } else {
        _prescribingOrganizationStats[prescribingOrganizationId] = {
          key: prescribingOrganizationId,
          label: historyItem.prescribingOrganization?.name || STATS_NULL_LABEL,
          color: SupportColor.helpRequests,
          count: 1
        }
      }
    })
    const _prescribingOrganizationStatsValues = Object.values(
      _prescribingOrganizationStats
    )
    _prescribingOrganizationStatsValues.sort((a, b) => b.count - a.count)
    return _prescribingOrganizationStatsValues
  })
</script>
