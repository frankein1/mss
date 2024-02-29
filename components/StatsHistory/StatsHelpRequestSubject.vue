<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      :message="`Les statistiques de la répartion des objets d'accompagnement n'ont pas pu être chargées.`"
    />
    <template v-else-if="subjectStats">
      <h2 class="fr-h5">Objets d'accompagnement</h2>
      <p v-if="!filters.helpRequestSubject">
        Pourcentage calculé sur le nombre total d'instructions de dossier dans
        les thématiques "Aide financière" et "Autre"
      </p>
      <StatsList
        v-if="subjectStats.length"
        :total-count="totalCount"
        :stats="subjectStats"
      />
      <p v-else>
        Commencez à créer des instructions de dossier dans les fiches de
        bénéficiaires pour voir apparaître les statistiques de la répartition
        des objets d'accompagnement.
      </p>
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
    data: subjectCounts,
    error,
    pending
  } = await trpcClient.stat.getHelpRequestSubjectStats.useQuery(props.filters)

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
