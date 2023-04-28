<template>
  <div class="fr-grid-row fr-grid-row--gutters fr-px-2w">
    <div class="fr-col-12">
      <StatsFilters
        :follow-up-type-options="followUpTypeOptions"
        :beneficiaries-cities-options="beneficiariesCitiesOptions"
        :agent-options="agentOptions"
        id-prefix="beneficiaries"
        @filter="filters = $event"
      />
    </div>
    <h2 class="fr-col-12 stats-main-title">
      {{ beneficiaryCountLabel }}
    </h2>
    <AtomAlert
      v-if="error"
      :alert-type="AlertType.Error"
      message="Le nombre total de bénéficiaires n'a pas pu être chargé."
    />
    <AtomLoader
      v-if="pending"
      class="fr-mx-auto"
    />
    <template v-else-if="beneficiaryCount">
      <div class="fr-col-12 fr-col-md-6 fr-col-xl-3">
        <StatsGender
          :beneficiary-count="beneficiaryCount"
          :filters="filters"
        />
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-col-xl-3">
        <StatsAgeGroups
          :beneficiary-count="beneficiaryCount"
          :filters="filters"
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <StatsFamilySituations
          :beneficiary-count="beneficiaryCount"
          :filters="filters"
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
        <StatsRegions
          :beneficiary-count="beneficiaryCount"
          :filters="filters"
        />
      </div>
      <!-- <div
        v-if="isMinistryAgent"
        class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
      >
        <StatsAccommodationZone
          :beneficiary-count="beneficiaryCount"
          :filters="filters"
        />
      </div> -->
      <div
        v-if="isMinistryAgent"
        class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
      >
        <StatsAccommodationMode
          :beneficiary-count="beneficiaryCount"
          :filters="filters"
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
        <StatsMobility
          :beneficiary-count="beneficiaryCount"
          :filters="filters"
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
        <StatsCSP
          :beneficiary-count="beneficiaryCount"
          :filters="filters"
        />
      </div>
      <!-- 
      <template v-if="isMinistryAgent">
        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsMinistereStructure
            :beneficiary-count="beneficiaryCount"
            :filters="filters"
          />
        </div>
        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsMinistereDepartementService
            :beneficiary-count="beneficiaryCount"
            :filters="filters"
          />
        </div>
        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsMinistereCategorie
            :beneficiary-count="beneficiaryCount"
            :filters="filters"
          />
        </div>
      </template> -->
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~~/utils/constants/alert'
  import { Options } from '~/utils/options'
  import { StatFilterInput } from '~/server/schema/filter.schema'

  const trpcClient = useTrpcClient()
  const isMinistryAgent = useMinistryAgent()

  withDefaults(
    defineProps<{
      followUpTypeOptions?: Options
      beneficiariesCitiesOptions?: Options
      agentOptions?: Options
    }>(),
    {
      followUpTypeOptions: () => new Map<string, string>(),
      beneficiariesCitiesOptions: () => new Map<string, string>(),
      agentOptions: () => new Map<string, string>()
    }
  )

  const filters = ref<StatFilterInput>({})

  const {
    data: beneficiaryCount,
    pending,
    error
  } = useAsyncData(
    () => trpcClient.stat.getBeneficiaryCount.query(filters.value),
    {
      default: () => 0,
      watch: [filters]
    }
  )

  const beneficiaryCountLabel = computed(
    () =>
      `${beneficiaryCount.value || 0} ${
        beneficiaryCount.value || 0 > 1 ? 'Bénéficiaires' : 'Bénéficiaire'
      }`
  )
</script>
