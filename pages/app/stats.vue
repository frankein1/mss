<template>
  <div class="fr-container fr-p-5w">
    <TheHeader title="Statistiques" />
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
              :follow-up-type-options="followUpTypesOptions"
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
            <!-- <AtomAlert
              v-if="fetchError"
              :alert-type="AlertType.Error"
              :message="fetchError"
            />
            <StatsHistory
              :follow-up-type-options="followUpTypes"
              :beneficiaries-cities-options="beneficiariesCitiesOptions"
              :agent-options="agentOptions"
            /> -->
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { AlertType } from '~/utils/constants/alert'

  // definePageMeta({ middleware: 'can-access-stats' })

  const trpcClient = useTrpcClient()

  const { data: followUpTypes, error: followUpTypesError } =
    await trpcClient.config.getStructureFollowupTypes.useQuery()

  const { data: beneficiariesCities, error: beneficiariesCitiesError } =
    await trpcClient.config.getBeneficiariesCities.useQuery()

  const { data: agents, error: agentsError } =
    await trpcClient.config.getAgents.useQuery()

  const fetchError = computed(() => {
    if (followUpTypesError.value) {
      return "La liste des types d'accompagnement n'a pas pu être chargée."
    }
    if (beneficiariesCitiesError.value) {
      return "La liste des villes n'a pas pu être chargée."
    }
    if (agentsError.value) {
      return "La liste des référents n'a pas pu être chargée."
    }
    return ''
  })

  const followUpTypesOptions = computed(() =>
    followUpTypes.value
      ? toOptions(followUpTypes.value, 'id', 'name')
      : undefined
  )
  const beneficiariesCitiesOptions = computed(() => {
    const definedBeneficiariesCities =
      beneficiariesCities.value?.filter(hasDefinedCity)
    return definedBeneficiariesCities
      ? toOptions(definedBeneficiariesCities, 'city', 'city')
      : undefined
  })
  const agentsOptions = computed(() =>
    agents.value
      ? withEmptyValue(toOptions(agents.value, 'id', 'name'))
      : undefined
  )

  function hasDefinedCity(b: { city: string | null }): b is { city: string } {
    return b.city !== null
  }
</script>

<style scoped>
  ::v-deep .main-container {
    min-height: 100%;
  }
</style>
