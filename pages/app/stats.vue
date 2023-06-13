<template>
  <PageContainer>
    <PageBreadcrumb :links="Breadcrumb.Stats()" />
    <PageTitle :route="Route.Stats" />
    <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
      <div class="fr-col-12">
        <AtomTabs>
          <Tab name="Bénéficiaires">
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
          </Tab>
          <Tab name="Accompagnements">
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
          </Tab>
        </AtomTabs>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { Tab } from 'vue3-tabs-component'
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { AlertType } from '~/utils/constants/alert'
  import { hasDefinedCity } from '~/utils/beneficiary/hasDefinedCity'
  import { Route, Breadcrumb } from '~/utils/routing'

  // TODO
  // definePageMeta({
  //   middleware: 'can-access-stats'
  // })

  const trpcClient = useTrpcClient()

  // FIXME: For now, trpc-nuxt does not allow to define query key, and their defined key is not based on the transform option
  const { data: followupTypesOptions, error: followupTypesOptionsError } =
    await useAsyncData(
      'config.getStructureFollowupTypes.options',
      () => trpcClient.config.getStructureFollowupTypes.query(),
      {
        transform: followupTypes => toOptions(followupTypes, 'id', 'name')
      }
    )

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
