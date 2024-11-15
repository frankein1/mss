<template>
  <div class="fr-grid-row fr-grid-row--gutters fr-px-2w">
    <!-- Filters -->
    <div class="fr-col-12">
      <h3 class="fr-sr-only">Filtres</h3>
      <StatsFilters
        v-model:filters="filters"
        :social-support-subject-options="socialSupportSubjectOptions"
        :beneficiaries-cities-options="beneficiariesCitiesOptions"
        :agent-options="agentOptions"
        :is-help-request="true"
        :is-history="true"
      />
    </div>

    <StatsHeader
      :menus="menus"
      class="fr-mb-1w"
    >
      <template #icon>
        <AtomicIconHelpRequest :is-big="true" />
      </template>
      <template #title>
        {{ helpRequestCountLabel }}
      </template>
    </StatsHeader>
    <StatsExportAlert
      v-if="!alertClose"
      @close-alert="alertClose = true"
    />

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
            hystory-type="helprequest"
            :total-count="helpRequestCount"
            :filters="filters"
          />
        </div>

        <!-- ROW -->
        <StatsCard
          v-if="displayed.instructionType"
          class="fr-col-12 fr-col-md-6"
          :card-id="helpRequestCardsConfig.instructionType.id"
          :card-name="helpRequestCardsConfig.instructionType.name"
        >
          <StatsFileInstructionType
            :total-count="helpRequestCount"
            :filters="filters"
          />
        </StatsCard>

        <StatsCard
          v-if="displayed.socialSupportSubjects"
          class="fr-col-12 fr-col-md-6"
          :card-id="helpRequestCardsConfig.subjects.id"
          :card-name="helpRequestCardsConfig.subjects.name"
        >
          <StatsHelpRequestSubject
            :total-count="helpRequestCount"
            :filters="filters"
          />
        </StatsCard>

        <StatsCard
          class="fr-col-12 fr-col-md-6"
          :card-id="helpRequestCardsConfig.status.id"
          :card-name="helpRequestCardsConfig.status.name"
        >
          <StatsHelpRequestStatus
            :total-count="helpRequestCount"
            :filters="filters"
          />
        </StatsCard>

        <StatsCard
          v-if="displayed.ministere"
          class="fr-col-12 fr-col-md-6"
          :card-id="helpRequestCardsConfig.ministres.id"
          :card-name="helpRequestCardsConfig.ministres.name"
        >
          <StatsHelpRequestMinistre
            :total-count="helpRequestCount"
            :filters="filters"
          />
        </StatsCard>

        <StatsCard
          class="fr-col-12 fr-col-md-6"
          :card-id="helpRequestCardsConfig.prescribingOrganizations.id"
          :card-name="helpRequestCardsConfig.prescribingOrganizations.name"
        >
          <StatsHelpRequestPrescribingOrganizations
            :total-count="helpRequestCount"
            :filters="filters"
        /></StatsCard>

        <StatsCard
          v-if="displayed.financial"
          class="fr-col-12 fr-col-md-6"
          :card-id="helpRequestCardsConfig.amountAllocated.id"
          :card-name="helpRequestCardsConfig.amountAllocated.name"
        >
          <StatsHelpRequestAmountsAllocated :filters />
        </StatsCard>

        <StatsCard
          v-if="displayed.financial"
          class="fr-col-12 fr-col-md-6"
          :card-id="helpRequestCardsConfig.financialHelpRequest.id"
          :card-name="helpRequestCardsConfig.financialHelpRequest.name"
        >
          <StatsFinancialHelpRequests :filters="filters" />
        </StatsCard>

        <StatsCard
          v-if="displayed.housing"
          class="fr-col-12 fr-col-md-6"
          :card-id="helpRequestCardsConfig.housingHelpRequest.id"
          :card-name="helpRequestCardsConfig.housingHelpRequest.name"
        >
          <StatsHousingHelpRequests :filters="filters" />
        </StatsCard>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { FileInstructionType } from '@prisma/client'
  import { AlertType } from '~/utils/constants/alert'
  import { StatFilterInput } from '~/server/schema'
  import { Options } from '~/utils/options'
  import { StatsCardConfig } from '~/types/stat'
  import { Menu } from '~/types/menu'
  import { exportStats, zipAndDownloadImages } from '~/utils/stats/exportStats'

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

  const {
    data: historyCounts,
    pending,
    error
  } = await trpcClient.stat.getHistoryCounts.useQuery(filters)

  const helpRequestCount = computed(
    () => historyCounts.value?.helpRequests.total || 0
  )

  const helpRequestCountLabel = computed(
    () =>
      `${helpRequestCount.value} ${
        helpRequestCount.value > 1
          ? 'Instructions de dossier'
          : 'Instruction de dossier'
      }`
  )

  const displayed = computed(() => ({
    instructionType: !filters.value.helpRequestSubject,
    socialSupportSubjects:
      filters.value.helpRequestSubject !== FileInstructionType.Housing,
    housing:
      !filters.value.socialSupportSubjects &&
      (!filters.value.helpRequestSubject ||
        filters.value.helpRequestSubject === FileInstructionType.Housing),
    financial:
      !filters.value.helpRequestSubject ||
      filters.value.helpRequestSubject === FileInstructionType.Financial,
    ministere: application.value.module.ministere
  }))

  const helpRequestCardsConfig: ComputedRef<StatsCardConfig> = computed(() => {
    return {
      ...(displayed.value.instructionType && {
        instructionType: {
          id: 'stats-helprequest-instruction-type',
          name: "Thématique d'instruction"
        }
      }),
      ...(displayed.value.socialSupportSubjects && {
        subjects: {
          id: 'stats-helprequest-subjects',
          name: "Objets d'accompagnement"
        }
      }),
      ...(displayed.value.housing && {
        housingHelpRequest: {
          id: 'stats-helprequest-housing-helprequest',
          name: 'Demandes de logement'
        }
      }),
      status: {
        id: 'stats-helprequest-status',
        name: 'Statuts'
      },
      ...(displayed.value.ministere && {
        ministres: {
          id: 'stats-helprequest-ministres',
          name: 'Ministres'
        }
      }),
      prescribingOrganizations: {
        id: 'stats-helprequest-prescribing-organization',
        name: 'Organismes prescripteurs'
      },
      ...(displayed.value.financial && {
        amountAllocated: {
          id: 'stats-helprequest-amount-allocated',
          name: 'Montants des aides délivrées'
        },
        financialHelpRequest: {
          id: 'stats-helprequest-financial-helprequest',
          name: 'Aides financières'
        }
      })
    }
  })

  const menus: ComputedRef<Menu[]> = computed(() => {
    // TODO: revamp dropdown menu with new design + use <VIcon />
    const menus: Menu[] = []

    if (helpRequestCount.value !== 0) {
      menus.push({
        label: 'En images (.zip)',
        callback: async () => {
          alertClose.value = false
          setTimeout(() => {
            zipAndDownloadImages(
              helpRequestCardsConfig.value,
              buttonFilter,
              closeAlert
            )
          }, 200)
        }
      })
    }

    if (helpRequestCount.value !== 0 && application.value.export.stats) {
      menus.push({
        label: 'En tableur (.xlsx)',
        callback: () => handleExportExcel()
      })
    }
    return menus
  })

  const excelIsDownloading = (downloading: boolean) => {
    isDownloading.value = downloading
  }
  const handleExportExcel = () => {
    exportStats(
      filters.value,
      'stats_instructions_dossier',
      trpcClient,
      excelIsDownloading
    )
  }

  const buttonFilter = (node: HTMLElement | Node) => {
    return (node as HTMLElement).tagName !== 'BUTTON'
  }
  const closeAlert = () => {
    alertClose.value = true
  }
</script>
