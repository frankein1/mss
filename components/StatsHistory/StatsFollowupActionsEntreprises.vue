<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques des actions entreprises n'ont pas pu être chargées."
  />
  <p>
    Pourcentage calculé sur le nombre total de synthèses d'entretien. Une
    synthèse d'entretien pouvant donner lieu à plusieurs actions, la somme des
    pourcentages peut être supérieure à 100%.
  </p>
  <StatsList
    :total-count="totalCount"
    :stats="followupActionsEntreprisesStats"
    :with-sum="false"
  />
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
