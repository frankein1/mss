<template>
  <PageContainer no-max-width>
    <AtomBreadcrumb />
    <!-- <DsfrBreadcrumb :links="Breadcrumb.AppHistory()" /> -->
    <PageTitle :title="title" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <AtomTabs tab-list-name="Accompagnements">
          <AtomTab
            :tab-id="HistoryTab.Followups"
            title="Entretiens"
            selected
            icon="fr-icon-draft-fill"
          >
            <Followups />
          </AtomTab>
          <AtomTab
            :tab-id="HistoryTab.FileInstructions"
            title="Dossiers d'instruction"
            icon="fr-icon-questionnaire-fill"
          >
            <FileInstructions />
          </AtomTab>
        </AtomTabs>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { HistoryTab } from '~/utils/constants/history'
  import { routes } from '~/routes'

  const title = routes.beneficiary.AppHistory.title

  useHead({ title })
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
