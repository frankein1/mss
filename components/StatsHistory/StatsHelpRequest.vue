<template>
  <div>
    <!-- Filters -->
    <StatsFilters
      v-model:filters="filters"
      :social-support-subject-options="socialSupportSubjectOptions"
      :beneficiaries-cities-options="beneficiariesCitiesOptions"
      :agent-options="agentOptions"
      :is-help-request="true"
      :is-history="true"
    />

    <section class="fr-grid-row fr-grid-row--gutters">
      <h3 class="fr-sr-only">Résultats</h3>
      <StatsHeader
        :menus="menus"
        class="fr-mb-1w fr-mt-3w"
      >
        <template #header>
          <h4 class="fr-sr-only">Nombre d'instructions de dossiers</h4>
        </template>
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
        v-if="reloadStatistics"
        class="fr-mx-auto"
      />

      <!-- Cards -->
      <template v-else-if="helpRequestCount">
        <div class="fr-grid-row fr-grid-row--gutters fr-px-2w">
          <!-- ROW -->
          <div class="fr-col-12">
            <StatsHelpRequestBeneficiaryNumber
              history-type="helprequest"
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
            />
          </StatsCard>

          <StatsCard
            class="fr-col-12 fr-col-md-6"
            :card-id="helpRequestCardsConfig.instructions.id"
            :card-name="helpRequestCardsConfig.instructions.name"
          >
            <StatsHelpRequestInstructions
              :total-count="helpRequestCount"
              :filters="filters"
            />
          </StatsCard>

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
            :card-id="helpRequestCardsConfig.amountsBySubject.id"
            :card-name="helpRequestCardsConfig.amountsBySubject.name"
          >
            <StatsHelpRequestAmountsBySubject :filters="filters" />
          </StatsCard>

          <StatsCard
            v-if="displayed.financial"
            class="fr-col-12 fr-col-md-6"
            :card-id="helpRequestCardsConfig.amountByInstructorOrganization.id"
            :card-name="
              helpRequestCardsConfig.amountByInstructorOrganization.name
            "
          >
            <StatsHelpRequestAmountsByInstructorOrganization :filters />
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
    </section>
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
  import { EventCategory, ExportEventAction } from '~/types/matomo'
  import { RouterOutput } from '~/server/trpc/routers'

  const trpcClient = useTrpcClient()
  const { application } = usePermissions()
  const matomo = useMatomo()

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

  const error = ref<Error | null>(null)
  const reloadStatistics = ref(false)
  const historyCounts = ref<RouterOutput['stat']['getHistoryCounts'] | null>(
    null
  )

  watch(
    filters,
    async () => {
      try {
        reloadStatistics.value = true
        error.value = null

        historyCounts.value = await trpcClient.stat.getHistoryCounts.mutate(
          filters.value
        )
      } catch (e: unknown) {
        error.value = e as Error
        historyCounts.value = null
      } finally {
        reloadStatistics.value = false
      }
    },
    { immediate: true }
  )

  const helpRequestCount = computed(
    () => historyCounts.value?.helpRequests.total || 0
  )

  const helpRequestCountLabel = computed(
    () =>
      `${helpRequestCount.value} ${
        helpRequestCount.value > 1
          ? 'Instructions de dossiers'
          : 'Instruction de dossiers'
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
      instructions: {
        id: 'stats-helprequest-instructions',
        name: 'Instructions'
      },
      ...(displayed.value.financial && {
        amountAllocated: {
          id: 'stats-helprequest-amount-allocated',
          name: 'Montants des aides délivrées'
        },
        amountByInstructorOrganization: {
          id: 'stats-helprequest-amount-by-instructor-organization',
          name: 'Répartition des montants accordés par organisme instructeur'
        },
        amountsBySubject: {
          id: 'stats-helprequest-amounts-by-subject',
          name: 'Répartition des montants accordés par objet d’accompagnement'
        }
      })
    }
  })

  const menus: ComputedRef<Menu[]> = computed(() => {
    const menus: Menu[] = []

    if (helpRequestCount.value !== 0) {
      menus.push({
        label: 'En images (.zip)',
        callback: async () => {
          matomo.trackEvent(
            EventCategory.ExportStats,
            ExportEventAction.DownloadImages
          )
          alertClose.value = false
          const date = new Date()
          setTimeout(() => {
            zipAndDownloadImages(
              'Statistiques - Instructions de dossiers - ' +
                date.toLocaleDateString(),
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
        callback: () => {
          matomo.trackEvent(
            EventCategory.ExportStats,
            ExportEventAction.DownloadExcel
          )
          handleExportExcel()
        }
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
