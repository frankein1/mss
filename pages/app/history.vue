<template>
  <PageContainer no-max-width>
    <AtomBreadcrumb :links="breadcrumbs.file.AppHistory()" />
    <PageTitle :title="title" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <AtomTabs
          tab-list-name="Accompagnements"
          :tab-titles="tabTitles"
          :heading-level="2"
        >
          <template #[tabTitles.at(0)?.panelId]>
            <Followups />
          </template>
          <template #[tabTitles.at(1)?.panelId]>
            <FileInstructions />
          </template>
        </AtomTabs>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { HistoryTab } from '~/utils/constants/history'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const title = routes.file.AppHistory.title

  useHead({ title })

  const tabTitles = [
    {
      tabId: HistoryTab.Followups,
      panelId: panelId(HistoryTab.Followups),
      title: 'Entretiens',
      icon: 'fr-icon-draft-line'
    },
    {
      tabId: HistoryTab.FileInstructions,
      panelId: panelId(HistoryTab.FileInstructions),
      title: "Dossiers d'instruction",
      icon: 'fr-icon-questionnaire-line'
    }
  ]
</script>

<style scoped>
  #followups-tab {
    color: var(--color-followup);
  }

  #followups-tab[aria-selected='true'] {
    border-color: var(--color-followup);
  }

  #help-requests-tab {
    color: var(--color-help-request);
  }

  #help-requests-tab[aria-selected='true'] {
    border-color: var(--color-help-request);
  }
</style>
