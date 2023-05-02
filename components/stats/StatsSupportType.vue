<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      :message="`Les statistiques de la répartion des objets des ${historyTypeLabel} n'ont pas pu être chargées.`"
    />
    <template v-else-if="supportTypesStats">
      <h2 class="fr-h5">Objets des {{ historyTypeLabel }}</h2>
      <p>
        Pourcentage calculé sur le nombre total
        {{ collection === 'helpRequests' ? 'de demandes' : "d'entretiens" }}
      </p>
      <StatsList
        v-if="supportTypesStats.length"
        :total-count="totalCount"
        :stats="supportTypesStats"
      />
      <p v-else>{{ emptyResultMessage }}</p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { StatFilterInput } from '~/server/schema/filter.schema'
  import { SupportColor } from '~/utils/constants/colors/support'
  import { AlertType } from '~/utils/constants/alert'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    totalCount: number
    collection: 'helpRequests' | 'followups'
    filters: StatFilterInput
  }>()

  const {
    data: supportTypesCounts,
    error,
    pending
  } = useAsyncData<
    Array<{
      id: string
      name: string
      _count: { followups: number; helpRequests: number }
    }>
  >(() => trpcClient.stat.getSupportStats.query(props.filters), {
    default: () => [],
    watch: [props.filters]
  })

  const supportTypesStats = computed(
    () =>
      supportTypesCounts.value
        ?.map(({ id, name, _count }) => ({
          key: id,
          label: name,
          count: _count[props.collection],
          color: SupportColor[props.collection]
        }))
        .filter(typeCount => typeCount.count > 0) || []
  )

  const historyTypeLabel = computed(() =>
    props.collection === 'helpRequests' ? 'demandes' : 'entretiens'
  )

  const emptyResultMessage = computed(() => {
    return `Commencez à créer des ${
      props.collection === 'helpRequests'
        ? "instructions de demande d'aides"
        : "synthèses d'entretien"
    } dans les fiches de bénéficiaires pour voir apparaître les statistiques de la répartition des objets des ${
      historyTypeLabel.value
    }.`
  })
</script>

<style scoped>
  h2 {
    word-break: break-word;
  }
</style>
