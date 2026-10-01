<template>
  <AtomLoader
    v-if="status === 'pending'"
    class="fr-mx-auto"
  />
  <AtomAlert
    v-else-if="error"
    :alert-type="AlertType.Error"
    message="Les statistiques d’atteinte des objectifs n’ont pas pu être chargées."
  />
  <StatsPie
    v-else-if="outcomeStats.length"
    :stats="outcomeStats"
    pie-label="Nb. dispositifs"
  />
  <p v-else>Aucun dispositif ne correspond aux filtres sélectionnés.</p>
</template>

<script lang="ts" setup>
  import { SupportProgramOutcome } from '@prisma/client'
  import type { SupportProgramStatFilterInput } from '~~/server/schema'
  import { AlertType } from '~/utils/constants/alert'
  import type { StatsPiePropType } from '~~/types/stat'
  import { getStatColor } from '~~/client/colors'
  import { getStatLabel, supportProgramOutcomeKeys } from '~~/client/options'
  import { ChartColor } from '~/utils/color/chartColors'
  import { STATS_NULL_KEY } from '~/utils/constants/stats'

  const OutcomeColor = {
    [SupportProgramOutcome.NotAchieved]: ChartColor.Peach,
    [SupportProgramOutcome.PartiallyAchieved]: ChartColor.Yellow,
    [SupportProgramOutcome.SubjectToConditions]: ChartColor.LightBlue,
    [SupportProgramOutcome.Achieved]: ChartColor.Green,
    [SupportProgramOutcome.Exceeded]: ChartColor.GreenArchipel
  }

  const props = defineProps<{
    filters: SupportProgramStatFilterInput
  }>()
  const trpc = useTrpcClient()

  const { data, status, error } =
    await trpc.stat.getSupportProgramOutcomeStats.useQuery(
      toRef(() => props.filters)
    )

  const outcomeStats: Ref<StatsPiePropType> = computed(
    () =>
      data.value?.map(({ outcome, _count }) => ({
        key: outcome ?? STATS_NULL_KEY,
        label: getStatLabel(supportProgramOutcomeKeys.byKey, outcome),
        color: getStatColor(OutcomeColor, outcome),
        count: _count
      })) ?? []
  )
</script>
