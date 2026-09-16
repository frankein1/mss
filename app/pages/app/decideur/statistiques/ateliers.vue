<template>
  <section class="fr-grid-row fr-grid-row--gutters">
    <h3 class="fr-sr-only">Ateliers</h3>

    <AtomAlert
      v-if="error"
      :alert-type="AlertType.Error"
      message="Les statistiques d'ateliers n'ont pas pu être chargées."
    />

    <div class="fr-col-12">
      <div class="feature-section fr-p-3w overview">
        <div class="overview__item">
          <span class="fr-h2 title-blue fr-mb-0">{{
            format(data?.workshops)
          }}</span>
          <span class="fr-text--sm">
            {{ plural('atelier', data?.workshops) }}
          </span>
        </div>
        <div class="overview__item">
          <span class="fr-h2 title-blue fr-mb-0">{{
            format(data?.attendees)
          }}</span>
          <span class="fr-text--sm">
            {{ plural('participation', data?.attendees) }}
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
      card-id="stats-decideur-workshop-name"
      card-name="Ateliers par thématique"
    >
      <StatsDecisionMakerDistribution
        :stats="nameStats"
        :pending="status === 'pending'"
        :error="Boolean(error)"
        error-message="La répartition des ateliers n'a pas pu être chargée."
      />
    </StatsCard>
  </section>
</template>

<script lang="ts" setup>
  import type { StatFilterInput } from '~~/server/schema'
  import type { StatsListPropType } from '~~/types/stat'
  import { AlertType } from '~/utils/constants/alert'

  const props = defineProps<{
    filters: StatFilterInput
    structureCount: number
  }>()

  const trpcClient = useTrpcClient()

  const { data, error, status } =
    await trpcClient.decisionMaker.getWorkshopStats.useQuery(
      toRef(() => props.filters)
    )

  const nameStats: ComputedRef<StatsListPropType> = computed(
    () =>
      data.value?.byName.map(({ name, count }) => ({
        key: name,
        label: name,
        count
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
