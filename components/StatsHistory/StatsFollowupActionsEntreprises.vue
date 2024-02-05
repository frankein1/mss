<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques des actions entreprises n'ont pas pu être chargées."
    />
    <template v-else-if="followupActionsEntreprisesStats">
      <h2 class="fr-h5">Actions entreprises</h2>
      <StatsList
        :total-count="totalCount"
        :stats="followupActionsEntreprisesStats"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { SupportColor } from '~/client/colors/support'
  import { AlertType } from '~/utils/constants/alert'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const {
    data: followupActionsEntreprises,
    error,
    pending
  } = await trpcClient.stat.getFollowupActionsEntreprisesStats.useQuery(
    props.filters
  )

  const followupActionsEntreprisesStats = computed(
    () =>
      followupActionsEntreprises.value?.map(
        ({ _count, actionEntrepriseId, actionEntreprise }) => ({
          key: actionEntrepriseId,
          label: actionEntreprise,
          color: SupportColor.followups,
          count: _count
        })
      ) || []
  )
</script>
