<template>
  <DsfrTabs
    ref="tabs"
    v-model="activeTab"
    tab-list-name="Détails du dossier foyer"
    @select-tab="onTabChange"
  >
    <template #tab-items>
      <DsfrTabItem
        v-for="(tab, index) of tabTitles"
        :key="index"
        :tab-id="tab.tabId"
        :panel-id="tab.panelId"
        @click="activeTab = index"
      >
        <span :class="`fr-tabs__tab--icon-left ${tab.icon}`"></span>
        {{ tab.title }}
      </DsfrTabItem>
    </template>

    <DsfrTabContent
      v-for="(tab, index) of tabTitles"
      :key="index"
      class="fr-transition-none"
      :panel-id="tab.panelId"
      :tab-id="tab.tabId"
    >
      <slot :name="tab.panelId" />
    </DsfrTabContent>
  </DsfrTabs>
</template>

<script setup lang="ts">
  import type { DsfrTabsProps } from '@gouvminint/vue-dsfr'
  import { DsfrTabs } from '@gouvminint/vue-dsfr'

  const props = defineProps<Pick<DsfrTabsProps, 'tabListName' | 'tabTitles'>>()

  const activeTab = ref(0)
  const tabs = ref<InstanceType<typeof DsfrTabs> | null>(null)

  function onTabChange() {
    if (tabs.value) {
      tabs.value.renderTabs()
    }
  }

  function setActiveTabFromUrl() {
    const initialTabName = window.location.hash.slice(1)
    const initialTabIndex = props.tabTitles.findIndex(
      el => el.tabId === initialTabName
    )
    if (initialTabIndex >= 0) {
      activeTab.value = initialTabIndex
    }
  }

  if (import.meta.client) {
    setActiveTabFromUrl()
  }
</script>
