<template>
  <span
    class="folowup-icon fr-icon-draft-line"
    :class="{ big: isBig }"
    aria-hidden="true"
  ></span>
</template>

<script setup lang="ts">
  defineProps<{
    isBig?: boolean
  }>()
</script>

<style lang="scss" scoped>
  .folowup-icon {
    padding: 0.75rem;
    border-radius: 50%;
    background-color: var(--background-contrast-green-archipel);
    color: var(--text-label-green-archipel);

    &.big {
      width: 4rem;
      height: 4rem;
      padding: 1rem;
      margin: 0.5rem;

      &::before {
        width: 2rem;
        height: 2rem;
      }
    }
  }
</style>
