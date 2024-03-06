<template>
  <div
    class="fr-container fr-pb-5w"
    :class="{ 'fr-container--no-max': noMaxWidth }"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      noMaxWidth?: boolean
    }>(),
    { noMaxWidth: false }
  )
</script>
