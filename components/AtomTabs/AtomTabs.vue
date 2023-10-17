<template>
  <div
    ref="$el"
    class="fr-tabs fr-transition-none"
  >
    <ul
      class="fr-tabs__list"
      role="tablist"
      :aria-label="tabListName"
    >
      <li
        v-for="(tab, index) in tabs"
        :key="tab.tabId"
        role="presentation"
      >
        <a
          :id="tab.tabId"
          class="fr-tabs__tab"
          :class="[tab.icon ? `fr-tabs__tab--icon-left ${tab.icon}` : '']"
          :tabindex="index === initiallySelectedIndex ? 0 : -1"
          role="tab"
          :aria-selected="index === initiallySelectedIndex"
          :aria-controls="panelId(tab.tabId)"
          :href="tabHref(tab.tabId)"
        >
          {{ tab.title }}
        </a>
      </li>
    </ul>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { remToPx } from '~/utils/remToPx'
  import { panelId } from '~/utils/tab'

  defineProps<{
    tabListName: string
  }>()

  // DSFR handles by itself the update of the selected tab. This ref allows to reinitialise the selected tab
  const initiallySelectedIndex = ref(0)
  const tabsPanelMinHeight = ref('30rem')
  const $el = ref<HTMLDivElement | null>(null)

  const slots = useSlots()

  const tabs = computed(() => {
    if (!slots.default) {
      return []
    }

    return slots
      .default()
      .filter(({ props }) => !!props && 'tab-id' in props && 'title' in props)
      .map(({ props }) => ({
        tabId: props?.['tab-id'],
        title: props?.title,
        icon: props?.icon
      }))
  })

  onMounted(() => {
    // Enable navigating between tabs
    window.addEventListener('hashchange', onHashChange)

    onHashChange()
    setTabsPanelMinHeight()
  })

  onUnmounted(() => {
    window.removeEventListener('hashchange', onHashChange)
  })

  function onHashChange() {
    /**
     * Use window.location.hash instead of route.hash as route.hash is weirdly
     * not up to date when the hashchange event is called, on Chrome browsers
     * only
     */
    const hash = window.location.hash
    if (hash) {
      onSelectTab(hash.slice(1))
    }
  }

  function setTabsPanelMinHeight() {
    // This hack prevents a disturbing scroll on panel change due to the changing tab height
    if ($el.value) {
      const tabPanels = Array.from(
        $el.value.querySelectorAll<HTMLDivElement>('.fr-tabs__panel')
      )
      const panelMaxHeight = tabPanels.reduce((maxHeight, panel) => {
        const panelHeight = panel.offsetHeight
        return panelHeight > maxHeight ? panelHeight : maxHeight
      }, remToPx(30))
      tabsPanelMinHeight.value = `${panelMaxHeight}px`
    }
  }

  function onSelectTab(tabId: string) {
    const tabIndex = tabs.value.findIndex(tab => tab.tabId === tabId)

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
    --tabs-panel-min-height: v-bind('tabsPanelMinHeight');

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

    background-image: none;
    border: 1px solid var(--border-default-grey);
    border-bottom: 3px solid var(--primary);
  }
</style>
