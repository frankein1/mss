<template>
  <div class="fr-grid-row fr-grid-row--gutters fr-px-2w">
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
      <div class="fr-col-12 results-container fr-mb-2w fr-p-2w">
        <h3 class="stats-main-title results-count">
          {{ helpRequestCountLabel }}
        </h3>
        <ExportDataButton
          v-if="application.export.stats"
          :is-downloading="isDownloading"
          stats
          @export="exportStats"
        />
      </div>
      <AtomAlert
        v-if="error"
        :alert-type="AlertType.Error"
        message="Le nombre total d'instructions de dossier n'a pas pu être chargé."
      />
      <AtomLoader
        v-if="pending"
        class="fr-mx-auto"
      />
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
            <StatsFileInstructionType
              :total-count="helpRequestCount"
              :filters="filters"
            />
          </div>
          <div
            v-if="filters.helpRequestSubject !== FileInstructionType.Housing"
            class="ffr-col-12 fr-col-md-6 fr-col-xl-4"
          >
            <StatsHelpRequestSubject
              :total-count="financialHelpRequestCount + otherHelpRequestCount"
              :filters="filters"
            />
          </div>
          <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
            <StatsHelpRequestStatus
              :total-count="helpRequestCount"
              :filters="filters"
            />
          </div>

          <!-- ROW -->
          <div
            v-if="application.module.ministere"
            class="fr-col-12 fr-col-md-6 fr-col-xl-4"
          >
            <StatsHelpRequestMinistre
              :total-count="helpRequestCount"
              :filters="filters"
            />
          </div>
          <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
            <StatsHelpRequestPrescribingOrganizations
              :total-count="helpRequestCount"
              :filters="filters"
            />
          </div>
          <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
            <StatsHistoryInstructorOrganizations
              :total-count="externalHelpRequestCount"
              :filters="filters"
            />
          </div>

          <!-- ROW -->
          <div
            v-if="
              !filters.helpRequestSubject ||
              filters.helpRequestSubject === FileInstructionType.Financial
            "
            class="fr-col-12 fr-col-sm-6"
          >
            <StatsFinancialHelpRequests :filters="filters" />
          </div>
          <div
            v-if="
              !filters.socialSupportSubjects &&
              (!filters.helpRequestSubject ||
                filters.helpRequestSubject === FileInstructionType.Housing)
            "
            class="fr-col-12 fr-col-sm-6"
          >
            <StatsHousingHelpRequests :filters="filters" />
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

  const trpcClient = useTrpcClient()
  const { application } = usePermissions()

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
</script>
