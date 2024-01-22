<template>
  <svg
    class="fr-artwork"
    aria-hidden="true"
    viewBox="0 0 80 80"
    :width="length"
    :height="length"
  >
    <use
      class="fr-artwork-decorative"
      :xlink:href="`${path}#artwork-decorative`"
    ></use>
    <use
      class="fr-artwork-minor"
      :xlink:href="`${path}#artwork-minor`"
    ></use>
    <use
      class="fr-artwork-major"
      :xlink:href="`${path}#artwork-major`"
    ></use>
  </svg>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      path: string
      length?: string
    }>(),
    { length: '5rem' }
  )
</script>
