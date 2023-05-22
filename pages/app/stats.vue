<template>
  <PageContainer>
    <PageTitle title="Statistiques" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <main class="main-container fr-tabs">
          <ul
            class="fr-tabs__list"
            role="tablist"
            aria-label="Statistiques"
          >
            <li role="presentation">
              <button
                id="beneficiaries-tab"
                class="fr-tabs__tab"
                tabindex="0"
                role="tab"
                aria-selected="true"
                aria-controls="beneficiaries-panel"
              >
                Bénéficiaires
              </button>
            </li>
            <li role="presentation">
              <button
                id="history-tab"
                class="fr-tabs__tab"
                tabindex="0"
                role="tab"
                aria-selected="false"
                aria-controls="history-panel"
              >
                Accompagnements
              </button>
            </li>
          </ul>

          <div
            id="beneficiaries-panel"
            class="fr-tabs__panel fr-tabs__panel--selected fr-px-0"
            role="tabpanel"
            aria-labelledby="beneficiaries-tab"
            tabindex="0"
          >
            <AtomAlert
              v-if="fetchError"
              :alert-type="AlertType.Error"
              :message="fetchError"
            />
            <StatsBeneficiaries
              v-if="
                followupTypesOptions &&
                beneficiariesCitiesOptions &&
                agentsOptions
              "
              :followup-type-options="followupTypesOptions"
              :beneficiaries-cities-options="beneficiariesCitiesOptions"
              :agent-options="agentsOptions"
            />
          </div>
          <div
            id="history-panel"
            class="fr-tabs__panel fr-tabs__panel--selected fr-px-0"
            role="tabpanel"
            aria-labelledby="history-tab"
            tabindex="0"
          >
            <AtomAlert
              v-if="fetchError"
              :alert-type="AlertType.Error"
              :message="fetchError"
            />
            <StatsHistory
              v-if="
                followupTypesOptions &&
                beneficiariesCitiesOptions &&
                agentsOptions
              "
              :followup-type-options="followupTypesOptions"
              :beneficiaries-cities-options="beneficiariesCitiesOptions"
              :agent-options="agentsOptions"
            />
          </div>
        </main>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { AlertType } from '~/utils/constants/alert'
  import { hasDefinedCity } from '~/utils/beneficiary/hasDefinedCity'

  // definePageMeta({ middleware: 'can-access-stats' })

  const trpcClient = useTrpcClient()

  const { data: followupTypesOptions, error: followupTypesOptionsError } =
    await trpcClient.config.getStructureFollowupTypes.useQuery(undefined, {
      transform: followupTypes => toOptions(followupTypes, 'id', 'name')
    })

  const {
    data: beneficiariesCitiesOptions,
    error: beneficiariesCitiesOptionsError
  } = await trpcClient.config.getBeneficiariesCities.useQuery(undefined, {
    transform: beneficiariesCities => {
      const definedCities = beneficiariesCities.filter(hasDefinedCity)
      return toOptions(definedCities, 'city', 'city')
    }
  })

  const { data: agentsOptions, error: agentsOptionsError } =
    await trpcClient.config.getAgents.useQuery(undefined, {
      transform: agents => withEmptyValue(toOptions(agents, 'id', 'name'))
    })

  const fetchError = computed(() => {
    if (followupTypesOptionsError.value) {
      return "La liste des types d'accompagnement n'a pas pu être chargée."
    }
    if (beneficiariesCitiesOptionsError.value) {
      return "La liste des villes n'a pas pu être chargée."
    }
    if (agentsOptionsError.value) {
      return "La liste des référents n'a pas pu être chargée."
    }
    return ''
  })
</script>

<style scoped>
  :deep(.main-container) {
    min-height: 100%;
  }
</style>
