<template>
  <div class="fr-grid-row fr-grid-row--gutters fr-px-2w">
    <div class="fr-col-12">
      <StatsFilters
        :followup-type-options="followupTypeOptions"
        :beneficiaries-cities-options="beneficiariesCitiesOptions"
        :agent-options="agentOptions"
        @filter="filters = $event"
      />
    </div>
    <div class="fr-col-12 results-container">
      <h2 class="stats-main-title results-count">
        {{ historyCountLabel }}
      </h2>
      <ExportDataButton
        v-if="canExportStats(authStore.getAuthUser)"
        :is-downloading="isDownloading"
        stats
        @export="exportStats"
      />
    </div>
    <div class="fr-tabs">
      <ul
        class="fr-tabs__list"
        :class="{ 'followups-tab-active': isFollowupsTabActive }"
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
            id="followups-tab"
            class="fr-tabs__tab"
            tabindex="0"
            role="tab"
            aria-selected="false"
            aria-controls="followups-panel"
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
            <StatsHelpRequestFollowupTypes
              :total-count="helpRequestCount"
              :filters="filters"
            />
          </div>
          <div
            v-if="isMinistryAgent"
            class="fr-col-12 fr-col-lg-6"
          >
            <StatsHelpRequestMinistre
              :total-count="helpRequestCount"
              :filters="filters"
            />
          </div>
          <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
            <StatsHelpRequestStatus
              :total-count="helpRequestCount"
              :filters="filters"
            />
          </div>
          <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
            <StatsHelpRequestPrescribingOrganizations
              :total-count="helpRequestCount"
              :filters="filters"
            />
          </div>
          <div class="fr-col-12 fr-col-sm-6">
            <StatsFinancialHelpRequests :filters="filters" />
          </div>
          <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
            <StatsHistoryInstructorOrganizations
              :total-count="helpRequestCount"
              :filters="filters"
            />
          </div>
        </div>
      </div>
      <div
        id="followups-panel"
        class="fr-tabs__panel fr-tabs__panel--selected fr-px-0"
        role="tabpanel"
        aria-labelledby="followups-tab"
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
            <StatsFollowupFollowupTypes
              :total-count="followupCount"
              :filters="filters"
            />
          </div>
          <div class="fr-col-12 fr-col-lg-6">
            <StatsFollowupMedium
              :total-count="followupCount"
              :filters="filters"
            />
          </div>
          <div
            v-if="isMinistryAgent"
            class="fr-col-12 fr-col-lg-6"
          >
            <StatsFollowupMinistre
              :total-count="followupCount"
              :filters="filters"
            />
          </div>
          <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
            <StatsFollowupStatus
              :total-count="followupCount"
              :filters="filters"
            />
          </div>
          <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
            <StatsFollowupActionsEntreprises
              :total-count="followupCount"
              :filters="filters"
            />
          </div>
          <div class="fr-col-12 fr-col-sm-6 fr-col-lg-3">
            <StatsFollowupPrescribingOrganizations
              :total-count="followupCount"
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
  import { StatFilterInput } from '~/server/schema'
  import { canExportStats } from '~/server/security/rules'
  import { useAuthStore } from '~/store/auth'
  import { Options } from '~/utils/options'
  import { FAILED_DOWNLOAD_ERROR_MESSAGE } from '~/utils/constants'
  import { getExportUrl } from '~/utils/export/getExportUrl'
  import { getExportFilename } from '~/utils/export/getExportFilename'

  const trpcClient = useTrpcClient()

  const isMinistryAgent = useMinistryAgent()
  const authStore = useAuthStore()

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

  const isDownloading = ref(false)
  const filters = ref<StatFilterInput>({})
  const isFollowupsTabActive = ref<boolean>(false)

  const {
    data: historyCounts,
    pending,
    error
  } = await trpcClient.stat.getHistoryCounts.useQuery(filters)

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

  async function exportStats() {
    isDownloading.value = true
    try {
      const exportedFile = isFollowupsTabActive.value
        ? await trpcClient.stat.exportFollowupStats.query(filters.value)
        : await trpcClient.stat.exportHelpRequestStats.query(filters.value)
      if (!exportedFile.data) {
        throw new Error('no data')
      }
      const downloadLink = document.createElement('a')
      downloadLink.href = getExportUrl(exportedFile.data)
      downloadLink.download = getExportFilename(
        isFollowupsTabActive.value ? 'stats_entretiens' : 'stats_demandes_daide'
      )
      downloadLink.click()
      downloadLink.remove()
    } catch {
      useSnackbar().error(FAILED_DOWNLOAD_ERROR_MESSAGE)
    } finally {
      isDownloading.value = false
    }
  }
</script>

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .fr-tabs {
    box-shadow: none;
  }

  .fr-tabs__list {
    column-gap: 0.5rem;
    border-bottom: 3px solid var(--primary);

    &.followups-tab-active {
      border-bottom: 3px solid var(--color-followup);
    }
  }

  #help-requests-tab,
  #followups-tab {
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

  #followups-tab {
    color: var(--color-followup);
    background-color: var(--color-followup-light);

    span {
      font-size: 1rem;
    }

    &:hover {
      background-color: var(--color-followup-light-hover);
    }

    &[aria-selected='true'] {
      background-color: var(--color-followup);

      &:hover {
        background-color: var(--color-followup-hover);
      }
    }
  }
</style>
