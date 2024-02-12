<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des types d'entretiens n'ont pas pu être chargées."
    />
    <template v-else-if="followupMediumStats">
      <h2 class="fr-h5">Types d'entretiens</h2>
      <StatsList
        v-if="followupMediumStats.length"
        :total-count="totalCount"
        :stats="followupMediumStats"
      />
      <p v-else>
        Commencez à créer des synthèses d'entretien dans les fiches de
        bénéficiaires pour voir apparaître les statistiques de la répartition
        des types d'entretiens.
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { followupMediumLabels } from '~/client/options'
  import { StatFilterInput } from '~/server/schema'
  import { SupportColor } from '~/client/colors/support'
  import { AlertType } from '~/utils/constants/alert'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const {
    data: followupMediumCounts,
    error,
    pending
  } = await trpcClient.stat.getFollowupMediumStats.useQuery(props.filters)

  const followupMediumStats = computed(
    () =>
      followupMediumCounts.value?.map(({ _count, medium }) => ({
        key: medium,
        label: followupMediumLabels[medium],
        color: SupportColor.followups,
        count: _count
      })) || []
  )
</script>
