<template>
  <div
    :id="panelId(tabId)"
    class="fr-tabs__panel"
    :class="{ 'fr-tabs__panel--selected': selected }"
    role="tabpanel"
    :aria-labelledby="tabId"
    tabindex="0"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { panelId } from '~/utils/tab'

  withDefaults(
    defineProps<{
      tabId: string
      title: string
      icon?: string
      selected?: boolean
    }>(),
    { selected: false, icon: undefined }
  )
</script>

<style scoped lang="scss">
  .fr-tabs__panel {
    padding: 1rem 0 0;

    /*
   * The wrapping tab group is set to overflow hidden to allow the transition between tabs.
   * This causes menus of dropdowns to be cropped at the bottom of the tab panel if there is not enough height.
   * A solution would be to set the tab group to overflow-x hidden and to overflow-y visible but W3C specs leads to a weird result : the visible value is turn into auto.
   * This is a hack to allow all menus of dropdowns within tabs to be visible.
   */
    min-height: var(--tabs-panel-min-height);
  }
</style>
