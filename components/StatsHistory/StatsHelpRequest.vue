<template>
  <div class="fr-grid-row fr-grid-row--gutters fr-px-2w">
    <!-- Filters -->
    <section class="fr-col-12">
      <h3 class="fr-sr-only">Filtres</h3>
      <StatsFilters
        v-model:filters="filters"
        :social-support-subject-options="socialSupportSubjectOptions"
        :beneficiaries-cities-options="beneficiariesCitiesOptions"
        :agent-options="agentOptions"
        :is-help-requests-tab="!isFollowupsTabActive"
        :is-history="true"
      />
    </section>
    <section>
      <!-- Title + Export buttons -->
      <div class="fr-col-12 results-container fr-mb-2w fr-p-2w">
        <h3 class="stats-main-title results-count">
          {{ helpRequestCountLabel }}
        </h3>
        <AtomDropdown
          label="Exporter les statistiques"
          icon="fr-icon-download-fill"
          :menus="menus"
          class="topbar__menu"
          dropdown-btn-class="fr-btn--tertiary-no-outline"
          align-right
        />
        <StatsExportAlert
          v-if="!alertClose"
          @close-alert="alertClose = true"
        />
      </div>

      <!-- Alert + Loader -->
      <AtomAlert
        v-if="error"
        :alert-type="AlertType.Error"
        message="Le nombre total d'instructions de dossier n'a pas pu être chargé."
      />
      <AtomLoader
        v-if="pending"
        class="fr-mx-auto"
      />

      <!-- Cards -->
      <template v-else-if="helpRequestCount">
        <div class="fr-grid-row fr-grid-row--gutters fr-px-2w">
          <!-- ROW -->
          <div class="fr-col-12">
            <StatsHelpRequestBeneficiaryNumber
              :total-count="helpRequestCount"
              :filters="filters"
            />
          </div>

          <!-- ROW -->
          <div
            v-if="!filters.helpRequestSubject"
            class="fr-col-12 fr-col-md-6 fr-col-xl-4"
          >
            <StatsCard
              :card-id="helpRequestCardsConfig.instructionType.id"
              :card-name="helpRequestCardsConfig.instructionType.name"
            >
              <StatsFileInstructionType
                :total-count="helpRequestCount"
                :filters="filters"
              />
            </StatsCard>
          </div>
          <div
            v-if="filters.helpRequestSubject !== FileInstructionType.Housing"
            class="ffr-col-12 fr-col-md-6 fr-col-xl-4"
          >
            <StatsCard
              :card-id="helpRequestCardsConfig.subjects.id"
              :card-name="helpRequestCardsConfig.subjects.name"
            >
              <StatsHelpRequestSubject
                :total-count="financialHelpRequestCount + otherHelpRequestCount"
                :filters="filters"
              />
            </StatsCard>
          </div>
          <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
            <StatsCard
              :card-id="helpRequestCardsConfig.status.id"
              :card-name="helpRequestCardsConfig.status.name"
            >
              <StatsHelpRequestStatus
                :total-count="helpRequestCount"
                :filters="filters"
              />
            </StatsCard>
          </div>

          <!-- ROW -->
          <div
            v-if="application.module.ministere"
            class="fr-col-12 fr-col-md-6 fr-col-xl-4"
          >
            <StatsCard
              :card-id="helpRequestCardsConfig.ministres.id"
              :card-name="helpRequestCardsConfig.ministres.name"
            >
              <StatsHelpRequestMinistre
                :total-count="helpRequestCount"
                :filters="filters"
              />
            </StatsCard>
          </div>
          <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
            <StatsCard
              :card-id="helpRequestCardsConfig.prescribingOrganizations.id"
              :card-name="helpRequestCardsConfig.prescribingOrganizations.name"
            >
              <StatsHelpRequestPrescribingOrganizations
                :total-count="helpRequestCount"
                :filters="filters"
            /></StatsCard>
          </div>
          <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
            <StatsCard
              :card-id="helpRequestCardsConfig.instructorOrganizations.id"
              :card-name="helpRequestCardsConfig.instructorOrganizations.name"
            >
              <StatsHistoryInstructorOrganizations
                :total-count="externalHelpRequestCount"
                :filters="filters"
              />
            </StatsCard>
          </div>

          <!-- ROW -->
          <div
            v-if="
              !filters.helpRequestSubject ||
              filters.helpRequestSubject === FileInstructionType.Financial
            "
            class="fr-col-12 fr-col-sm-6"
          >
            <StatsCard
              :card-id="helpRequestCardsConfig.financialHelpRequest.id"
              :card-name="helpRequestCardsConfig.financialHelpRequest.name"
            >
              <StatsFinancialHelpRequests :filters="filters" />
            </StatsCard>
          </div>
          <div
            v-if="
              !filters.socialSupportSubjects &&
              (!filters.helpRequestSubject ||
                filters.helpRequestSubject === FileInstructionType.Housing)
            "
            class="fr-col-12 fr-col-sm-6"
          >
            <StatsCard
              :card-id="helpRequestCardsConfig.housingHelpRequest.id"
              :card-name="helpRequestCardsConfig.housingHelpRequest.name"
            >
              <StatsHousingHelpRequests :filters="filters" />
            </StatsCard>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import { FileInstructionType } from '@prisma/client'
  import { AlertType } from '~/utils/constants/alert'
  import { StatFilterInput } from '~/server/schema'
  import { Options } from '~/utils/options'
  import { FAILED_DOWNLOAD_ERROR_MESSAGE } from '~/utils/constants'
  import { getExportUrl } from '~/utils/export/getExportUrl'
  import { getExportFilename } from '~/utils/export/getExportFilename'
  import { StatsCardConfig } from '~/types/stat'
  import { Menu } from '~/types/menu'
  import { saveAsPngs } from '~/utils/stats/exportStatsCard'

  const trpcClient = useTrpcClient()
  const { application } = usePermissions()

  const alertClose = ref<boolean>(true)

  withDefaults(
    defineProps<{
      socialSupportSubjectOptions?: Options
      beneficiariesCitiesOptions?: Options
      agentOptions?: Options
    }>(),
    {
      socialSupportSubjectOptions: () => [],
      beneficiariesCitiesOptions: () => [],
      agentOptions: () => []
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
    () => historyCounts.value?.helpRequests.total || 0
  )

  const financialHelpRequestCount = computed(
    () => historyCounts.value?.helpRequests.Financial || 0
  )

  const otherHelpRequestCount = computed(
    () => historyCounts.value?.helpRequests.Other || 0
  )

  const externalHelpRequestCount = computed(
    () => historyCounts.value?.helpRequests.external || 0
  )

  const helpRequestCountLabel = computed(
    () =>
      `${helpRequestCount.value} ${
        helpRequestCount.value > 1
          ? 'Instructions de dossier'
          : 'Instruction de dossier'
      }`
  )

  const helpRequestCardsConfig: StatsCardConfig = {
    instructionType: {
      id: 'stats-helprequest-instruction-type',
      name: "Thématique d'instruction"
    },
    subjects: {
      id: 'stats-helprequest-subjects',
      name: "Objets d'accompagnement"
    },
    status: {
      id: 'stats-helprequest-status',
      name: 'Statuts'
    },
    ministres: {
      id: 'stats-helprequest-ministres',
      name: 'Ministres'
    },
    prescribingOrganizations: {
      id: 'stats-helprequest-prescribing-organization',
      name: 'Organismes prescripteurs'
    },
    instructorOrganizations: {
      id: 'stats-helprequest-instructor-organization',
      name: 'Organismes instructeurs'
    },
    financialHelpRequest: {
      id: 'stats-helprequest-financial-helprequest',
      name: 'Aides financières'
    },
    housingHelpRequest: {
      id: 'stats-helprequest-housing-helprequest',
      name: 'Demandes de logement'
    }
  }

  const menus: ComputedRef<Menu[]> = computed(() => {
    // TODO: revamp dropdown menu with new design + use <VIcon />
    const menus: Menu[] = [
      {
        label: 'En images (.png)',
        callback: async () => {
          alertClose.value = false
          setTimeout(() => {
            handleSaveAsPngs()
          }, 1000)
        }
      }
    ]

    if (application.value.export.stats) {
      menus.push({
        label: 'En tableur (.xlsx)',
        callback: () => exportStats()
      })
    }
    return menus
  })

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
        isFollowupsTabActive.value
          ? 'stats_entretiens'
          : 'stats_instructions_dossier'
      )
      downloadLink.click()
      downloadLink.remove()
    } catch {
      useSnackbar().error(FAILED_DOWNLOAD_ERROR_MESSAGE)
    } finally {
      isDownloading.value = false
    }
  }

  const buttonFilter = (node: HTMLElement | Node) => {
    return (node as HTMLElement).tagName !== 'BUTTON'
  }
  const closeAlert = () => {
    alertClose.value = true
  }
  const handleSaveAsPngs = () => {
    saveAsPngs(helpRequestCardsConfig, buttonFilter, closeAlert)
  }
</script>
