<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques des actions entreprises n'ont pas pu être chargées."
  />
  <template v-else-if="totalCount">
    <p class="fr-text--xs text--muted">
      Pourcentage calculé sur le nombre total de synthèses d'entretien. Une
      synthèse d'entretien pouvant donner lieu à plusieurs actions, la somme des
      pourcentages peut être supérieure à 100&nbsp;%.
    </p>
    <StatsList
      :total-count="totalCount"
      :stats="followupActionsEntreprisesStats"
      :with-sum="false"
    />
  </template>
  <p v-else>
    Commencez à créer des synthèses d'entretien dans les fiches de bénéficiaires
    pour voir apparaître les statistiques de la répartition des ministres.
  </p>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~/server/schema'
  import { SupportColor } from '~/client/colors/support'
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()
  const { data, error, status } =
    await trpcClient.stat.getFollowupActionsEntreprisesStats.useQuery(
      toRef(() => props.filters)
    )

  const followupActionsEntreprisesStats = computed(
    () =>
      data.value?.map(({ _count, actionEntrepriseId, actionEntreprise }) => ({
        key: actionEntrepriseId,
        label: actionEntreprise,
        color: SupportColor.followups,
        count: _count
      })) || []
  )
</script>
