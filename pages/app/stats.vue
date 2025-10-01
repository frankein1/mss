<template>
  <PageContainer no-max-width>
    <AtomBreadcrumb :links="breadcrumbs.stats.AppStats()" />
    <PageTitle :title="title" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <AtomTabs
          class="stats-tabs"
          tab-list-name="Statistiques de la structure"
          :tab-titles="tabTitles"
          :heading-level="2"
        >
          <template #[tabTitles.at(0)?.panelId]>
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
          </template>
          <template #[tabTitles.at(1)?.panelId]>
            <AtomAlert
              v-if="fetchError"
              :alert-type="AlertType.Error"
              :message="fetchError"
            />
            <StatsFollowup
              v-if="
                socialSupportSubjectOptions &&
                beneficiariesCitiesOptions &&
                agentsOptions
              "
              :social-support-subject-options="socialSupportSubjectOptions"
              :beneficiaries-cities-options="beneficiariesCitiesOptions"
              :agent-options="agentsOptions"
            />
          </template>
          <template #[tabTitles.at(2)?.panelId]>
            <AtomAlert
              v-if="fetchError"
              :alert-type="AlertType.Error"
              :message="fetchError"
            />
            <StatsHelpRequest
              v-if="
                socialSupportSubjectOptions &&
                beneficiariesCitiesOptions &&
                agentsOptions
              "
              :social-support-subject-options="socialSupportSubjectOptions"
              :beneficiaries-cities-options="beneficiariesCitiesOptions"
              :agent-options="agentsOptions"
            />
          </template>
          <template #[tabTitles.at(3)?.panelId]>
            <AtomAlert
              v-if="fetchError"
              :alert-type="AlertType.Error"
              :message="fetchError"
            />
            <StatsWorkshops
              v-if="
                socialSupportSubjectOptions &&
                beneficiariesCitiesOptions &&
                agentsOptions
              "
              :social-support-subject-options="socialSupportSubjectOptions"
              :beneficiaries-cities-options="beneficiariesCitiesOptions"
              :agent-options="agentsOptions"
            />
          </template>
        </AtomTabs>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { toOptions } from '~/utils/options'
  import { AlertType } from '~/utils/constants/alert'
  import { hasDefinedCity } from '~/utils/beneficiary/hasDefinedCity'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const title = routes.stats.AppStats.title

  useHead({ title })

  const tabTitles = [
    {
      tabId: 'Beneficiaires',
      panelId: panelId('Beneficiaires'),
      title: 'Bénéficiaires',
      icon: 'fr-icon-user-line'
    },
    {
      tabId: 'Entretiens',
      panelId: panelId('Entretients'),
      title: "Synthèses d'entretiens",
      icon: 'fr-icon-draft-line'
    },
    {
      tabId: 'Instructions',
      panelId: panelId('Instructions'),
      title: 'Instructions de dossiers',
      icon: 'fr-icon-questionnaire-line'
    },
    {
      tabId: 'Ateliers',
      panelId: panelId('Ateliers'),
      title: 'Ateliers',
      icon: 'fr-icon-calendar-line'
    }
  ]

  const trpcClient = useTrpcClient()

  const {
    data: socialSupportSubjectOptions,
    error: socialSupportSubjectOptionsError
  } = await trpcClient.structure.getActiveOrUsedSocialSupportSubjects.useQuery(
    undefined,
    {
      transform: socialSupportSubject =>
        toOptions(socialSupportSubject, 'id', 'name'),
      queryKey: 'structure.getActiveOrUsedSocialSupportSubjects.options'
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
      transform: agents => toOptions(agents, 'id', 'name'),
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

  /* Tab height computing does not take into account multiselect dropdown height
  A min height is necessary to fully display the multiselect in all cases.
  This is overloaded from tab.scss to take into account the position of the multiselect in
  the stat panel */
  :deep(.fr-tabs__panel) {
    min-height: 36.5rem;
  }

  .stats-tabs {
    height: calc(var(--tabs-height) + 30px);
  }
</style>
