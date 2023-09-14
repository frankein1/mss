<template>
  <Tabs
    wrapper-class="fr-tabs fr-transition-none"
    nav-class="fr-tabs__list fr-tabs__list"
    nav-item-link-class="fr-tabs__tab fr-text fr-text--bold"
    panels-wrapper-class="fr-tabs__panel"
    ><slot></slot>
  </Tabs>
</template>

<script setup lang="ts">
  import { Tabs } from 'vue3-tabs-component'
</script>

<style lang="scss" scoped>
  :deep(.fr-tabs__panel) {
    padding: 1rem !important;
  }
</style>
