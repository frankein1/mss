<template>
  <AtomLoader
    v-if="pending"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    :message="`Les statistiques de la répartition des montants accordés par organisme instructeur n'ont pas pu être chargées.`"
  />
  <template v-else-if="stats && stats.length">
    <p class="fr-text--xs text--muted">
      Calcul sur l'ensemble des aides financières instruites en externe
    </p>
    <StatsList
      :stats
      :to-fixed="2"
      with-sub-count
      stats-bar
      :stats-percentage="false"
      :sub-count-label="helpRequestFieldLabels.askedAmount"
      unit="€"
      :not-filled-route
    />
  </template>
  <p v-else>
    Aucune demande d'aide financière accordée n'a été enregistrée pour le
    moment.
  </p>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import type { StatFilterInput } from '~/server/schema'
  import { SupportColor } from '~/client/colors'
  import { FilterFileInstructionNotFilled } from '~/utils/constants/filters'
  import { HistoryTab } from '~/utils/constants/history'
  import { routes } from '~/utils/routes'
  import { helpRequestFieldLabels } from '~/client/labels'
  import type { StatsListPropType } from '~/types/stat'

  const props = defineProps<{ filters: StatFilterInput }>()

  const notFilledRoute = routes.file.AppHistory.path({
    notFilled: FilterFileInstructionNotFilled.InstructorOrganization,
    tab: HistoryTab.FileInstructions
  })

  const pending = ref<boolean>(true)
  const error = ref<Error | null>(null)
  const stats = ref<StatsListPropType | null>(null)

  try {
    const trpc = useTrpcClient()
    const amounts =
      await trpc.stat.getHelpRequestAmountsByInstructorOrganization.mutate(
        props.filters
      )
    if (amounts == null) {
      throw new Error('no data')
    }
    stats.value = (amounts || []).map(amount => ({
      ...amount,
      color: SupportColor.helpRequests
    }))
  } catch (err: unknown) {
    console.error(err)
    error.value = err as Error
  } finally {
    pending.value = false
  }
</script>
