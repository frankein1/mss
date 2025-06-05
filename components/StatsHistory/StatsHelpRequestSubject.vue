<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    :message="`Les statistiques de la répartion des objets d'accompagnement n'ont pas pu être chargées.`"
  />
  <template v-else-if="subjectStats.length">
    <p class="fr-text--xs text--muted">
      Pourcentage calculé sur le nombre total d'instructions de dossier.
    </p>
    <StatsList
      :total-count="totalCount"
      :stats="subjectStats"
    />
  </template>
  <p v-else>
    Commencez à créer des instructions de dossier dans les fiches de
    bénéficiaires pour voir apparaître les statistiques de la répartition des
    objets d'accompagnement.
  </p>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema'
  import { SupportColor } from '~/client/colors/support'
  import { AlertType } from '~/utils/constants/alert'
  import { useLoadStatisticsWithPost } from '~/composables/useLoadStatisticsWithPost'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const {
    data: subjectCounts,
    error,
    pending
  } = await useLoadStatisticsWithPost(
    'getHelpRequestSubjectStats',
    toRef(props.filters)
  )

  const subjectStats = computed(
    () =>
      subjectCounts.value
        ?.map(({ id, name, _count }) => ({
          key: id,
          label: name,
          count: _count.socialSupports,
          color: SupportColor.helpRequests
        }))
        .filter(typeCount => typeCount.count > 0) || []
  )
</script>

<style scoped>
  h2 {
    word-break: break-word;
  }
</style>
