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
  <template
    v-else-if="
      housingHelpRequestContextStats &&
      housingHelpRequestCount &&
      housingHelpRequestReasonStats
    "
  >
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
  import { StatsListPropType } from '~/types/stat'
  import { AlertType } from '~/utils/constants/alert'
  import { FilterFileInstructionNotFilled } from '~/utils/constants/filters'
  import { HistoryTab } from '~/utils/constants/history'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    filters: StatFilterInput
  }>()

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const housingHelpRequestCount = ref<number | null>(null)
  const housingHelpRequestContextStats = ref<StatsListPropType | null>(null)
  const housingHelpRequestReasonStats = ref<StatsListPropType | null>(null)

  try {
    const trpc = useTrpcClient()
    const data = await trpc.stat.getHousingHelpRequestsStats.mutate(
      props.filters
    )
    if (data == null) {
      throw new Error('no data')
    }

    housingHelpRequestCount.value = data.housingHelpRequestCount || 0

    housingHelpRequestContextStats.value =
      data.housingHelpRequestContextCount.map(({ _count, isFirst }) => ({
        key: String(isFirst),
        label: getStatLabel(isFirstKeys.byKey, String(isFirst)) as string,
        color: SupportColor.helpRequests,
        count: _count
      })) || []

    housingHelpRequestReasonStats.value =
      data.housingHelpRequestReasonCount.map(({ _count, reason }) => ({
        key: String(reason),
        label: getStatLabel(housingReasonKeys.byKey, String(reason)) as string,
        color: SupportColor.helpRequests,
        count: _count
      })) || []
  } catch (err: unknown) {
    console.error(err)
    error.value = err as Error
  } finally {
    pending.value = false
  }
</script>
