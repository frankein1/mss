<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des organismes instructeurs n'ont pas pu être chargées."
    />
    <template v-else-if="instructorOrganizationStats">
      <h2 class="fr-h5">Organismes instructeurs</h2>
      <p>
        Pourcentage calculé sur le nombre total de demandes instruites en
        externe
      </p>
      <StatsList
        v-if="instructorOrganizationStats.length"
        :total-count="totalCount"
        :stats="instructorOrganizationStats"
      />
      <p v-else>
        Commencez à créer des instructions de demande d'aides dans les fiches de
        bénéficiaires pour voir apparaître les statistiques de la répartition
        des organismes instructeurs.
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

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const {
    data: instructorOrganizationCounts,
    pending,
    error
  } = await useTrpcClient().stat.getInstructorOrganizationStats.useQuery(
    props.filters
  )

  const instructorOrganizationStats = computed(() => {
    const _instructorOrganizationStats: { [k: string]: StatList } = {}
    instructorOrganizationCounts.value?.forEach(historyItem => {
      const instructorOrganizationId =
        historyItem.instructorOrganization?.id || 'null'
      if (instructorOrganizationId in _instructorOrganizationStats) {
        _instructorOrganizationStats[instructorOrganizationId].count++
      } else {
        _instructorOrganizationStats[instructorOrganizationId] = {
          key: instructorOrganizationId,
          label: historyItem.instructorOrganization?.name || STATS_NULL_LABEL,
          color: SupportColor.helpRequests,
          count: 1
        }
      }
    })
    const _instructorOrganizationStatsValues = Object.values(
      _instructorOrganizationStats
    )
    _instructorOrganizationStatsValues.sort((a, b) => b.count - a.count)
    return _instructorOrganizationStatsValues
  })
</script>
