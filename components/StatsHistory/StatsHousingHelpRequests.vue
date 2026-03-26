<template>
  <AtomLoader
    v-if="status === 'pending'"
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
      housingHelpRequestCount > 0 &&
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
        routes.file.AppHistoryFileInstructions.path({
          notFilled: FilterFileInstructionNotFilled.HousingIsFirst
        })
      "
    />
    <p class="fr-text--bold">Motif des demandes de logement</p>
    <StatsList
      :total-count="housingHelpRequestCount"
      :stats="housingHelpRequestReasonStats"
      :not-filled-route="
        routes.file.AppHistoryFileInstructions.path({
          notFilled: FilterFileInstructionNotFilled.HousingReason
        })
      "
    />
  </template>
  <p v-else>
    Commencez à créer des instructions de dossier dans les fiches de
    bénéficiaires pour voir apparaître les statistiques de la répartition des
    demande de logement.
  </p>
</template>

<script lang="ts" setup>
  import { SupportColor } from '~/client/colors'
  import {
    isFirstKeys,
    housingReasonKeys,
    getStatLabel
  } from '~/client/options'
  import type { StatFilterInput } from '~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import { FilterFileInstructionNotFilled } from '~/utils/constants/filters'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    filters: StatFilterInput
  }>()

  const trpcClient = useTrpcClient()
  const { data, error, status } =
    await trpcClient.stat.getHousingHelpRequestsStats.useQuery(
      toRef(() => props.filters)
    )

  const housingHelpRequestCount = computed(
    () => data.value?.housingHelpRequestCount || 0
  )

  const housingHelpRequestContextStats = computed(
    () =>
      data.value?.housingHelpRequestContextCount.map(({ _count, isFirst }) => ({
        key: String(isFirst),
        label: getStatLabel(isFirstKeys.byKey, String(isFirst)) as string,
        color: SupportColor.helpRequests,
        count: _count
      })) || []
  )

  const housingHelpRequestReasonStats = computed(
    () =>
      data.value?.housingHelpRequestReasonCount.map(({ _count, reason }) => ({
        key: String(reason),
        label: getStatLabel(housingReasonKeys.byKey, String(reason)) as string,
        color: SupportColor.helpRequests,
        count: _count
      })) || []
  )
</script>
