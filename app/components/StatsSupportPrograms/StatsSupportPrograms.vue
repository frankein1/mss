<template>
  <div>
    <!-- Filters -->

    <StatsSupportProgramFilters v-model:filters="filters" />

    <section>
      <h3 class="fr-sr-only">Résultats</h3>
      <StatsHeader
        class="fr-my-2w"
        :menus="[]"
      >
        <template #header>
          <h4 class="fr-sr-only">Nombre de dispositifs</h4>
        </template>
        <template #icon>
          <AtomPictogram :path="signDocumentPictogram" />
        </template>
        <template #title>
          <p class="fr-mb-0 fr-h3 title-blue">
            {{ supportProgramCountLabel }}
          </p>
        </template>
      </StatsHeader>
      <AtomAlert
        v-if="error"
        :alert-type="AlertType.Error"
        message="Le nombre de dispositifs n'a pas pu être chargé."
      />

      <div class="fr-container--no-max">
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12">
            <StatsSupportProgramBeneficiaryNumber
              :beneficiary-total-count="count?.beneficiary ?? 0"
            />
          </div>

          <div class="fr-col-12">
            <StatsSupportProgramMeanDuration :filters="filters" />
          </div>

          <StatsCard
            class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
            :card-id="supportProgramCardConfig.outcome.id"
            :card-name="supportProgramCardConfig.outcome.name"
          >
            <StatsSupportProgramOutcome :filters="filters" />
          </StatsCard>

          <StatsCard
            class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
            :card-id="supportProgramCardConfig.partners.id"
            :card-name="supportProgramCardConfig.partners.name"
            :card-subtitle="supportProgramCardConfig.partners.subtitle"
          >
            <StatsSupportProgramPartners :filters="filters" />
          </StatsCard>

          <StatsCard
            class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
            :card-id="supportProgramCardConfig.entriesExits.id"
            :card-name="supportProgramCardConfig.entriesExits.name"
          >
            <StatsSupportProgramEntriesExits :filters="filters" />
          </StatsCard>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import type { SupportProgramStatFilterInput } from '~~/server/schema'
  import signDocumentPictogram from '@gouvfr/dsfr/dist/artwork/pictograms/document/sign-document.svg?url&no-inline'

  const trpcClient = useTrpcClient()

  const filters = ref<SupportProgramStatFilterInput>({})

  const { data: count, error } =
    await trpcClient.stat.getSupportProgramCountStats.useQuery(filters)

  const plural = (word: string, q: number, end = 's') =>
    q > 1 ? `${word}${end}` : word

  const supportProgramCountLabel = computed(() => {
    const supportProgramCount = count.value?.supportProgram ?? 0
    return `${supportProgramCount} ${plural('dispositif', supportProgramCount)}`
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
    }
  }
</script>
