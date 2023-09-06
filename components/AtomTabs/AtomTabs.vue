<template>
  <Tabs
    wrapper-class="main-container fr-tabs fr-transition-none"
    nav-class="fr-tabs__list"
    nav-item-link-class="fr-tabs__tab"
    panels-wrapper-class="fr-tabs__panel"
    ><slot></slot>
  </Tabs>
</template>

<script setup lang="ts">
  import { Tabs } from 'vue3-tabs-component'
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;

  $tabs-list-height: 4.5rem;
  $tabs-list-border-bottom-size: 1px;
  $tab-border-bottom-size: 3px;

  .fr-tabs {
    margin-top: 0;
    padding-top: 0;

    &::before {
      box-shadow: none;
    }
  }

  :deep(.fr-tabs__panel) {
    padding: 1.5rem;
  }

  :deep(.fr-tabs__list) {
    margin: 0;
    min-height: $tabs-list-height;
    padding: 0;
    border-bottom: $tabs-list-border-bottom-size solid
      var(--border-default-grey);
  }

  :deep(.fr-tabs__tab) {
    font-size: 1.125rem;
    padding: 1.5rem 2rem;
    margin: 0;
    border-bottom: $tab-border-bottom-size solid
      var(--border-active-blue-france);

    &[aria-selected='true'] {
      background-size: 0;
    }

    &:not([aria-selected='true']) {
      --background-action-low-blue-france: #fff;
      --hover: var(--background-default-grey-hover);
      --active: var(--background-default-grey-active);

      background-size: 0;
      color: var(--text-disabled-grey);
      border-bottom-color: transparent;
    }

    &::after {
      content: none;
    }
  }

  // Fix an empty tab blinking and allow to focus element between tabs
  :deep(.fr-tabs__panel:not(.fr-tabs__panel--selected)) {
    visibility: initial;
  }
</style>
