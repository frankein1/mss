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
  <template v-else-if="subjectStats">
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
  import type { StatFilterInput } from '~/server/schema'
  import { SupportColor } from '~/client/colors/support'
  import { AlertType } from '~/utils/constants/alert'
  import type { StatsListPropType } from '~/types/stat'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const subjectStats = ref<StatsListPropType | null>(null)

  try {
    const trpc = useTrpcClient()
    const data = await trpc.stat.getHelpRequestSubjectStats.mutate(
      props.filters
    )
    if (data == null) {
      throw new Error('no data')
    }
    subjectStats.value =
      data
        .map(({ id, name, _count }) => ({
          key: id,
          label: name,
          count: _count.socialSupports,
          color: SupportColor.helpRequests
        }))
        .filter(typeCount => typeCount.count > 0) || []
  } catch (err: unknown) {
    console.error(err)
    error.value = err as Error
  } finally {
    pending.value = false
  }
</script>

<style scoped>
  h2 {
    word-break: break-word;
  }
</style>
