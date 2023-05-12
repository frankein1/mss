<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques de la répartion des organismes prescripteurs n'ont pas pu être chargées."
    />
    <template v-else-if="prescribingOrganizationStats">
      <h2 class="fr-h5">Organismes prescripteurs</h2>
      <p>
        Pourcentage calculé sur le nombre total
        {{ collection === 'helpRequests' ? 'de demandes' : "d'entretiens" }}
      </p>
      <StatsList
        v-if="prescribingOrganizationStats.length"
        :total-count="totalCount"
        :stats="prescribingOrganizationStats"
      />
      <p v-else>{{ emptyResultMessage }}</p>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { StatFilterRawInput } from '~/server/schema'
  import { StatList } from '~/types/stat'
  import { AlertType } from '~/utils/constants/alert'
  import { STATS_NULL_LABEL } from '~/client/options/stat'
  import { SupportColor } from '~/client/colors/support'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    totalCount: number
    collection: 'helpRequests' | 'followups'
    filters: StatFilterRawInput
  }>()

  const {
    data: prescribingOrganizationCounts,
    pending,
    error
  } = useAsyncData<
    Array<{ prescribingOrganization: { id: string; name: string } | null }>
  >(
    `${props.collection}PrescribingOrganizationCounts`,
    () =>
      trpcClient.stat[
        props.collection === 'helpRequests'
          ? 'getHelpRequestPrescribingOrganizationStats'
          : 'getFollowupPrescribingOrganizationStats'
      ].query(props.filters),
    {
      default: () => [],
      watch: [props.filters]
    }
  )

  const prescribingOrganizationStats = computed(() => {
    const _prescribingOrganizationStats: { [k: string]: StatList } = {}
    prescribingOrganizationCounts.value?.forEach(historyItem => {
      const organismePrescripteurId =
        historyItem.prescribingOrganization?.id || 'null'
      if (organismePrescripteurId in _prescribingOrganizationStats) {
        _prescribingOrganizationStats[organismePrescripteurId].count++
      } else {
        _prescribingOrganizationStats[organismePrescripteurId] = {
          key: organismePrescripteurId,
          label: historyItem.prescribingOrganization?.name || STATS_NULL_LABEL,
          color: SupportColor[props.collection],
          count: 1
        }
      }
    })
    const _prescribingOrganizationStatsValues = Object.values(
      _prescribingOrganizationStats
    )
    _prescribingOrganizationStatsValues.sort((a, b) => b.count - a.count)
    return _prescribingOrganizationStatsValues
  })

  // TODO
  // async function loadFollowUpOrganismesCounts() {
  //   const res = await $getItems(props.collection, {
  //     fields: ['organisme_prescripteur.id', 'organisme_prescripteur.name'],
  //     filter: {
  //       ...props.filters
  //     }
  //   })

  //   if (res.status === 200) {
  //     const followUpOrganismesResCounts = {}
  //     res.data.data.forEach(historyItem => {
  //       const organismePrescripteurId =
  //         historyItem.organisme_prescripteur?.id || null
  //       if (organismePrescripteurId in followUpOrganismesResCounts) {
  //         followUpOrganismesResCounts[organismePrescripteurId].count++
  //       } else {
  //         followUpOrganismesResCounts[organismePrescripteurId] = {
  //           key: organismePrescripteurId,
  //           label: historyItem.organisme_prescripteur?.name || 'Non renseigné',
  //           color: SupportColor[props.collection],
  //           count: 1
  //         }
  //       }
  //     })
  //     const followUpOrganismesResCountsValues = Object.values(
  //       followUpOrganismesResCounts
  //     )
  //     followUpOrganismesResCountsValues.sort((a, b) => b.count - a.count)
  //     return followUpOrganismesResCountsValues
  //   }
  //   throw new Error(errorResponseMessage(res))
  // }

  const emptyResultMessage = computed(() => {
    return `Commencez à créer des ${
      props.collection === 'helpRequests'
        ? "instructions de demande d'aides"
        : "synthèses d'entretien"
    } dans les fiches de bénéficiaires pour voir apparaître les statistiques de la répartition des organismes prescripteurs.`
  })
</script>
