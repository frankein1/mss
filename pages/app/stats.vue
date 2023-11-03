<template>
  <PageContainer>
    <DsfrBreadcrumb :links="Breadcrumb.AppStats()" />
    <PageTitle :title="title" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <AtomTabs tab-list-name="Statistiques de la structure">
          <AtomTab
            tab-id="Beneficiaires"
            title="Bénéficiaires"
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
          </AtomTab>
          <AtomTab
            tab-id="Accompagnements"
            title="Accompagnements"
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
          </AtomTab>
        </AtomTabs>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { AlertType } from '~/utils/constants/alert'
  import { hasDefinedCity } from '~/utils/beneficiary/hasDefinedCity'
  import { Breadcrumb, RouteTitle } from '~/utils/routing'

  const title = RouteTitle.AppStats()

  useHead({ title })

  const trpcClient = useTrpcClient()

  const { data: followupTypesOptions, error: followupTypesOptionsError } =
    await trpcClient.config.getStructureFollowupTypes.useQuery(
      {},
      {
        transform: followupTypes => toOptions(followupTypes, 'id', 'name'),
        queryKey: 'config.getStructureFollowupTypes.options'
      }
    )

  const {
    data: beneficiariesCitiesOptions,
    error: beneficiariesCitiesOptionsError
  } = await trpcClient.config.getBeneficiariesCities.useQuery(
    {},
    {
      transform: beneficiariesCities => {
        const definedCities = beneficiariesCities.filter(hasDefinedCity)
        return toOptions(definedCities, 'city', 'city')
      }
    }
  )

  const { data: agentsOptions, error: agentsOptionsError } =
    await trpcClient.config.getAgents.useQuery(
      {},
      {
        transform: agents => withEmptyValue(toOptions(agents, 'id', 'name')),
        queryKey: 'config.getAgents.options'
      }
    )

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
