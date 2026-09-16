<template>
  <section class="fr-grid-row fr-grid-row--gutters">
    <h3 class="fr-sr-only">Instructions de dossiers</h3>

    <AtomAlert
      v-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques d'instructions n'ont pas pu être chargées."
    />

    <div class="fr-col-12">
      <div class="feature-section fr-p-3w overview">
        <div class="overview__item">
          <span class="fr-h2 title-blue fr-mb-0">{{
            format(data?.count.total)
          }}</span>
          <span class="fr-text--sm">
            {{ plural('instruction', data?.count.total) }}
          </span>
        </div>
        <div class="overview__item">
          <span class="fr-h2 title-blue fr-mb-0">{{
            format(data?.count.external)
          }}</span>
          <span class="fr-text--sm">
            {{ plural('instruction', data?.count.external) }}
            {{ (data?.count.external ?? 0) > 1 ? 'externes' : 'externe' }}
          </span>
        </div>
        <div class="overview__item">
          <span class="fr-h2 title-blue fr-mb-0">{{
            concernedStructures
          }}</span>
          <span class="fr-text--sm">
            {{ plural('structure', concernedStructures) }}
            {{ concernedStructures > 1 ? 'concernées' : 'concernée' }}
          </span>
        </div>
      </div>
    </div>

    <StatsCard
      class="fr-col-12 fr-col-lg-6"
      card-id="stats-decideur-instruction-type"
      card-name="Thématiques d’instruction"
    >
      <StatsDecisionMakerDistribution
        :stats="typeStats"
        :pending="status === 'pending'"
        :error="Boolean(error)"
        error-message="La répartition par thématique n'a pas pu être chargée."
        pie-label="Répartition par thématique"
      />
    </StatsCard>

    <StatsCard
      class="fr-col-12 fr-col-lg-6"
      card-id="stats-decideur-instruction-status"
      card-name="Statuts"
    >
      <StatsDecisionMakerDistribution
        :stats="statusStats"
        :pending="status === 'pending'"
        :error="Boolean(error)"
        error-message="La répartition par statut n'a pas pu être chargée."
      />
    </StatsCard>
  </section>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~~/server/schema'
  import {
    fileInstructionTypeKeys,
    socialSupportStatusKeys,
    getStatLabel
  } from '~~/client/options'
  import { getStatColor } from '~~/client/colors/stats'
  import { ChartColor } from '~/utils/color/chartColors'
  import { STATS_NULL_KEY, STATS_NULL_LABEL } from '~/utils/constants/stats'
  import type { StatsListPropType, StatsPiePropType } from '~~/types/stat'
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{
    filters: StatFilterInput
    structureCount: number
  }>()

  const TypeColor: Record<string, string> = {
    Housing: ChartColor.LightBlue,
    Financial: ChartColor.Yellow,
    Other: ChartColor.Peach
  }

  const trpcClient = useTrpcClient()

  const { data, error, status } =
    await trpcClient.decisionMaker.getFileInstructionStats.useQuery(
      toRef(() => props.filters)
    )

  const typeStats: ComputedRef<StatsPiePropType> = computed(
    () =>
      data.value?.types.map(({ subject, _count }) => ({
        key: subject,
        label: getStatLabel(fileInstructionTypeKeys.byKey, subject),
        color: getStatColor(TypeColor, subject),
        count: _count
      })) ?? []
  )

  const statusStats: ComputedRef<StatsListPropType> = computed(
    () =>
      data.value?.statuses.map(({ status: supportStatus, _count }) => ({
        key: supportStatus ?? STATS_NULL_KEY,
        label: socialSupportStatusKeys.value(supportStatus) ?? STATS_NULL_LABEL,
        count: _count
      })) ?? []
  )

  /** Structures contribuant réellement aux chiffres, filtres compris.
   *  Repli sur la taille du périmètre pendant le chargement. */
  const concernedStructures = computed(
    () => data.value?.structureCount ?? props.structureCount
  )

  function format(quantity?: number) {
    return quantity === undefined ? '—' : quantity.toLocaleString('fr-FR')
  }

  function plural(word: string, quantity?: number, end = 's') {
    return quantity && quantity > 1 ? `${word}${end}` : word
  }
</script>

<style scoped lang="scss">
  .overview {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem 4rem;
  }

  .overview__item {
    display: flex;
    flex-direction: column;
  }
</style>
