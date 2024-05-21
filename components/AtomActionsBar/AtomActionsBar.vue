<template>
  <div
    class="actions-bar bg-color-white"
    :class="{ 'actions-bar--btn-no-margin': noMargin }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{ noMargin?: boolean }>(), { noMargin: true })
</script>

<style scoped lang="scss">
  .actions-bar {
    border-top: 1px solid var(--border-default-grey);
    padding: 1.5rem 2rem;
  }

  .actions-bar--btn-no-margin {
    :deep(.fr-btns-group .fr-btn) {
      margin-bottom: 0;
    }
  }
</style>
