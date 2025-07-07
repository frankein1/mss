<template>
  <div>
    <PageContainer>
      <AtomBreadcrumb :links="breadcrumbs.workshop.AppWorkshops()" />

      <div class="page-title-container">
        <PageTitle
          :title="title"
          no-margin
        />
        <NuxtLink
          :to="routes.workshop.AppWorkshopAdd.path()"
          class="fr-btn fr-btn--icon-left fr-icon-add-line"
        >
          Créer un atelier
        </NuxtLink>
      </div>
      <AtomTabs
        tab-list-name="Liste des ateliers"
        :tab-titles="tabTitles"
        :heading-level="2"
      >
        <template #[tabTitles.at(0)?.panelId]>
          <WorkshopList />
        </template>
        <template #[tabTitles.at(1)?.panelId]>
          <WorkshopList :period="FilterWorkshopPeriod.Past" />
        </template>
      </AtomTabs>
    </PageContainer>
  </div>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'
  import { FilterWorkshopPeriod } from '~/utils/constants/filters'

  const title = routes.workshop.AppWorkshops.title
  useHead({ title })

  const tabTitles = [
    {
      tabId: 'UpcomingWorkshops',
      panelId: 'UpcomingWorkshops',
      title: 'Ateliers à venir'
    },
    {
      tabId: 'PassedWorkshops',
      panelId: 'PassedWorkshops',
      title: 'Ateliers passés'
    }
  ]
</script>

<style scoped lang="scss">
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .page-title-container {
    display: flex;
    gap: 1rem;
    flex-direction: column;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 2rem;

    @include dsfr-media-query.respond-from('md') {
      flex-direction: row;
    }

    .fr-btn {
      min-width: fit-content;
      max-width: fit-content;
    }
  }
</style>
