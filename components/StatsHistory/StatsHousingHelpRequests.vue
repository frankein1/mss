<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques des demandes de logement n'ont pas pu être chargées."
  />
  <template v-else-if="housingHelpRequestContextStats.length">
    <p class="fr-text--xs text--muted">
      Ces données prennent en compte uniquement les instructions de dossiers
      réalisées après le 15 février 2024 via le formulaire de demande de
      logement.
    </p>
    <StatsList
      :total-count="housingHelpRequestCount"
      :stats="housingHelpRequestContextStats"
      :not-filled-route="
        routes.file.AppHistory.path({
          notFilled: FilterFileInstructionNotFilled.HousingIsFirst,
          tab: HistoryTab.FileInstructions
        })
      "
    />
    <p class="fr-text--bold">Motif des demandes de logement</p>
    <StatsList
      :total-count="housingHelpRequestCount"
      :stats="housingHelpRequestReasonStats"
      :not-filled-route="
        routes.file.AppHistory.path({
          notFilled: FilterFileInstructionNotFilled.HousingReason,
          tab: HistoryTab.FileInstructions
        })
      "
    />
  </template>
</template>

<script lang="ts" setup>
  import { SupportColor } from '~/client/colors'
  import {
    isFirstKeys,
    housingReasonKeys,
    getStatLabel
  } from '~/client/options'
  import { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { FilterFileInstructionNotFilled } from '~/utils/constants/filters'
  import { HistoryTab } from '~/utils/constants/history'
  import { routes } from '~/utils/routes'
  import { useLoadStatisticsWithPost } from '~/composables/useLoadStatisticsWithPost'

  const props = defineProps<{
    filters: StatFilterInput
  }>()

  const { data, pending, error } = await useLoadStatisticsWithPost(
    'getHousingHelpRequestsStats',
    toRef(props.filters)
  )
  const housingHelpRequestCount = computed(
    () => data.value?.housingHelpRequestCount || 0
  )

  const housingHelpRequestContextStats = computed(
    () =>
      data.value?.housingHelpRequestContextCount.map(({ _count, isFirst }) => ({
        key: String(isFirst),
        label: getStatLabel(isFirstKeys.byKey, String(isFirst)),
        color: SupportColor.helpRequests,
        count: _count
      })) || []
  )

  const housingHelpRequestReasonStats = computed(
    () =>
      data.value?.housingHelpRequestReasonCount.map(({ _count, reason }) => ({
        key: String(reason),
        label: getStatLabel(housingReasonKeys.byKey, String(reason)),
        color: SupportColor.helpRequests,
        count: _count
      })) || []
  )
</script>
