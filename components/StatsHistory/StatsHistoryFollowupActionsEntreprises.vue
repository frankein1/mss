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
  import { AlertType } from '~~/utils/constants/alert'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const {
    data: followupActionsEntreprises,
    error,
    pending
  } = useAsyncData<
    Array<{ redirected: boolean | null; helpRequested: boolean | null }>
  >(
    () =>
      trpcClient.stat.getFollowupActionsEntreprisesStats.query(props.filters),
    {
      default: () => [],
      watch: [props.filters]
    }
  )

  const followupActionsEntreprisesStats = computed(() => {
    const _followupsActionsEntreprises = {
      redirected: {
        key: 'redirected',
        label: 'Réorientation',
        color: SupportColor.followups,
        count: 0
      },
      helpRequested: {
        key: 'helpRequested',
        label: 'Instruction',
        color: SupportColor.followups,
        count: 0
      }
    }

    followupActionsEntreprises.value?.forEach(followup => {
      if (followup.redirected) {
        _followupsActionsEntreprises.redirected.count++
      }
      if (followup.helpRequested) {
        _followupsActionsEntreprises.helpRequested.count++
      }
    })

    const followupsActionsEntreprisesValues = Object.values(
      _followupsActionsEntreprises
    )
    followupsActionsEntreprisesValues.sort((a, b) => b.count - a.count)
    return followupsActionsEntreprisesValues
  })
</script>
