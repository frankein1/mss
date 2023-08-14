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
        {{ beneficiaryCountLabel }}
      </h2>
      <ExportDataButton
        v-if="canExportStats(authStore.getAuthUser)"
        :is-downloading="isDownloading"
        stats
        @export="exportStats"
      />
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
      <div class="fr-col-12 fr-col-md-6 fr-col-xl-3">
        <StatsBeneficiariesGender
          :beneficiary-count="beneficiaryCount"
          :filters="filters"
        />
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-col-xl-3">
        <StatsBeneficiariesAgeGroups
          :beneficiary-count="beneficiaryCount"
          :filters="filters"
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6">
        <StatsBeneficiariesFamilySituations
          :beneficiary-count="beneficiaryCount"
          :filters="filters"
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
        <StatsBeneficiariesRegions
          :beneficiary-count="beneficiaryCount"
          :filters="filters"
        />
      </div>
      <div
        v-if="isMinistryAgent"
        class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
      >
        <StatsBeneficiariesAccommodationZone
          :beneficiary-count="beneficiaryCount"
          :filters="filters"
        />
      </div>
      <div
        v-if="isMinistryAgent"
        class="fr-col-12 fr-col-lg-6 fr-col-xl-4"
      >
        <StatsBeneficiariesAccommodationMode
          :beneficiary-count="beneficiaryCount"
          :filters="filters"
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
        <StatsBeneficiariesMobility
          :beneficiary-count="beneficiaryCount"
          :filters="filters"
        />
      </div>
      <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
        <StatsBeneficiariesCSP
          :beneficiary-count="beneficiaryCount"
          :filters="filters"
        />
      </div>
      <template v-if="isMinistryAgent">
        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsBeneficiariesMinistereStructure
            :beneficiary-count="beneficiaryCount"
            :filters="filters"
          />
        </div>
        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsBeneficiariesMinistereDepartementService
            :beneficiary-count="beneficiaryCount"
            :filters="filters"
          />
        </div>
        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-4">
          <StatsBeneficiariesMinistereCategorie
            :beneficiary-count="beneficiaryCount"
            :filters="filters"
          />
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { AlertType } from '~~/utils/constants/alert'
  import { Options } from '~/utils/options'
  import { StatFilterInput } from '~/server/schema'
  import { canExportStats } from '~/server/security/rules/export'
  import { useAuthStore } from '~/store/auth'
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
</script>
