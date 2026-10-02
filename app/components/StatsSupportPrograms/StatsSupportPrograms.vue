<template>
  <div>
    <!-- Filters -->
    <StatsSupportProgramFilters v-model:filters="filters" />

    <AtomLazyComponent
      :pending="status === 'pending'"
      :error="error != null"
      message="Impossible de charger les statistiques parcours et dispositifs."
    >
      <section>
        <h3 class="fr-sr-only">Résultats</h3>
        <StatsHeader
          class="fr-my-2w"
          :menus="[]"
        >
          <template #header>
            <h4 class="fr-sr-only">Nombre de bénéficiaires concernés</h4>
          </template>
          <template #icon>
            <AtomPictogram :path="userPictogram" />
          </template>
          <template #title>
            <p class="fr-mb-0 fr-h3 title-blue">
              {{ beneficiaryCountLabel }}
            </p>
          </template>
        </StatsHeader>

        <div class="fr-container--no-max">
          <div class="fr-grid-row fr-grid-row--gutters">
            <div class="fr-col-12">
              <StatsSupportProgramMeanDuration :filters="filters" />
            </div>

            <!-- Nombre d’entrées et sorties -->
            <StatsCard
              class="fr-col-12"
              :card-id="supportProgramCardConfig.entriesExits.id"
              :card-name="supportProgramCardConfig.entriesExits.name"
            >
              <StatsSupportProgramEntriesExits :filters="filters" />
            </StatsCard>

            <!-- Atteinte des objectifs -->
            <StatsCard
              class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
              :card-id="supportProgramCardConfig.outcome.id"
              :card-name="supportProgramCardConfig.outcome.name"
            >
              <StatsSupportProgramOutcome :filters="filters" />
            </StatsCard>

            <!-- Nombre de bénéficiaires par dispositif -->
            <StatsCard
              class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
              :card-id="supportProgramCardConfig.supportProgramNames.id"
              :card-name="supportProgramCardConfig.supportProgramNames.name"
              :card-subtitle="
                supportProgramCardConfig.supportProgramNames.subtitle
              "
            >
              <StatsSupportProgramNames :filters="filters" />
            </StatsCard>

            <!-- Nombre de bénéficiaires par partenaire -->
            <StatsCard
              class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
              :card-id="supportProgramCardConfig.partners.id"
              :card-name="supportProgramCardConfig.partners.name"
              :card-subtitle="supportProgramCardConfig.partners.subtitle"
            >
              <StatsSupportProgramPartners :filters="filters" />
            </StatsCard>
          </div>
        </div>
      </section>
    </AtomLazyComponent>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import type { SupportProgramStatFilterInput } from '~~/server/schema'
  import userPictogram from '@gouvfr/dsfr/dist/artwork/pictograms/digital/avatar.svg?url&no-inline'

  const trpcClient = useTrpcClient()

  const filters = ref<SupportProgramStatFilterInput>({})

  const {
    data: count,
    error,
    status
  } = await trpcClient.stat.getSupportProgramCountStats.useQuery(filters)

  const plural = (word: string, q: number, end = 's') =>
    q > 1 ? `${word}${end}` : word

  const beneficiaryCountLabel = computed(() => {
    const beneficiaryCount = count?.value?.beneficiary ?? 0
    return `${beneficiaryCount} ${plural('bénéficiaire', beneficiaryCount)} ${plural('concerné', beneficiaryCount)}`
  })

  const supportProgramCardConfig = {
    outcome: {
      id: 'stats-support-program-outcome',
      name: 'Atteinte des objectifs'
    },
    partners: {
      id: 'stats-support-program-partners',
      name: 'Nombre de bénéficiaires par partenaire',
      subtitle: 'Un bénéficiaire peut être compté pour plusieurs partenaires.'
    },
    entriesExits: {
      id: 'stats-support-program-entries-exits',
      name: 'Nombre d’entrées et sorties'
    },
    supportProgramNames: {
      id: 'stats-support-program-names',
      name: 'Nombre de bénéficiaires par dispositif',
      subtitle: 'Un bénéficiaire peut être compté pour plusieurs dispositifs.'
    }
  }
</script>
