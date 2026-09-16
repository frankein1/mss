<template>
  <section class="fr-grid-row fr-grid-row--gutters">
    <h3 class="fr-sr-only">Bénéficiaires</h3>

    <AtomAlert
      v-if="overviewError"
      :alert-type="AlertType.Error"
      message="Les chiffres n'ont pas pu être chargés."
    />

    <div class="fr-col-12">
      <StatsDecisionMakerOverview
        :beneficiaries="overview?.beneficiaries"
        :new-beneficiaries="overview?.newBeneficiaries"
        :files="overview?.files"
        :family-files="overview?.familyFiles"
        :structure-count="overview?.structureCount ?? structureCount"
      />
    </div>

    <StatsCard
      class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
      card-id="stats-decideur-gender"
      card-name="Genres"
    >
      <StatsDecisionMakerDistribution
        :stats="genderStats"
        :pending="distributionStatus === 'pending'"
        :error="Boolean(distributionError)"
        error-message="La répartition des genres n'a pas pu être chargée."
        pie-label="Répartition des genres"
      />
    </StatsCard>

    <StatsCard
      class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
      card-id="stats-decideur-age"
      card-name="Tranches d’âge"
    >
      <StatsDecisionMakerDistribution
        :stats="ageStats"
        :pending="distributionStatus === 'pending'"
        :error="Boolean(distributionError)"
        error-message="La répartition par âge n'a pas pu être chargée."
        pie-label="Répartition par âge"
      />
    </StatsCard>

    <StatsCard
      class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
      card-id="stats-decideur-city"
      card-name="Villes"
      card-subtitle="Ville renseignée dans l’adresse du bénéficiaire."
    >
      <StatsDecisionMakerDistribution
        :stats="cityStats"
        :pending="distributionStatus === 'pending'"
        :error="Boolean(distributionError)"
        error-message="La répartition par ville n'a pas pu être chargée."
      />
    </StatsCard>
  </section>
</template>

<script lang="ts" setup>
  import { Gender } from '@prisma/client'
  import type { StatFilterInput } from '~~/server/schema'
  import {
    AgeGroup,
    ageGroupKeys,
    beneficiaryGenderKeys,
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

  const GenderColor = {
    [Gender.Female]: ChartColor.Peach,
    [Gender.Male]: ChartColor.LightBlue,
    [Gender.Other]: ChartColor.Yellow
  }

  const AgeGroupColor = {
    [AgeGroup.Less18]: ChartColor.LightPink,
    [AgeGroup.Group18_24]: ChartColor.Peach,
    [AgeGroup.Group25_34]: ChartColor.LightBlue,
    [AgeGroup.Group35_44]: ChartColor.Yellow,
    [AgeGroup.Group45_54]: ChartColor.Pink,
    [AgeGroup.Group55_64]: ChartColor.DeepBlue,
    [AgeGroup.More65]: ChartColor.Green,
    [AgeGroup.Custom]: ChartColor.Gray
  }

  const trpcClient = useTrpcClient()
  const filters = toRef(() => props.filters)

  const { data: overview, error: overviewError } =
    await trpcClient.decisionMaker.getOverviewStats.useQuery(filters)

  const {
    data: distribution,
    error: distributionError,
    status: distributionStatus
  } = await trpcClient.decisionMaker.getDistributionStats.useQuery(filters)

  const genderStats: ComputedRef<StatsPiePropType> = computed(
    () =>
      distribution.value?.gender.map(({ gender, _count }) => ({
        key: gender ?? STATS_NULL_KEY,
        label: getStatLabel(beneficiaryGenderKeys.byKey, gender),
        color: getStatColor(GenderColor, gender),
        count: _count
      })) ?? []
  )

  const ageStats: ComputedRef<StatsPiePropType> = computed(
    () =>
      distribution.value?.age.map(({ ageGroup, _count }) => ({
        key: ageGroup ?? STATS_NULL_KEY,
        label: getStatLabel(ageGroupKeys.byKey, ageGroup),
        color: getStatColor(AgeGroupColor, ageGroup),
        count: _count
      })) ?? []
  )

  const cityStats: ComputedRef<StatsListPropType> = computed(
    () =>
      distribution.value?.city.map(({ city, _count }) => ({
        key: city ?? STATS_NULL_KEY,
        label: city ?? STATS_NULL_LABEL,
        count: _count
      })) ?? []
  )
</script>
