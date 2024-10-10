<template>
  <DsfrTabs
    ref="tabs"
    v-model="activeTab"
    tab-list-name="Détails du dossier foyer"
    @select-tab="resizetab"
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

    <slot />
  </DsfrTabs>
</template>

<script setup lang="ts">
  import type { DsfrTabsProps } from '@gouvminint/vue-dsfr'
  import { DsfrTabs } from '@gouvminint/vue-dsfr'

  defineProps<Pick<DsfrTabsProps, 'tabListName' | 'tabTitles'>>()

  const activeTab = ref(0)
  const tabs = ref<InstanceType<typeof DsfrTabs> | null>(null)

  function resizetab() {
    if (tabs.value) {
      tabs.value.renderTabs()
    }
  }
</script>
