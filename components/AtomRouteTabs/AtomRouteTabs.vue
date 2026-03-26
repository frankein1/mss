<template>
  <DsfrTabs
    v-model="model"
    :tab-list-name="tabListName"
    :tab-titles
  >
    <template #tab-items>
      <DsfrTabItem
        v-for="(tab, index) of tabTitles"
        :key="index"
        :tab-id="tab.tabId"
        :panel-id="tab.panelId"
        @click="model = index"
        @next="selectNext()"
        @previous="selectPrevious()"
        @first="selectFirst()"
        @last="selectLast()"
      >
        <span :class="`fr-tabs__tab--icon-left ${tab.icon}`"></span>
        <span
          v-if="model == index && headingLevel"
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
      <slot />
    </DsfrTabContent>
  </DsfrTabs>
</template>

<script lang="ts" setup>
  import type { DsfrTabItemProps } from '@gouvminint/vue-dsfr'
  import { DsfrTabs } from '@gouvminint/vue-dsfr'

  const props = withDefaults(
    defineProps<{
      tabTitles?: (DsfrTabItemProps & { title: string })[]
      tabListName?: string
      headingLevel?: 1 | 2 | 3 | 4 | 5 | 6 | null
    }>(),
    { tabTitles: () => [], tabListName: '', headingLevel: null }
  )

  const model = defineModel<number>({ required: true })

  const activeTabContent = computed(() => props.tabTitles[model.value])

  const selectPrevious = () => {
    model.value =
      model.value === 0 ? props.tabTitles.length - 1 : model.value - 1
  }
  const selectNext = () => {
    model.value =
      model.value === props.tabTitles.length - 1 ? 0 : model.value + 1
  }
  const selectFirst = () => {
    model.value = 0
  }
  const selectLast = () => {
    model.value = props.tabTitles.length - 1
  }
</script>
