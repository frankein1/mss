<template>
  <div class="fr-container fr-p-5w">
    <TheHeader title="Accompagnements" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <main
          ref="tabsGroup"
          class="main-container fr-tabs"
        >
          <ul
            class="fr-tabs__list"
            role="tablist"
            aria-label="Accompagnements"
          >
            <li role="presentation">
              <button
                id="followups-tab"
                class="fr-tabs__tab"
                tabindex="0"
                role="tab"
                aria-selected="true"
                aria-controls="followups-panel"
              >
                Entretiens
              </button>
            </li>
            <li role="presentation">
              <button
                id="help-requests-tab"
                class="fr-tabs__tab"
                tabindex="0"
                role="tab"
                aria-selected="true"
                aria-controls="help-requests-panel"
              >
                Demandes d'aide
              </button>
            </li>
          </ul>

          <FollowupsTabPanel />
          <HelpRequestsTabPanel />
        </main>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { focusTab } from '~/utils/tab'
  import { HistoryTab, IndexedHistoryTabs } from '~/utils/constants/history'

  const route = useRoute()

  const tabsGroup = ref<HTMLDivElement | null>(null)

  onMounted(async () => {
    if (tabsGroup.value) {
      await nextTick()
      const { tab } = route.query
      if (tab) {
        focusTab(tab.toString(), tabsGroup.value, IndexedHistoryTabs)
      } else {
        focusTab(HistoryTab.Followups, tabsGroup.value, IndexedHistoryTabs)
      }
    }
  })
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
