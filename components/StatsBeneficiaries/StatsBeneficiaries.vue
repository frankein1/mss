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

      <StatsHeader :menus="menus">
        <template #icon>
          <img
            src="~/assets/img/avatar.svg"
            alt="Bénéficiaire"
          />
        </template>
        <template #title>
          <span> {{ beneficiaryCountLabel[0] }}</span>
          <span
            v-if="beneficiaryCountLabel[1] && beneficiaryCount?.count"
            class="fr-text--lg"
          >
            {{ beneficiaryCountLabel[1] }}</span
          >
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
        message="Le nombre total de bénéficiaires n'a pas pu être chargé."
      />
      <AtomLoader
        v-if="pending"
        class="fr-mx-auto"
      />

      <!-- Cards -->
      <template v-else-if="beneficiaryCount?.count">
        <div class="fr-col-12">
          <StatsBeneficiariesFamilyFileNumber
            v-if="
              Object.keys(filters).length === 0 ||
              filters.period ||
              filters.referent ||
              filters.beneficiaryStatus
            "
            history-type="beneficiary"
            :total-count="beneficiaryCount.count"
            :filters="filters"
          />
        </div>

        <StatsCard
          class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
          :card-id="beneficiariesCardConfig.gender.id"
          :card-name="beneficiariesCardConfig.gender.name"
        >
          <StatsBeneficiariesGender
            :beneficiary-count="beneficiaryCount.count"
            :filters="filters"
          />
        </StatsCard>

        <StatsCard
          class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
          :card-id="beneficiariesCardConfig.ages.id"
          :card-name="beneficiariesCardConfig.ages.name"
        >
          <StatsBeneficiariesAgeGroups
            :beneficiary-count="beneficiaryCount.count"
            :filters="filters"
          />
        </StatsCard>

        <StatsCard
          class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
          :card-id="beneficiariesCardConfig.familySituations.id"
          :card-name="beneficiariesCardConfig.familySituations.name"
        >
          <StatsBeneficiariesFamilySituations
            :beneficiary-count="beneficiaryCount.count"
            :filters="filters"
          />
        </StatsCard>

        <StatsCard
          class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
          :card-id="beneficiariesCardConfig.cities.id"
          :card-name="beneficiariesCardConfig.cities.name"
        >
          <StatsBeneficiariesCities
            :beneficiary-count="beneficiaryCount.count"
            :filters="filters"
          />
        </StatsCard>

        <StatsCard
          class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
          :card-id="beneficiariesCardConfig.counties.id"
          :card-name="beneficiariesCardConfig.counties.name"
        >
          <StatsBeneficiariesDepartments
            :beneficiary-count="beneficiaryCount.count"
            :filters="filters"
          />
        </StatsCard>

        <StatsCard
          class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
          :card-id="beneficiariesCardConfig.region.id"
          :card-name="beneficiariesCardConfig.region.name"
        >
          <StatsBeneficiariesRegions
            :beneficiary-count="beneficiaryCount.count"
            :filters="filters"
          />
        </StatsCard>

        <StatsCard
          v-if="application.module.ministere"
          class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
          :card-id="beneficiariesCardConfig.accomodationZone.id"
          :card-name="beneficiariesCardConfig.accomodationZone.name"
        >
          <StatsBeneficiariesAccommodationZone
            :beneficiary-count="beneficiaryCount.count"
            :filters="filters"
        /></StatsCard>

        <StatsCard
          class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
          :card-id="beneficiariesCardConfig.accomodationMode.id"
          :card-name="beneficiariesCardConfig.accomodationMode.name"
        >
          <StatsBeneficiariesAccommodationMode
            :beneficiary-count="beneficiaryCount.count"
            :filters="filters"
        /></StatsCard>

        <StatsCard
          class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
          :card-id="beneficiariesCardConfig.mobility.id"
          :card-name="beneficiariesCardConfig.mobility.name"
        >
          <StatsBeneficiariesMobility
            :beneficiary-count="beneficiaryCount.count"
            :filters="filters"
        /></StatsCard>

        <StatsCard
          class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
          :card-id="beneficiariesCardConfig.csp.id"
          :card-name="beneficiariesCardConfig.csp.name"
        >
          <StatsBeneficiariesCSP
            :beneficiary-count="beneficiaryCount.count"
            :filters="filters"
        /></StatsCard>

        <template v-if="application.module.ministere">
          <StatsCard
            class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
            :card-id="beneficiariesCardConfig.ministereStructures.id"
            :card-name="beneficiariesCardConfig.ministereStructures.name"
          >
            <StatsBeneficiariesMinistereStructure
              :beneficiary-count="beneficiaryCount.count"
              :filters="filters"
          /></StatsCard>

          <StatsCard
            class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
            :card-id="beneficiariesCardConfig.ministereDepartementServices.id"
            :card-name="
              beneficiariesCardConfig.ministereDepartementServices.name
            "
          >
            <StatsBeneficiariesMinistereDepartementService
              :beneficiary-count="beneficiaryCount.count"
              :filters="filters"
          /></StatsCard>

          <StatsCard
            class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
            :card-id="beneficiariesCardConfig.ministereCategorie.id"
            :card-name="beneficiariesCardConfig.ministereCategorie.name"
          >
            <StatsBeneficiariesMinistereCategorie
              :beneficiary-count="beneficiaryCount.count"
              :filters="filters"
          /></StatsCard>

          <StatsCard
            class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
            :card-id="beneficiariesCardConfig.ministereInterpellation.id"
            :card-name="beneficiariesCardConfig.ministereInterpellation.name"
          >
            <StatsBeneficiariesMinistereInterpellation
              :beneficiary-count="beneficiaryCount.count"
              :filters="filters"
          /></StatsCard>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~/utils/constants/alert'
  import { Options } from '~/utils/options'
  import { StatFilterInput } from '~/server/schema'
  import { Menu } from '~/types/menu'
  import { StatsCardConfig, StatPeriodFilter } from '~/types/stat'
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
    pending,
    error
  } = await trpcClient.stat.getBeneficiaryCount.useQuery(filters)

  const plural = (word: string, q: number, end = 's') =>
    q > 1 ? `${q} ${word}${end}` : `${q} ${word}`

  const beneficiaryCountLabel = computed(() => {
    const hasDateFilter =
      (filters.value.period &&
        filters.value.period !== StatPeriodFilter.Custom) ||
      (filters.value.period === StatPeriodFilter.Custom &&
        (filters.value.fromDate || filters.value.toDate))

    if (hasDateFilter) {
      return [
        `${plural('Bénéficiaire', beneficiaryCount.value?.count || 0)}`,
        ` dont ${plural('nouveau', beneficiaryCount.value?.new || 0, 'x')}`
      ]
    }
    return [plural('Bénéficiaire', beneficiaryCount.value?.count || 0)]
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
    },
    ...(application.value.module.ministere && {
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
    })
  }

  const menus: ComputedRef<Menu[]> = computed(() => {
    const menus: Menu[] = []

    if (beneficiaryCount.value?.count != 0) {
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
              'Statistiques - Béneficaires - ' + date.toLocaleDateString(),
              beneficiariesCardConfig,
              buttonFilter,
              closeAlert
            )
          }, 200)
        }
      })
    }

    if (beneficiaryCount.value?.count != 0 && application.value.export.stats) {
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

  const buttonFilter = (node: HTMLElement | Node) => {
    return (node as HTMLElement).tagName !== 'BUTTON'
  }

  const closeAlert = () => {
    alertClose.value = true
  }
</script>
