<template>
  <DsfrTabs
    v-model="activeTab"
    tab-list-name="Détails du dossier foyer"
    :tab-titles
  >
    <template #tab-items>
      <DsfrTabItem
        v-for="(tab, index) of tabTitles"
        :key="index"
        :tab-id="tab.tabId"
        :panel-id="tab.panelId"
        @click="activeTab = index"
        @next="selectNext()"
        @previous="selectPrevious()"
        @first="selectFirst()"
        @last="selectLast()"
      >
        <span :class="`fr-tabs__tab--icon-left ${tab.icon}`"></span>
        <span
          v-if="activeTab == index && headingLevel"
          role="heading"
          :aria-level="headingLevel"
          >{{ tab.title }}</span
        >
        <template v-else>{{ tab.title }}</template>
      </DsfrTabItem>
    </template>

    <DsfrTabContent
      v-if="activeTabContent"
      :panel-id="activeTabContent.panelId"
      :tab-id="activeTabContent.tabId"
      class="fr-transition-none"
    >
      <slot :name="activeTabContent.panelId" />
    </DsfrTabContent>
  </DsfrTabs>
</template>

<script setup lang="ts">
  import type { DsfrTabItemProps } from '@gouvminint/vue-dsfr'
  import { DsfrTabs } from '@gouvminint/vue-dsfr'

  const props = withDefaults(
    defineProps<{
      tabTitles?: (DsfrTabItemProps & { title: string })[]
      headingLevel?: 1 | 2 | 3 | 4 | 5 | 6 | null
    }>(),
    { tabTitles: () => [], headingLevel: null }
  )

  const activeTab = ref(0)
  const activeTabContent = computed(() => props.tabTitles[activeTab.value])

  const selectPrevious = async () => {
    const newIndex =
      activeTab.value === 0 ? props.tabTitles.length - 1 : activeTab.value - 1
    activeTab.value = newIndex
  }
  const selectNext = async () => {
    const newIndex =
      activeTab.value === props.tabTitles.length - 1 ? 0 : activeTab.value + 1
    activeTab.value = newIndex
  }
  const selectFirst = async () => {
    activeTab.value = 0
  }
  const selectLast = async () => {
    activeTab.value = props.tabTitles.length - 1
  }

  function setActiveTabFromUrl() {
    const route = useRoute()
    const initialTabName = route.hash.slice(1)
    const initialTabIndex = props.tabTitles.findIndex(
      el => el.tabId === initialTabName
    )
    if (initialTabIndex >= 0) {
      activeTab.value = initialTabIndex
    }
  }
  setActiveTabFromUrl()
</script>
