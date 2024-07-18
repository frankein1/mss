<template>
  <PageContainer no-max-width>
    <AtomBreadcrumb />
    <!-- <DsfrBreadcrumb :links="Breadcrumb.AppStats()" /> -->
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
                socialSupportSubjectOptions &&
                beneficiariesCitiesOptions &&
                agentsOptions
              "
              :social-support-subject-options="socialSupportSubjectOptions"
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
                socialSupportSubjectOptions &&
                beneficiariesCitiesOptions &&
                agentsOptions
              "
              :social-support-subject-options="socialSupportSubjectOptions"
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
  import { RouteTitle } from '~/utils/routing'

  const title = RouteTitle.AppStats()

  useHead({ title })

  const trpcClient = useTrpcClient()

  const {
    data: socialSupportSubjectOptions,
    error: socialSupportSubjectOptionsError
  } = await trpcClient.structure.getSocialSupportSubjects.useQuery(undefined, {
    transform: socialSupportSubject =>
      toOptions(socialSupportSubject, 'id', 'name'),
    queryKey: 'structure.getSocialSupportSubjects.options'
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
      transform: agents => withEmptyValue(toOptions(agents, 'id', 'name')),
      queryKey: 'config.getAgents.options'
    })

  const fetchError = computed(() => {
    if (socialSupportSubjectOptionsError.value) {
      return "La liste des objets d'accompagnement n'a pas pu être chargée."
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
