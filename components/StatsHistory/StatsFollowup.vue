<template>
  <div class="fr-grid-row fr-grid-row--gutters fr-px-2w">
    <!-- Filters -->
    <!-- TODO: help request filters must be disabled -->
    <div class="fr-col-12">
      <h3 class="fr-sr-only">Filtres</h3>
      <StatsFilters
        v-model:filters="filters"
        :social-support-subject-options="socialSupportSubjectOptions"
        :beneficiaries-cities-options="beneficiariesCitiesOptions"
        :agent-options="agentOptions"
        :is-help-request="false"
        :is-history="true"
      />
    </div>

    <StatsHeader
      :menus="menus"
      class="fr-mb-1w"
    >
      <template #icon>
        <AtomIconFollowup :is-big="true" />
      </template>
      <template #title>
        {{ followupCountLabel }}
        <span
          v-if="
            historyCounts?.firstFollowups && historyCounts.firstFollowups > 0
          "
          class="fr-text--sm"
        >
          dont {{ firstFollowupCountLabel }}</span
        >
      </template>
    </StatsHeader>
    <StatsExportAlert
      v-if="!alertClose"
      @close-alert="alertClose = true"
    />

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
    <template v-else-if="followupCount">
      <div class="fr-grid-row fr-grid-row--gutters fr-px-2w">
        <!-- ROW -->
        <div class="fr-col-12">
          <StatsFollowupBeneficiaryNumber
            history-type="followup"
            :filters="filters"
          />
        </div>

        <!-- ROW -->
        <StatsCard
          class="fr-col-12 fr-col-md-6"
          :card-id="followupCardsConfig.subject.id"
          :card-name="followupCardsConfig.subject.name"
        >
          <StatsFollowupSubject
            :total-count="followupCount"
            :filters="filters"
          />
        </StatsCard>
        <StatsCard
          class="fr-col-12 fr-col-md-6"
          :card-id="followupCardsConfig.medium.id"
          :card-name="followupCardsConfig.medium.name"
        >
          <StatsFollowupMedium
            :total-count="followupCount"
            :filters="filters"
        /></StatsCard>

        <StatsCard
          v-if="application.module.ministere"
          class="fr-col-12 fr-col-md-6"
          :card-id="followupCardsConfig.ministre.id"
          :card-name="followupCardsConfig.ministre.name"
        >
          <StatsFollowupMinistre
            :total-count="followupCount"
            :filters="filters"
        /></StatsCard>

        <StatsCard
          class="fr-col-12 fr-col-md-6"
          :card-id="followupCardsConfig.status.id"
          :card-name="followupCardsConfig.status.name"
        >
          <StatsFollowupStatus
            :total-count="followupCount"
            :filters="filters"
          />
        </StatsCard>

        <StatsCard
          class="fr-col-12 fr-col-md-6"
          :card-id="followupCardsConfig.actions.id"
          :card-name="followupCardsConfig.actions.name"
        >
          <StatsFollowupActionsEntreprises
            :total-count="followupCount"
            :filters="filters"
        /></StatsCard>

        <StatsCard
          class="fr-col-12 fr-col-md-6"
          :card-id="followupCardsConfig.prescribingOrganizations.id"
          :card-name="followupCardsConfig.prescribingOrganizations.name"
        >
          <StatsFollowupPrescribingOrganizations
            :total-count="followupCount"
            :filters="filters"
          />
        </StatsCard>

        <StatsCard
          class="fr-col-12 fr-col-md-6"
          :card-id="followupCardsConfig.followupDuration.id"
          :card-name="followupCardsConfig.followupDuration.name"
        >
          <StatsFollowupDuration
            :total-count="followupCount"
            :filters="filters"
          />
        </StatsCard>
        <StatsCard
          class="fr-col-12 fr-col-md-6"
          :card-id="followupCardsConfig.followupMeanTime.id"
          :card-name="followupCardsConfig.followupMeanTime.name"
        >
          <StatsFollowupMeanTime
            :total-count="followupCount"
            :filters="filters"
          />
        </StatsCard>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import { StatFilterInput } from '~/server/schema'
  import { Options } from '~/utils/options'
  import { StatsCardConfig } from '~/types/stat'
  import { Menu } from '~/types/menu'
  import { exportStats, zipAndDownloadImages } from '~/utils/stats/exportStats'
  import { EventCategory, ExportStatsEventAction } from '~/types/matomo'

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

  const {
    data: historyCounts,
    pending,
    error
  } = await trpcClient.stat.getHistoryCounts.useQuery(filters)

  const followupCount = computed(() => historyCounts.value?.followups || 0)

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
          ? 'premiers entretiens'
          : 'Premier entretien'
      }`
  )

  const followupCardsConfig: StatsCardConfig = {
    subject: {
      id: 'stats-followup-subject',
      name: "Objets d'accompagnement"
    },
    medium: {
      id: 'stats-followup-medium',
      name: "Types d'entretien"
    },
    status: {
      id: 'stats-followup-status',
      name: 'Statuts'
    },
    actions: {
      id: 'stats-followup-actions',
      name: 'Actions entreprises'
    },
    prescribingOrganizations: {
      id: 'stats-followup-prescribing-organizations',
      name: 'Organismes prescripteurs'
    },
    followupDuration: {
      id: 'stats-followup-time-duration',
      name: 'Durée des entretiens'
    },
    followupMeanTime: {
      id: 'stats-followup-mean-time',
      name: 'Durée moyenne d’un entretien par objet d’accompagnement'
    },
    ...(application.value.module.ministere && {
      ministre: {
        id: 'stats-followup-ministre',
        name: 'Ministres'
      }
    })
  }

  const menus: ComputedRef<Menu[]> = computed(() => {
    const menus: Menu[] = []

    if (followupCount.value != 0) {
      menus.push({
        label: 'En images (.zip)',
        callback: async () => {
          matomo.trackEvent(
            EventCategory.ExportStats,
            ExportStatsEventAction.DownloadImages
          )
          alertClose.value = false
          const date = new Date()
          setTimeout(() => {
            zipAndDownloadImages(
              "Statistiques - Synthèses d'entretiens - " +
                date.toLocaleDateString(),
              followupCardsConfig,
              buttonFilter,
              closeAlert
            )
          }, 200)
        }
      })
    }

    if (followupCount.value != 0 && application.value.export.stats) {
      menus.push({
        label: 'En tableur (.xlsx)',
        callback: () => {
          matomo.trackEvent(
            EventCategory.ExportStats,
            ExportStatsEventAction.DownloadExcel
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
      'stats_entretiens',
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
