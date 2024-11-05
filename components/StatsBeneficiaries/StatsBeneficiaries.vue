<template>
  <div class="fr-container--fluid fr-mb-3w">
    <div class="fr-grid-row fr-grid-row--gutters fr-px-2w">
      <!-- Filters -->
      <div class="fr-col-12">
        <StatsFilters
          v-model:filters="filters"
          :social-support-subject-options="socialSupportSubjectOptions"
          :beneficiaries-cities-options="beneficiariesCitiesOptions"
          :agent-options="agentOptions"
        />
      </div>

      <!-- Title + Export buttons -->
      <div class="fr-col-12 results-container">
        <h3 class="stats-main-title results-count">
          {{ beneficiaryCountLabel }}
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
        message="Le nombre total de bénéficiaires n'a pas pu être chargé."
      />
      <AtomLoader
        v-if="pending"
        class="fr-mx-auto"
      />

      <!-- Cards -->
      <template v-else-if="beneficiaryCount">
        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsCard
            :card-id="beneficiariesCardConfig.gender.id"
            :card-name="beneficiariesCardConfig.gender.name"
          >
            <StatsBeneficiariesGender
              :beneficiary-count="beneficiaryCount"
              :filters="filters"
            />
          </StatsCard>
        </div>

        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsCard
            :card-id="beneficiariesCardConfig.ages.id"
            :card-name="beneficiariesCardConfig.ages.name"
          >
            <StatsBeneficiariesAgeGroups
              :beneficiary-count="beneficiaryCount"
              :filters="filters"
            />
          </StatsCard>
        </div>

        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsCard
            :card-id="beneficiariesCardConfig.familySituations.id"
            :card-name="beneficiariesCardConfig.familySituations.name"
          >
            <StatsBeneficiariesFamilySituations
              :beneficiary-count="beneficiaryCount"
              :filters="filters"
            />
          </StatsCard>
        </div>

        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsCard
            :card-id="beneficiariesCardConfig.cities.id"
            :card-name="beneficiariesCardConfig.cities.name"
          >
            <StatsBeneficiariesCities
              :beneficiary-count="beneficiaryCount"
              :filters="filters"
            />
          </StatsCard>
        </div>

        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsCard
            :card-id="beneficiariesCardConfig.counties.id"
            :card-name="beneficiariesCardConfig.counties.name"
          >
            <StatsBeneficiariesDepartments
              :beneficiary-count="beneficiaryCount"
              :filters="filters"
            />
          </StatsCard>
        </div>

        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsCard
            :card-id="beneficiariesCardConfig.region.id"
            :card-name="beneficiariesCardConfig.region.name"
          >
            <StatsBeneficiariesRegions
              :beneficiary-count="beneficiaryCount"
              :filters="filters"
            />
          </StatsCard>
        </div>

        <div
          v-if="application.module.ministere"
          class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
        >
          <StatsCard
            :card-id="beneficiariesCardConfig.accomodationZone.id"
            :card-name="beneficiariesCardConfig.accomodationZone.name"
          >
            <StatsBeneficiariesAccommodationZone
              :beneficiary-count="beneficiaryCount"
              :filters="filters"
          /></StatsCard>
        </div>

        <div
          v-if="application.module.ministere"
          class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
        >
          <StatsCard
            :card-id="beneficiariesCardConfig.accomodationMode.id"
            :card-name="beneficiariesCardConfig.accomodationMode.name"
          >
            <StatsBeneficiariesAccommodationMode
              :beneficiary-count="beneficiaryCount"
              :filters="filters"
          /></StatsCard>
        </div>

        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsCard
            :card-id="beneficiariesCardConfig.mobility.id"
            :card-name="beneficiariesCardConfig.mobility.name"
          >
            <StatsBeneficiariesMobility
              :beneficiary-count="beneficiaryCount"
              :filters="filters"
          /></StatsCard>
        </div>

        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsCard
            :card-id="beneficiariesCardConfig.csp.id"
            :card-name="beneficiariesCardConfig.csp.name"
          >
            <StatsBeneficiariesCSP
              :beneficiary-count="beneficiaryCount"
              :filters="filters"
          /></StatsCard>
        </div>

        <template v-if="application.module.ministere">
          <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
            <StatsCard
              :card-id="beneficiariesCardConfig.ministereStructures.id"
              :card-name="beneficiariesCardConfig.ministereStructures.name"
            >
              <StatsBeneficiariesMinistereStructure
                :beneficiary-count="beneficiaryCount"
                :filters="filters"
            /></StatsCard>
          </div>

          <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
            <StatsCard
              :card-id="beneficiariesCardConfig.ministereDepartementServices.id"
              :card-name="
                beneficiariesCardConfig.ministereDepartementServices.name
              "
            >
              <StatsBeneficiariesMinistereDepartementService
                :beneficiary-count="beneficiaryCount"
                :filters="filters"
            /></StatsCard>
          </div>

          <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
            <StatsCard
              :card-id="beneficiariesCardConfig.ministereCategorie.id"
              :card-name="beneficiariesCardConfig.ministereCategorie.name"
            >
              <StatsBeneficiariesMinistereCategorie
                :beneficiary-count="beneficiaryCount"
                :filters="filters"
            /></StatsCard>
          </div>

          <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
            <StatsCard
              :card-id="beneficiariesCardConfig.ministereInterpellation.id"
              :card-name="beneficiariesCardConfig.ministereInterpellation.name"
            >
              <StatsBeneficiariesMinistereInterpellation
                :beneficiary-count="beneficiaryCount"
                :filters="filters"
            /></StatsCard>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import { Options } from '~/utils/options'
  import { StatFilterInput } from '~/server/schema'
  import { FAILED_DOWNLOAD_ERROR_MESSAGE } from '~/utils/constants'
  import { getExportUrl } from '~/utils/export/getExportUrl'
  import { getExportFilename } from '~/utils/export/getExportFilename'
  import { Menu } from '~/types/menu'
  import { StatsCardConfig } from '~/types/stat'
  import { saveAsPngs } from '~/utils/stats/exportStatsCard'

  const alertClose = ref<boolean>(true)

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

  const {
    data: beneficiaryCount,
    pending,
    error
  } = await trpcClient.stat.getBeneficiaryCount.useQuery(filters)

  const beneficiaryCountLabel = computed(
    () =>
      `${beneficiaryCount.value || 0} ${
        beneficiaryCount.value || 0 > 1 ? 'Bénéficiaires' : 'Bénéficiaire'
      }`
  )

  async function exportStats() {
    isDownloading.value = true
    try {
      const exportedBeneficiaries =
        await trpcClient.stat.exportBeneficiaryStats.query(filters.value)
      if (!exportedBeneficiaries.data) {
        throw new Error('no data')
      }
      const downloadLink = document.createElement('a')
      downloadLink.href = getExportUrl(exportedBeneficiaries.data)
      downloadLink.download = getExportFilename('stats_beneficiaires')
      downloadLink.click()
      downloadLink.remove()
    } catch {
      useSnackbar().error(FAILED_DOWNLOAD_ERROR_MESSAGE)
    } finally {
      isDownloading.value = false
    }
  }

  const beneficiariesCardConfig: StatsCardConfig = {
    gender: {
      id: 'stats-beneficiaries-gender',
      name: 'Genres'
    },
    ages: {
      id: 'stats-beneficiaries-ages',
      name: "Tranches d'âge"
    },
    familySituations: {
      id: 'stats-beneficiaries-family-situations',
      name: 'Types de situations familiales'
    },
    cities: {
      id: 'stats-beneficiaries-cities',
      name: 'Villes'
    },
    counties: {
      id: 'stats-beneficiaries-counties',
      name: 'Départements'
    },
    region: {
      id: 'stats-beneficiaries-region',
      name: 'Régions'
    },
    accomodationZone: {
      id: 'stats-beneficiaries-accomodation-zone',
      name: "Zones d'hébergement"
    },
    accomodationMode: {
      id: 'stats-beneficiaries-accomodation-mode',
      name: "Modes d'hébergement"
    },
    mobility: {
      id: 'stats-beneficiaries-mobility',
      name: 'Données mobilité'
    },
    csp: {
      id: 'stats-beneficiaries-csp',
      name: 'Catégories socio-professionnelles'
    },
    ministereStructures: {
      id: 'stats-beneficiaries-ministere-structures',
      name: 'Structures de rattachement'
    },
    ministereDepartementServices: {
      id: 'stats-beneficiaries-departement-services',
      name: "Départements ou services de l'administration centrale"
    },
    ministereCategorie: {
      id: 'stats-beneficiaries-categories',
      name: 'Catégories'
    },
    ministereInterpellation: {
      id: 'stats-beneficiaries-interpellation',
      name: 'Bénéficiaires ayant interpellé chaque ministre'
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

  const buttonFilter = (node: HTMLElement | Node) => {
    return (node as HTMLElement).tagName !== 'BUTTON'
  }

  const closeAlert = () => {
    alertClose.value = true
  }

  const handleSaveAsPngs = () => {
    saveAsPngs(beneficiariesCardConfig, buttonFilter, closeAlert)
  }
</script>
