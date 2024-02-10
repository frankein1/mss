<template>
  <div class="main-container fr-p-2w">
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <AtomAlert
      v-else-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques des demandes de logement n'ont pas pu être chargées."
    />
    <template v-else-if="data">
      <h2 class="fr-h5">Demandes de logement</h2>
      <p>
        Ces données prennent en compte uniquement les instructions de dossiers
        réalisées après le 31 décembre 2023 via le formulaire de demande de
        logement.
      </p>
      <StatsList
        :total-count="housingHelpRequestCount"
        :stats="housingHelpRequestContextStats"
      />
      <p class="fr-text--bold">Motif des demandes de logement</p>
      <StatsList
        :total-count="housingHelpRequestCount"
        :stats="housingHelpRequestReasonStats"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { SupportColor } from '~/client/colors'
  import { isFirstLabels, fileInstructionReasonLabels } from '~/client/options'
  import { getStatLabel } from '~/client/options/stat'
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'

  const trpcClient = useTrpcClient()

  const props = defineProps<{
    filters: StatFilterInput
  }>()

  const { data, pending, error } =
    await trpcClient.stat.getHousingHelpRequestsStats.useQuery(props.filters)

  const housingHelpRequestCount = computed(
    () => data.value?.housingHelpRequestCount || 0
  )

  const housingHelpRequestContextStats = computed(
    () =>
      data.value?.housingHelpRequestContextCount.map(({ _count, isFirst }) => ({
        key: String(isFirst),
        label: getStatLabel(isFirstLabels, String(isFirst)),
        color: SupportColor.helpRequests,
        count: _count
      })) || []
  )

  const housingHelpRequestReasonStats = computed(
    () =>
      data.value?.housingHelpRequestReasonCount.map(({ _count, reason }) => ({
        key: String(reason),
        label: getStatLabel(fileInstructionReasonLabels, String(reason)),
        color: SupportColor.helpRequests,
        count: _count
      })) || []
  )
</script>
