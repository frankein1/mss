<template>
  <div
    class="fr-grid-row fr-grid-row--center fr-grid-row--bottom fr-grid-row--gutters feature-section fr-mb-3w"
  >
    <h3
      v-if="sectionTitle"
      class="fr-h4 fr-col-12 fr-mb-0"
    >
      {{ sectionTitle }}
    </h3>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      sectionTitle?: string
    }>(),
    { sectionTitle: undefined }
  )
</script>
