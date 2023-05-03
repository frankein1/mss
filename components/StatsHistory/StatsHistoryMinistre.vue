<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des ministres n'ont pas pu être chargées."
    />
    <template v-else-if="ministreStats">
      <h2 class="fr-h5">Ministres</h2>
      <p>
        Pourcentage calculé sur le nombre total
        {{ collection === 'helpRequests' ? 'de demandes' : "d'entretiens" }}
      </p>
      <StatsList
        v-if="ministreStats.length"
        :total-count="totalCount"
        :stats="ministreStats"
      />
      <p v-else>{{ emptyResultMessage }}</p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { Minister } from '@prisma/client'
  import { ministerLabels } from '~/client/options/ministry'
  import { getStatLabel } from '~/client/options/stat'
  import { StatFilterInput } from '~/server/schema/filter.schema'
  import { SupportColor } from '~/client/colors/support'
  import { AlertType } from '~/utils/constants/alert'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    totalCount: number
    collection: 'helpRequests' | 'followups'
    filters: StatFilterInput
  }>()

  const {
    data: ministreCounts,
    pending,
    error
  } = useAsyncData<Array<{ ministre: Minister | null; _count: number }>>(
    `${props.collection}MinistreStats`,
    () => trpcClient.stat.getHelpRequestMinistreStats.query(props.filters),
    {
      default: () => [],
      watch: [props.filters]
    }
  )

  const ministreStats = computed(
    () =>
      ministreCounts.value?.map(({ _count, ministre }) => ({
        key: ministre,
        label: getStatLabel(ministerLabels, ministre),
        color: SupportColor[props.collection],
        count: _count
      })) || []
  )

  const emptyResultMessage = computed(() => {
    return `Commencez à créer des ${
      props.collection === 'helpRequests'
        ? "instructions de demande d'aides"
        : "synthèses d'entretien"
    } dans les fiches de bénéficiaires pour voir apparaître les statistiques de la répartition des ministres.`
  })
</script>
