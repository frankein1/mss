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
