<template>
  <div
    :id="panelId"
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
  withDefaults(
    defineProps<{
      tabId: string
      panelId: string
      selected?: boolean
    }>(),
    { selected: false }
  )
</script>

<style scoped lang="scss">
  .fr-tabs__panel {
    // FIXME: After updating all contents inside AtomTabV2, this may no longer be an issue as they are all packed into padded container

    /**
     * The right and left padding allows to have inner shadows and outline
     * visible as DSFR tabs has a hidden overflow (used for transitions)
     */
    padding: 1rem 0.5rem;
    transition: none;
  }
</style>
