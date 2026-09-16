<template>
  <section class="fr-grid-row fr-grid-row--gutters">
    <h3 class="fr-sr-only">Entretiens</h3>

    <AtomAlert
      v-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques d'entretiens n'ont pas pu être chargées."
    />

    <div class="fr-col-12">
      <div class="feature-section fr-p-3w overview">
        <div class="overview__item">
          <span class="fr-h2 title-blue fr-mb-0">{{
            format(data?.count)
          }}</span>
          <span class="fr-text--sm">{{
            plural('entretien', data?.count)
          }}</span>
        </div>
        <div class="overview__item">
          <span class="fr-h2 title-blue fr-mb-0">{{
            format(data?.beneficiaries)
          }}</span>
          <span class="fr-text--sm">
            {{ plural('bénéficiaire', data?.beneficiaries) }}
            {{ (data?.beneficiaries ?? 0) > 1 ? 'concernés' : 'concerné' }}
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
      card-id="stats-decideur-followup-subject"
      card-name="Objets d’accompagnement"
      card-subtitle="Intitulés regroupés sur l’ensemble des structures."
    >
      <StatsDecisionMakerDistribution
        :stats="subjectStats"
        :pending="status === 'pending'"
        :error="Boolean(error)"
        error-message="La répartition par objet n'a pas pu être chargée."
      />
    </StatsCard>

    <StatsCard
      class="fr-col-12 fr-col-lg-6"
      card-id="stats-decideur-followup-medium"
      card-name="Types d’entretien"
    >
      <StatsDecisionMakerDistribution
        :stats="mediumStats"
        :pending="status === 'pending'"
        :error="Boolean(error)"
        error-message="La répartition par type n'a pas pu être chargée."
        pie-label="Types d’entretien"
      />
    </StatsCard>
  </section>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~~/server/schema'
  import { followupMediumKeys } from '~~/client/options'
  import { ChartColor } from '~/utils/color/chartColors'
  import { STATS_NULL_KEY, STATS_NULL_LABEL } from '~/utils/constants/stats'
  import type { StatsListPropType, StatsPiePropType } from '~~/types/stat'
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{
    filters: StatFilterInput
    structureCount: number
  }>()

  const MEDIUM_COLORS = [
    ChartColor.LightBlue,
    ChartColor.Yellow,
    ChartColor.Peach,
    ChartColor.Green,
    ChartColor.Pink,
    ChartColor.DeepBlue,
    ChartColor.LightPink
  ]

  const trpcClient = useTrpcClient()

  const { data, error, status } =
    await trpcClient.decisionMaker.getFollowupStats.useQuery(
      toRef(() => props.filters)
    )

  const subjectStats: ComputedRef<StatsListPropType> = computed(
    () =>
      data.value?.subjects.map(({ name, count }) => ({
        key: name,
        label: name,
        count
      })) ?? []
  )

  const mediumStats: ComputedRef<StatsPiePropType> = computed(
    () =>
      data.value?.mediums.map(({ medium, _count }, index) => ({
        key: medium ?? STATS_NULL_KEY,
        label: medium
          ? (followupMediumKeys.value(medium) ?? STATS_NULL_LABEL)
          : STATS_NULL_LABEL,
        color: MEDIUM_COLORS[index % MEDIUM_COLORS.length] ?? ChartColor.Gray,
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
