<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des statuts n'ont pas pu être chargées."
    />
    <template v-else-if="statusStats">
      <h2 class="fr-h5">Statuts</h2>
      <StatsPie
        v-if="statusStats.length"
        pie-label="Répartion des statuts"
        :stats="statusStats"
        :total-count="totalCount"
      />
      <p v-else>
        Commencez à créer des synthèses d'entretien dans les fiches de
        bénéficiaires pour voir apparaître les statistiques de la répartition
        des statuts.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { FollowupStatus } from '@prisma/client'
  import { followupStatusLabels } from '~/client/options/followup'
  import { StatFilterInput } from '~/server/schema/filter.schema'
  import { AlertType } from '~~/utils/constants/alert'
  import { followupStatusColors } from '~/utils/constants/colors/followup'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const {
    data: statusCounts,
    error,
    pending
  } = useAsyncData<Array<{ status: FollowupStatus; _count: number }>>(
    `followupStatusStats`,
    () => trpcClient.stat.getFollowupStatusStats.query(props.filters),
    {
      default: () => [],
      watch: [props.filters]
    }
  )

  const statusStats = computed(
    () =>
      statusCounts.value?.map(({ _count, status }) => ({
        key: status,
        label: followupStatusLabels[status],
        color: followupStatusColors[status],
        count: _count
      })) || []
  )
</script>
