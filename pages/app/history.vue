<template>
  <PageContainer no-max-width>
    <AtomBreadcrumb :links="breadcrumbs.file.AppHistory()" />
    <PageTitle :title="title" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <DsfrTabs
          ref="tabs"
          tab-list-name="Statistiques de la structure"
          :tab-titles="[
            { title: 'Entretiens', icon: 'fr-icon-draft-fill' },
            {
              title: 'Dossiers d’instruction',
              icon: 'fr-icon-questionnaire-fill'
            }
          ]"
          :initial-selected-index="initialSelectedIndex"
          @select-tab="selectTab"
        >
          <DsfrTabContent
            panel-id="followup-tab-content"
            tab-id="followup-tab"
            :selected="selectedTabIndex === 0"
          >
            <h2 class="fr-sr-only">Entretiens</h2>
            <Followups />
          </DsfrTabContent>
          <DsfrTabContent
            panel-id="fileinstruction-tab-content"
            tab-id="fileinstruction-tab"
            :selected="selectedTabIndex === 1"
          >
            <h2 class="fr-sr-only">Dossiers d'instruction</h2>
            <FileInstructions />
          </DsfrTabContent>
        </DsfrTabs>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  const title = routes.file.AppHistory.title

  useHead({ title })

  // tabs
  const initialSelectedIndex = 0

  const asc = ref(true)
  const selectedTabIndex = ref(initialSelectedIndex)

  const selectTab = (idx: number) => {
    asc.value = selectedTabIndex.value < idx
    selectedTabIndex.value = idx
  }
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
