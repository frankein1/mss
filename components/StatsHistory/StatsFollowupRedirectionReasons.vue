<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartition des motifs de réorientation n'ont pas pu être chargées."
  />
  <template v-else-if="data?.reasons.length">
    <StatsList
      :total-count="totalCount"
      :stats="followupsWithReason"
      :display-total="false"
      stats-bar
    />

    <hr />
    <p class="fr-text--xs text--muted fr-text--bold fr-mb-0">
      RÉPARTITION DES MOTIFS DE RÉORIENTATION
    </p>
    <p class="fr-text--xs text--muted">
      Pourcentage calculé sur le total de synthèses d'entretiens. Une synthèse
      d'entretien pouvant donner lieu à plusieurs réorientations, la somme des
      pourcentages peut être supérieure à 100&nbsp;%.
    </p>
    <StatsList
      :total-count="totalCount"
      :stats="reasonStats"
      :with-sum="false"
    />
  </template>
  <p v-else>
    Commencez à créer des synthèses d'entretien dans les fiches de bénéficiaires
    pour voir apparaître les statistiques de la répartition des motifs de
    réorientation.
  </p>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { SupportColor } from '~/client/colors/support'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()
  const { data, error, status } =
    await trpcClient.stat.getFollowupRedirectionReasonsStats.useQuery(
      toRef(() => props.filters)
    )

  const followupsWithReason = computed(() => [
    {
      key: 'followupsWithReason',
      label: 'Entretiens avec un motif de réorientation renseigné',
      color: SupportColor.followups,
      emphasis: true,
      count: data.value?.followupsWithReason._count ?? 0
    }
  ])

  const reasonStats = computed(
    () =>
      data.value?.reasons.map(({ id, name, _count }) => ({
        key: id,
        label: name,
        color: SupportColor.followups,
        emphasis: false,
        count: _count
      })) ?? []
  )
</script>
