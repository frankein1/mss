<template>
  <PageContainer no-max-width>
    <AtomBreadcrumb :links="breadcrumbs.stats.AppStats()" />
    <PageTitle :title="title" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <DsfrTabs
          ref="tabs"
          tab-list-name="Statistiques de la structure"
          :tab-titles="[
            { title: 'Bénéficiaires' },
            { title: 'Accompagnements' }
          ]"
          :initial-selected-index="initialSelectedIndex"
          @select-tab="selectTab"
        >
          <DsfrTabContent
            panel-id="beneficiary-tab-content"
            tab-id="beneficiary-tab"
            :selected="selectedTabIndex === 0"
          >
            <h2 class="r-sr-only">Beneficiaires</h2>
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
          </DsfrTabContent>
          <DsfrTabContent
            panel-id="history-tab-content"
            tab-id="history-tab"
            :selected="selectedTabIndex === 1"
          >
            <h2 class="r-sr-only">Accompagnements</h2>
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
          </DsfrTabContent>
        </DsfrTabs>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { toOptions, withEmptyValue } from '~/utils/options'
  import { AlertType } from '~/utils/constants/alert'
  import { hasDefinedCity } from '~/utils/beneficiary/hasDefinedCity'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const title = routes.stats.AppStats.title

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

  // tabs
  const initialSelectedIndex = 0
  const selectedTabIndex = ref(initialSelectedIndex)
  const asc = ref(true)

  const selectTab = (idx: number) => {
    asc.value = selectedTabIndex.value < idx
    selectedTabIndex.value = idx
  }
</script>

<style scoped>
  :deep(.main-container) {
    min-height: 100%;
  }
</style>
