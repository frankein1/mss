<template>
  <span
    class="helprequest-icon fr-icon-draft-line"
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
  .helprequest-icon {
    padding: 0.75rem;
    border-radius: 50%;
    background-color: var(--background-contrast-purple-glycine);
    color: var(--text-label-purple-glycine);

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
