<template>
  <div class="fr-tabs fr-transition-none">
    <ul
      class="fr-tabs__list"
      role="tablist"
      :aria-label="tabListName"
    >
      <li
        v-for="(tabTitle, index) in tabTitles"
        :key="tabTitle.tabId"
        role="presentation"
      >
        <a
          :id="tabTitle.tabId"
          class="fr-tabs__tab"
          :class="[
            tabTitle.icon ? `fr-tabs__tab--icon-left ${tabTitle.icon}` : ''
          ]"
          :tabindex="index === initiallySelectedIndex ? 0 : -1"
          role="tab"
          :aria-selected="index === initiallySelectedIndex"
          :aria-controls="tabTitle.panelId"
          :href="tabHref(tabTitle.tabId)"
        >
          {{ tabTitle.title }}
        </a>
      </li>
    </ul>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  type TabTitle = {
    title: string
    panelId: string
    tabId: string
    icon?: string
  }

  const props = defineProps<{
    tabListName: string
    tabTitles: TabTitle[]
  }>()

  const route = useRoute()

  // DSFR handles by itself the update of the selected tab. This ref allows to reinitialise the selected tab
  const initiallySelectedIndex = ref(0)

  onMounted(() => {
    // Enable navigating between tabs
    window.addEventListener('hashchange', () => {
      onSelectTab(window.location.hash.slice(1))
    })

    if (route.hash) {
      onSelectTab(route.hash.slice(1))
    }
  })

  function onSelectTab(tabId: string) {
    const tabIndex = props.tabTitles.findIndex(
      tabTitle => tabTitle.tabId === tabId
    )

    if (tabIndex === -1) {
      return
    }

    initiallySelectedIndex.value = tabIndex
  }

  function tabHref(tabId: string) {
    return `#${tabId}`
  }
</script>

<style lang="scss" scoped>
  .fr-tabs {
    box-shadow: none;
  }

  .fr-tabs::before {
    box-shadow: inset 0 1px 0 0 var(--border-default-grey);
  }

  .fr-tabs__tab {
    box-shadow: none;
    background-image: none;
    border-bottom: 1px solid var(--border-default-grey);
    border-radius: 0.5rem 0.5rem 0 0;
  }

  .fr-tabs__tab[aria-selected='true'] {
    --text-active-blue-france: var(--primary);

    border: 1px solid var(--border-default-grey);
    border-bottom: 3px solid var(--primary);
  }
</style>
