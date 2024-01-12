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
    <template v-else-if="followupTypesStats">
      <h2 class="fr-h5">Objets d'accompagnement</h2>
      <p>Pourcentage calculé sur le nombre total de synthèses d'entretien</p>
      <StatsList
        v-if="followupTypesStats.length"
        :total-count="totalCount"
        :stats="followupTypesStats"
      />
      <p v-else>
        Commencez à créer des synthèses d'entretien dans les fiches de
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
    data: followupTypesCounts,
    error,
    pending
  } = await trpcClient.stat.getFollowupFollowupTypeStats.useQuery(props.filters)

  const followupTypesStats = computed(
    () =>
      followupTypesCounts.value
        ?.map(({ id, name, _count }) => ({
          key: id,
          label: name,
          count: _count.socialSupports,
          color: SupportColor.followups
        }))
        .filter(typeCount => typeCount.count > 0) || []
  )
</script>

<style scoped>
  h2 {
    word-break: break-word;
  }
</style>
