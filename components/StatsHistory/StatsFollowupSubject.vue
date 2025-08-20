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
  <template v-else-if="subjectsStats">
    <p class="fr-text--xs text--muted">
      Pourcentage calculé sur le nombre total de synthèses d’entretien. Les
      synthèses d'entretiens pouvant avoir plusieurs accompagnements associés,
      le total des pourcentages peut être supérieur à 100&nbsp;%.
    </p>

    <StatsList
      :total-count="totalCount"
      :stats="subjectsStats"
    />
  </template>
  <p v-else>
    Commencez à créer des synthèses d'entretien dans les fiches de bénéficiaires
    pour voir apparaître les statistiques de la répartition des objets
    d'accompagnement.
  </p>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~/server/schema'
  import { SupportColor } from '~/client/colors/support'
  import { AlertType } from '~/utils/constants/alert'
  import type { StatsPiePropType } from '~/types/stat'

  const props = defineProps<{
    totalCount: number
    filters: StatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const subjectsStats = ref<StatsPiePropType | null>(null)

  try {
    const trpc = useTrpcClient()
    const data = await trpc.stat.getFollowupSubjectStats.mutate(props.filters)
    if (data == null) {
      throw new Error('no data')
    }
    subjectsStats.value = (data
      .map(({ id, name, _count }) => ({
        key: id,
        label: name,
        count: _count.socialSupports,
        color: SupportColor.followups
      }))
      .filter(typeCount => typeCount.count > 0) || []) as StatsPiePropType
  } catch (err: unknown) {
    console.error(err)
    error.value = err as Error
  } finally {
    pending.value = false
  }
</script>

<style scoped>
  h2 {
    word-break: normal;
    overflow-wrap: anywhere;
  }
</style>
