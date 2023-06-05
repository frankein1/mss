<template>
  <PageContainer>
    <PageTitle title="Accompagnements" />
    <div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
      <div class="fr-col-12">
        <AtomTabs>
          <Tab
            :id="HistoryTab.Followups"
            name="Entretiens"
          >
            <Followups />
          </Tab>
          <Tab
            :id="HistoryTab.HelpRequests"
            name="Demandes d'aide"
          >
            <HelpRequests />
          </Tab>
        </AtomTabs>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
  import { Tab } from 'vue3-tabs-component'
  import { HistoryTab } from '~/utils/constants/history'
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

  :deep(.table-container) {
    /* 21.5rem seems to come up out of the box. It corresponds to the total height of elements existing above and under the table */
    max-height: calc(100vh - 23.5rem);
  }
</style>
