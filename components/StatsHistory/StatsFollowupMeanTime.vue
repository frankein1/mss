<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques sur la durée moyenne des entretiens n'ont pas pu être chargées."
  />
  <template v-else-if="meanTimeStats">
    <p class="fr-text--xs text--muted">
      Seuls les entretiens avec une durée renseignée sont comptabilisés. Les
      durées “plus de 1 heure” sont comptabilisés comme “1h30”.
      <br />Un entretien pouvant compter plus d'un objet, les durées sont
      additionnées.
    </p>

    <StatsList
      v-if="meanTime"
      :total-count="totalCount"
      :stats="[
        {
          key: useId(),
          label: 'Durée moyenne des entretiens',
          count: meanTime,
          emphasis: true,
          color: SupportColor.followups
        }
      ]"
      :stats-percentage="false"
      :to-fixed="0"
      unit=" min"
      :with-sum="false"
    />
    <StatsList
      v-if="meanTimeStats"
      :total-count="totalCount"
      :stats="meanTimeStats"
      :stats-percentage="false"
      :to-fixed="0"
      unit=" min"
      :with-sum="false"
    />
  </template>
  <p v-else>
    Commencez à créer des synthèses d'entretien dans les fiches de bénéficiaires
    pour voir apparaître les statistiques de la répartition des organismes
    prescripteurs.
  </p>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { SupportColor } from '~/client/colors'
  import { getSocialSupportSubjectTotalDuration } from '~/utils/followups/getSocialSupportSubjetcTotalDuration'
  import { StatsPiePropType } from '~/types/stat'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const meanTimeStats = ref<StatsPiePropType | null>(null)
  try {
    const trpc = useTrpcClient()
    const data = await trpc.stat.getFollowupMeanTimeStats.mutate(props.filters)
    if (data == null) {
      throw new Error('no data')
    }
    meanTimeStats.value =
      data.map(item => {
        return {
          key: item.id || 'null',
          label: item.name,
          count: getSocialSupportSubjectTotalDuration(item.socialSupports),
          color: SupportColor.followups
        }
      }) || []
  } catch (err: unknown) {
    console.error(err)
    error.value = err as Error
  } finally {
    pending.value = false
  }

  const meanTime = computed(() => {
    if (meanTimeStats.value == null || meanTimeStats.value?.length === 0) {
      return 0
    }
    return (
      meanTimeStats.value.reduce((total, item) => total + item.count, 0) /
      meanTimeStats.value.length
    )
  })
</script>
