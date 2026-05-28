<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques de la répartion des types d'entretiens n'ont pas pu être chargées."
  />
  <template
    v-else-if="
      data &&
      (data.isThirdPartyInterviewCount > 0 || data.mediumStats.length > 0)
    "
  >
    <StatsList
      :total-count="totalCount"
      :stats="thirdPartyInterviewStat"
      :display-total="false"
    />
    <template v-if="followupMediumStats.length">
      <hr />
      <p class="fr-text--xs text--muted">
        <span class="fr-text--bold">RÉPARTITION DES TYPES D'ENTRETIEN</span>
      </p>
      <StatsList
        :total-count="totalCount"
        :stats="followupMediumStats"
      />
    </template>
  </template>
  <p v-else>
    Commencez à créer des synthèses d'entretien dans les fiches de bénéficiaires
    pour voir apparaître les statistiques de la répartition des types
    d'entretiens.
  </p>
</template>

<script lang="ts" setup>
  import { followupMediumKeys } from '~/client/options'
  import { followupFieldLabels } from '~/client/labels'
  import type { StatFilterInput } from '~/server/schema'
  import { SupportColor } from '~/client/colors/support'
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()
  const { data, error, status } =
    await trpcClient.stat.getFollowupMediumStats.useQuery(
      toRef(() => props.filters)
    )

  const thirdPartyInterviewStat = computed(() => [
    {
      key: 'isThirdPartyInterview',
      label: followupFieldLabels.isThirdPartyInterview,
      color: SupportColor.followups,
      emphasis: true,
      count: data.value?.isThirdPartyInterviewCount || 0
    }
  ])

  const followupMediumStats = computed(
    () =>
      data.value?.mediumStats.map(({ _count, medium }) => ({
        key: medium,
        label: followupMediumKeys.value(medium) || '',
        color: SupportColor.followups,
        count: _count
      })) || []
  )
</script>
