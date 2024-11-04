<template>
  <div class="fr-container--fluid fr-mb-3w">
    <div class="fr-grid-row fr-grid-row--gutters fr-px-2w">
      <div class="fr-col-12">
        <StatsFilters
          v-model:filters="filters"
          :social-support-subject-options="socialSupportSubjectOptions"
          :beneficiaries-cities-options="beneficiariesCitiesOptions"
          :agent-options="agentOptions"
        />
      </div>
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
      </div>
      <div class="fr-col-12">
        <div
          v-if="!alertClose"
          class="export-alert"
        >
          <AtomAlert
            :alert-type="AlertType.Success"
            :message="alertContent"
            :closeable="true"
            @close="alertClose = true"
          />
        </div>
      </div>
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
        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsCard
            :card-id="statsCardConfig.gender.id"
            :card-name="statsCardConfig.gender.name"
          >
            <StatsBeneficiariesGender
              :beneficiary-count="beneficiaryCount"
              :filters="filters"
            />
          </StatsCard>
        </div>

        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsCard
            :card-id="statsCardConfig.ages.id"
            :card-name="statsCardConfig.ages.name"
          >
            <StatsBeneficiariesAgeGroups
              :beneficiary-count="beneficiaryCount"
              :filters="filters"
            />
          </StatsCard>
        </div>

        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsCard
            :card-id="statsCardConfig.familySituations.id"
            :card-name="statsCardConfig.familySituations.name"
          >
            <StatsBeneficiariesFamilySituations
              :beneficiary-count="beneficiaryCount"
              :filters="filters"
            />
          </StatsCard>
        </div>

        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsCard
            :card-id="statsCardConfig.cities.id"
            :card-name="statsCardConfig.cities.name"
          >
            <StatsBeneficiariesCities
              :beneficiary-count="beneficiaryCount"
              :filters="filters"
            />
          </StatsCard>
        </div>

        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsCard
            :card-id="statsCardConfig.counties.id"
            :card-name="statsCardConfig.counties.name"
          >
            <StatsBeneficiariesDepartments
              :beneficiary-count="beneficiaryCount"
              :filters="filters"
            />
          </StatsCard>
        </div>

        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsCard
            :card-id="statsCardConfig.region.id"
            :card-name="statsCardConfig.region.name"
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
            :card-id="statsCardConfig.accomodationZone.id"
            :card-name="statsCardConfig.accomodationZone.name"
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
            :card-id="statsCardConfig.accomodationMode.id"
            :card-name="statsCardConfig.accomodationMode.name"
          >
            <StatsBeneficiariesAccommodationMode
              :beneficiary-count="beneficiaryCount"
              :filters="filters"
          /></StatsCard>
        </div>

        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsCard
            :card-id="statsCardConfig.mobility.id"
            :card-name="statsCardConfig.mobility.name"
          >
            <StatsBeneficiariesMobility
              :beneficiary-count="beneficiaryCount"
              :filters="filters"
          /></StatsCard>
        </div>

        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsCard
            :card-id="statsCardConfig.csp.id"
            :card-name="statsCardConfig.csp.name"
          >
            <StatsBeneficiariesCSP
              :beneficiary-count="beneficiaryCount"
              :filters="filters"
          /></StatsCard>
        </div>

        <template v-if="application.module.ministere">
          <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
            <StatsCard
              :card-id="statsCardConfig.ministereStructures.id"
              :card-name="statsCardConfig.ministereStructures.name"
            >
              <StatsBeneficiariesMinistereStructure
                :beneficiary-count="beneficiaryCount"
                :filters="filters"
            /></StatsCard>
          </div>

          <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
            <StatsCard
              :card-id="statsCardConfig.ministereDepartementServices.id"
              :card-name="statsCardConfig.ministereDepartementServices.name"
            >
              <StatsBeneficiariesMinistereDepartementService
                :beneficiary-count="beneficiaryCount"
                :filters="filters"
            /></StatsCard>
          </div>

          <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
            <StatsCard
              :card-id="statsCardConfig.ministereCategorie.id"
              :card-name="statsCardConfig.ministereCategorie.name"
            >
              <StatsBeneficiariesMinistereCategorie
                :beneficiary-count="beneficiaryCount"
                :filters="filters"
            /></StatsCard>
          </div>

          <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
            <StatsCard
              :card-id="statsCardConfig.ministereInterpellation.id"
              :card-name="statsCardConfig.ministereInterpellation.name"
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
  import domtoimage from 'dom-to-image-more'
  import { Menu } from '~/types/menu'

  const alertClose = ref<boolean>(true)
  const alertContent = ref<string>(
    'Export en cours... Le téléchargement peut prendre plusieurs secondes avant de démarrer.'
  )

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

  type StatsCardConfig = {
    [key: string]: {
      id: string
      name: string
    }
  }
  const statsCardConfig: StatsCardConfig = {
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
            saveAsPngs(statsCardConfig)
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

  const extractIds = (config: StatsCardConfig) => {
    return Object.values(config).map(item => item.id)
  }
  const extractNames = (config: StatsCardConfig) => {
    return Object.values(config).map(item => item.name)
  }

  const saveAsPngs = (statsCardConfig: StatsCardConfig) => {
    const configIds = extractIds(statsCardConfig)
    const configNames = extractNames(statsCardConfig)
    const nodes = configIds
      .map(id => {
        const node = document.getElementById(id)
        if (node) {
          return node
        }
      })
      .filter(node => node != null)
    if (nodes.length && nodes.length > 0) {
      nodes.forEach(async (node, i) => {
        try {
          const scale = 1
          domtoimage
            .toPng(node, {
              quality: 0.9,
              filter: buttonFilter,
              width: node.clientWidth * scale,
              height: node.clientHeight * scale,
              style: {
                transform: 'scale(' + scale + ')',
                transformOrigin: 'top left'
              }
            })
            .then(function (dataUrl) {
              const link = document.createElement('a')
              link.download = configNames[i] + '.png'
              link.href = dataUrl
              link.click()
              document.body.removeChild(link)
            })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          useSnackbar().error("Les images n'ont pas pu être exportées.")
        } finally {
          alertClose.value = true
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
  .export-alert {
    z-index: 1500;
    position: fixed;
    right: 0;
    bottom: 0;
    margin: 2rem;
  }
</style>
