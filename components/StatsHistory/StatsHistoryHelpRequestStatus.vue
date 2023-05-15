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
        Commencez à créer des instructions de demande d'aide dans les fiches de
        bénéficiaires pour voir apparaître les statistiques de la répartition
        des statuts.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { HelpRequestStatus } from '@prisma/client'
  import { helpRequestStatusLabels } from '~/client/options/helpRequest'
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~~/utils/constants/alert'
  import { helpRequestStatusColors } from '~/client/colors/helpRequest'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const {
    data: statusCounts,
    error,
    pending
  } = useAsyncData<Array<{ status: HelpRequestStatus; _count: number }>>(
    `helpRequestStatusStats`,
    () => trpcClient.stat.getHelpRequestStatusStats.query(props.filters),
    {
      default: () => [],
      watch: [props.filters]
    }
  )

  const statusStats = computed(
    () =>
      statusCounts.value?.map(({ _count, status }) => ({
        key: status,
        label: helpRequestStatusLabels[status],
        color: helpRequestStatusColors[status],
        count: _count
      })) || []
  )
</script>
