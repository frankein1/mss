<template>
  <div>
    <!-- Filters -->

    <StatsFilters
      v-model:filters="filters"
      :social-support-subject-options="socialSupportSubjectOptions"
      :beneficiaries-cities-options="beneficiariesCitiesOptions"
      :agent-options="agentOptions"
      :validation-schema="statFilterSchema"
    />

    <section class="fr-grid-row fr-grid-row--gutters">
      <h3 class="fr-sr-only">Résultats</h3>
      <StatsHeader
        class="fr-mt-3w"
        :menus="menus"
      >
        <template #header>
          <h4 class="fr-sr-only">Nombre de bénéficiaires</h4>
        </template>
        <template #icon>
          <img
            class="fr-mr-1w"
            src="~/assets/img/avatar.svg"
            alt=""
          />
        </template>
        <template #title>
          <p class="fr-mb-0 fr-h3 title-blue">
            {{ beneficiaryCountLabel[0] }}
            <template v-if="hasDateFilter">
              <button
                aria-describedby="tooltip-beneficiary-count"
                type="button"
                class="fr-btn--tooltip fr-btn"
              >
                infobulle
              </button>
              <span
                id="tooltip-beneficiary-count"
                class="fr-tooltip fr-placement"
                role="tooltip"
                >Bénéficiaires ayant reçu au moins un accompagnement dans la
                période concernée.
              </span>
            </template>
          </p>
          <p
            v-if="beneficiaryCountLabel[1] && beneficiaryCount?.count"
            class="fr-text--lg fr-mb-0"
          >
            {{ beneficiaryCountLabel[1] }}
          </p>
        </template>
      </StatsHeader>
      <StatsExportAlert
        v-if="!alertClose"
        @close-alert="alertClose = true"
      />
      <AtomAlert
        v-if="error"
        :alert-type="AlertType.Error"
        message="Le nombre total de bénéficiaires n'a pas pu être chargé."
      />
      <AtomLoader
        v-if="status === 'pending'"
        class="fr-mx-auto"
      />

      <!-- Cards -->
      <div class="fr-col-12">
        <StatsBeneficiariesFamilyFileNumber
          v-if="
            Object.keys(filters).length === 0 ||
            filters.period ||
            filters.referent ||
            filters.beneficiaryStatus
          "
          history-type="beneficiary"
          :filters="filters"
        />
      </div>

      <StatsCard
        class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
        :card-id="beneficiariesCardConfig.gender.id"
        :card-name="beneficiariesCardConfig.gender.name"
      >
        <StatsBeneficiariesGender
          :beneficiary-count="beneficiaryCount?.count || 0"
          :filters="filters"
        />
      </StatsCard>

      <StatsCard
        class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
        :card-id="beneficiariesCardConfig.ages.id"
        :card-name="beneficiariesCardConfig.ages.name"
      >
        <StatsBeneficiariesAgeGroups
          :beneficiary-count="beneficiaryCount?.count || 0"
          :filters="filters"
        />
      </StatsCard>

      <StatsCard
        class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
        :card-id="beneficiariesCardConfig.familySituations.id"
        :card-name="beneficiariesCardConfig.familySituations.name"
      >
        <StatsBeneficiariesFamilySituations
          :beneficiary-count="beneficiaryCount?.count || 0"
          :filters="filters"
        />
      </StatsCard>

      <StatsCard
        class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
        :card-id="beneficiariesCardConfig.cities.id"
        :card-name="beneficiariesCardConfig.cities.name"
      >
        <StatsBeneficiariesCities
          :beneficiary-count="beneficiaryCount?.count || 0"
          :filters="filters"
        />
      </StatsCard>

      <StatsCard
        class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
        :card-id="beneficiariesCardConfig.counties.id"
        :card-name="beneficiariesCardConfig.counties.name"
      >
        <StatsBeneficiariesDepartments
          :beneficiary-count="beneficiaryCount?.count || 0"
          :filters="filters"
        />
      </StatsCard>

      <StatsCard
        class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
        :card-id="beneficiariesCardConfig.region.id"
        :card-name="beneficiariesCardConfig.region.name"
      >
        <StatsBeneficiariesRegions
          :beneficiary-count="beneficiaryCount?.count || 0"
          :filters="filters"
        />
      </StatsCard>

      <StatsCard
        v-if="application.structure.ministryFields"
        class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
        :card-id="beneficiariesCardMinistereConfig.accomodationZone.id"
        :card-name="beneficiariesCardMinistereConfig.accomodationZone.name"
      >
        <StatsBeneficiariesAccommodationZone
          :beneficiary-count="beneficiaryCount?.count || 0"
          :filters="filters"
      /></StatsCard>

      <StatsCard
        class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
        :card-id="beneficiariesCardConfig.accomodationMode.id"
        :card-name="beneficiariesCardConfig.accomodationMode.name"
      >
        <StatsBeneficiariesAccommodationMode
          :beneficiary-count="beneficiaryCount?.count || 0"
          :filters="filters"
      /></StatsCard>

      <StatsCard
        class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
        :card-id="beneficiariesCardConfig.mobility.id"
        :card-name="beneficiariesCardConfig.mobility.name"
      >
        <StatsBeneficiariesMobility
          :beneficiary-count="beneficiaryCount?.count || 0"
          :filters="filters"
      /></StatsCard>

      <StatsCard
        class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
        :card-id="beneficiariesCardConfig.csp.id"
        :card-name="beneficiariesCardConfig.csp.name"
      >
        <StatsBeneficiariesCSP
          :beneficiary-count="beneficiaryCount?.count || 0"
          :filters="filters"
      /></StatsCard>

      <template v-if="application.structure.ministryFields">
        <StatsCard
          class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
          :card-id="beneficiariesCardMinistereConfig.ministereStructures.id"
          :card-name="beneficiariesCardMinistereConfig.ministereStructures.name"
        >
          <StatsBeneficiariesMinistereStructure
            :beneficiary-count="beneficiaryCount?.count || 0"
            :filters="filters"
        /></StatsCard>

        <StatsCard
          class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
          :card-id="
            beneficiariesCardMinistereConfig.ministereDepartementServices.id
          "
          :card-name="
            beneficiariesCardMinistereConfig.ministereDepartementServices.name
          "
        >
          <StatsBeneficiariesMinistereDepartementService
            :beneficiary-count="beneficiaryCount?.count || 0"
            :filters="filters"
        /></StatsCard>

        <StatsCard
          class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
          :card-id="beneficiariesCardMinistereConfig.ministereCategorie.id"
          :card-name="beneficiariesCardMinistereConfig.ministereCategorie.name"
        >
          <StatsBeneficiariesMinistereCategorie
            :beneficiary-count="beneficiaryCount?.count || 0"
            :filters="filters"
        /></StatsCard>

        <StatsCard
          class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
          :card-id="beneficiariesCardMinistereConfig.ministereInterpellation.id"
          :card-name="
            beneficiariesCardMinistereConfig.ministereInterpellation.name
          "
        >
          <StatsBeneficiariesMinistereInterpellation
            :beneficiary-count="beneficiaryCount?.count || 0"
            :filters="filters"
        /></StatsCard>
      </template>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import type { Options } from '~/utils/options'
  import { statFilterSchema, type StatFilterInput } from '~/server/schema'
  import type { MenuItem } from '~/types/menu'
  import { StatPeriodFilter } from '~/types/stat'
  import { exportStats, zipAndDownloadImages } from '~/utils/stats/exportStats'
  import { EventCategory, ExportEventAction } from '~/types/matomo'

  const alertClose = ref<boolean>(true)
  const trpcClient = useTrpcClient()
  const { application } = usePermissions()
  const matomo = useMatomo()

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
    error,
    status
  } = await trpcClient.stat.getBeneficiaryCount.useQuery(filters)

  const plural = (word: string, q: number, end = 's') =>
    q > 1 ? `${word}${end}` : `${word}`

  const hasDateFilter = computed(
    () =>
      (filters.value.period &&
        filters.value.period !== StatPeriodFilter.Custom) ||
      (filters.value.period === StatPeriodFilter.Custom &&
        (filters.value.fromDate || filters.value.toDate))
  )

  const beneficiaryCountLabel = computed(() => {
    const count = beneficiaryCount.value?.count || 0
    const countNew = beneficiaryCount.value?.new || 0

    if (hasDateFilter.value) {
      return [
        `${count} ${plural('Bénéficiaire', count)} ${plural('accompagné', count)}`,
        `${countNew} ${plural('bénéficiaire', countNew)} ${plural('créé', countNew)} dans la période`
      ]
    }
    return [`${count} ${plural('Bénéficiaire', count)}`]
  })

  const excelIsDownloading = (downloading: boolean) => {
    isDownloading.value = downloading
  }
  const handleExportExcel = () => {
    exportStats(
      filters.value,
      'stats_beneficiaires',
      trpcClient,
      excelIsDownloading
    )
  }

  const beneficiariesCardConfig = {
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
    mobility: {
      id: 'stats-beneficiaries-mobility',
      name: 'Données mobilité'
    },
    csp: {
      id: 'stats-beneficiaries-csp',
      name: 'Catégories socio-professionnelles'
    },
    accomodationMode: {
      id: 'stats-beneficiaries-accomodation-mode',
      name: "Modes d'hébergement"
    }
  }

  const beneficiariesCardMinistereConfig = {
    accomodationZone: {
      id: 'stats-beneficiaries-accomodation-zone',
      name: "Zone d'hébergement"
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

  const menus: ComputedRef<MenuItem[]> = computed(() => {
    const menus: MenuItem[] = []

    if (beneficiaryCount.value?.count != 0) {
      menus.push({
        label: 'En images (.zip)',
        onClick: async () => {
          matomo.trackEvent(
            EventCategory.ExportStats,
            ExportEventAction.DownloadBeneficiaryStatsImages
          )
          alertClose.value = false
          const date = new Date()
          setTimeout(() => {
            zipAndDownloadImages(
              'Statistiques - Bénéficiaires - ' + date.toLocaleDateString(),
              {
                ...beneficiariesCardConfig,
                ...(application.value.structure.ministryFields &&
                  beneficiariesCardMinistereConfig)
              },
              buttonFilter,
              closeAlert
            )
          }, 200)
        }
      })
    }

    if (beneficiaryCount.value?.count != 0 && application.value.stats.export) {
      menus.push({
        label: 'En tableur (.xlsx)',
        onClick: () => {
          matomo.trackEvent(
            EventCategory.ExportStats,
            ExportEventAction.DownloadBeneficiaryStatsExcel
          )
          handleExportExcel()
        }
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
</script>
