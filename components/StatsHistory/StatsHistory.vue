<template>
  <div class="fr-grid-row fr-grid-row--gutters fr-px-2w">
    <div class="fr-col-12">
      <StatsFilters
        :followup-type-options="followupTypeOptions"
        :beneficiaries-cities-options="beneficiariesCitiesOptions"
        :agent-options="agentOptions"
        id-prefix="history"
        @filter="filters = $event"
      />
    </div>
    <h2 class="fr-col-12 stats-main-title">
      {{ historyCountLabel }}
    </h2>
    <div class="fr-tabs">
      <ul
        class="fr-tabs__list"
        :class="{ 'interviews-tab-active': isFollowupsTabActive }"
        role="tablist"
        aria-label="Accompagnements"
      >
        <li role="presentation">
          <button
            id="help-requests-tab"
            class="fr-tabs__tab"
            tabindex="0"
            role="tab"
            aria-selected="true"
            aria-controls="help-requests-panel"
            @click="isFollowupsTabActive = false"
          >
            {{ helpRequestCountLabel }}
          </button>
        </li>
        <li role="presentation">
          <button
            id="interviews-tab"
            class="fr-tabs__tab"
            tabindex="0"
            role="tab"
            aria-selected="false"
            aria-controls="interviews-panel"
            @click="isFollowupsTabActive = true"
          >
            {{ followupCountLabel }}
            <span>{{ firstFollowupCountLabel }}</span>
          </button>
        </li>
      </ul>

      <div
        id="help-requests-panel"
        class="fr-tabs__panel fr-tabs__panel--selected fr-px-0"
        role="tabpanel"
        aria-labelledby="help-requests-tab"
        tabindex="0"
      >
        <AtomAlert
          v-if="error"
          :alert-type="AlertType.Error"
          message="Le nombre total de demandes d'aide n'a pas pu être chargé."
        />
        <AtomLoader
          v-if="pending"
          class="fr-mx-auto"
        />
        <div
          v-else-if="helpRequestCount"
          class="fr-grid-row fr-grid-row--gutters fr-px-2w"
        >
          <div class="fr-col-12 fr-col-lg-6">
            <StatsHistorySupportType
              :total-count="helpRequestCount"
              collection="helpRequests"
              :filters="filters"
            />
          </div>
          <div
            v-if="isMinistryAgent"
            class="fr-col-12 fr-col-lg-6"
          >
            <StatsHistoryMinistre
              :total-count="helpRequestCount"
              collection="helpRequests"
              :filters="filters"
            />
          </div>
          <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
            <StatsHistoryHelpRequestStatus
              :total-count="helpRequestCount"
              collection="helpRequests"
              :filters="filters"
            />
          </div>
          <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
            <StatsHistoryPrescribingOrganizations
              :total-count="helpRequestCount"
              collection="helpRequests"
              :filters="filters"
            />
          </div>
          <div class="fr-col-12 fr-col-sm-6">
            <StatsHistoryFinancialHelpRequests :filters="filters" />
          </div>
          <!-- TODO: implement "organismes instructeurs" then those statistics
          <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
            <StatsOrganismesInstructeurs :filters="helpRequestFilters" />
          </div> -->
        </div>
      </div>
      <div
        id="interviews-panel"
        class="fr-tabs__panel fr-tabs__panel--selected fr-px-0"
        role="tabpanel"
        aria-labelledby="interviews-tab"
        tabindex="0"
      >
        <AtomAlert
          v-if="error"
          :alert-type="AlertType.Error"
          message="Le nombre total de synthèses d'entretien n'a pas pu être chargé."
        />
        <AtomLoader
          v-if="pending"
          class="fr-mx-auto"
        />
        <div
          v-else-if="followupCount"
          class="fr-grid-row fr-grid-row--gutters fr-px-2w"
        >
          <div class="fr-col-12 fr-col-lg-6">
            <StatsHistorySupportType
              :total-count="followupCount"
              collection="followups"
              :filters="filters"
            />
          </div>
          <div class="fr-col-12 fr-col-lg-6">
            <StatsHistoryFollowupMedium
              :total-count="followupCount"
              :filters="filters"
            />
          </div>
          <div
            v-if="isMinistryAgent"
            class="fr-col-12 fr-col-lg-6"
          >
            <StatsHistoryMinistre
              :total-count="followupCount"
              collection="followups"
              :filters="filters"
            />
          </div>
          <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
            <StatsHistoryFollowupStatus
              :total-count="followupCount"
              :filters="filters"
            />
          </div>
          <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
            <StatsHistoryFollowupActionsEntreprises
              :total-count="followupCount"
              :filters="filters"
            />
          </div>
          <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
            <StatsHistoryPrescribingOrganizations
              :total-count="followupCount"
              collection="followups"
              :filters="filters"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~~/utils/constants/alert'
  import { StatFilterRawInput } from '~/server/schema'
  import { Options } from '~/utils/options'

  const trpcClient = useTrpcClient()

  const isMinistryAgent = useMinistryAgent()

  withDefaults(
    defineProps<{
      followupTypeOptions?: Options
      beneficiariesCitiesOptions?: Options
      agentOptions?: Options
    }>(),
    {
      followupTypeOptions: () => new Map<string, string>(),
      beneficiariesCitiesOptions: () => new Map<string, string>(),
      agentOptions: () => new Map<string, string>()
    }
  )

  const filters = ref<StatFilterRawInput>({})
  const isFollowupsTabActive = ref<boolean>(false)

  const {
    data: historyCounts,
    pending,
    error
  } = useAsyncData(
    () => trpcClient.stat.getHistoryCounts.query(filters.value),
    {
      default: () => ({ helpRequests: 0, followups: 0, firstFollowups: 0 }),
      watch: [filters]
    }
  )

  const helpRequestCount = computed(
    () => historyCounts.value?.helpRequests || 0
  )

  const followupCount = computed(() => historyCounts.value?.followups || 0)

  const totalHistoryCount = computed(
    () => helpRequestCount.value + followupCount.value
  )

  const historyCountLabel = computed(
    () =>
      `${totalHistoryCount.value} ${
        totalHistoryCount.value > 1 ? 'Accompagnements' : 'Accompagnement'
      }`
  )

  const helpRequestCountLabel = computed(
    () =>
      `${helpRequestCount.value} ${
        helpRequestCount.value > 1 ? "Demandes d'aide" : "Demande d'aide"
      }`
  )

  const followupCountLabel = computed(
    () =>
      `${followupCount.value} ${
        followupCount.value > 1 ? 'Entretiens' : 'Entretien'
      }`
  )

  const firstFollowupCountLabel = computed(
    () =>
      `${historyCounts.value?.firstFollowups || 0} ${
        historyCounts.value?.firstFollowups || 0 > 1
          ? 'Premiers entretiens'
          : 'Premier entretien'
      }`
  )
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .fr-tabs {
    box-shadow: none;
  }

  .fr-tabs__list {
    column-gap: 0.5rem;
    border-bottom: 3px solid var(--primary);

    &.interviews-tab-active {
      border-bottom: 3px solid var(--color-interview);
    }
  }

  #help-requests-tab,
  #interviews-tab {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: 7px 7px 0 0;
    border-bottom: none;

    &[aria-selected='true'] {
      color: #fff;
    }
  }

  #help-requests-tab {
    color: var(--color-help-request);
    background-color: var(--color-help-request-light);

    &:hover {
      background-color: var(--color-help-request-light-hover);
    }

    &[aria-selected='true'] {
      background-color: var(--color-help-request);

      &:hover {
        background-color: var(--color-help-request-hover);
      }
    }
  }

  #interviews-tab {
    color: var(--color-interview);
    background-color: var(--color-interview-light);

    span {
      font-size: 1rem;
    }

    &:hover {
      background-color: var(--color-interview-light-hover);
    }

    &[aria-selected='true'] {
      background-color: var(--color-interview);

      &:hover {
        background-color: var(--color-interview-hover);
      }
    }
  }
</style>
