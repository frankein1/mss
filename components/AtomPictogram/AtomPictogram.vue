<template>
  <svg
    v-if="imagePath"
    class="fr-artwork"
    aria-hidden="true"
    viewBox="0 0 80 80"
    width="80"
    height="80"
  >
    <use
      class="fr-artwork-decorative"
      :xlink:href="`${imagePath}#artwork-decorative`"
    ></use>
    <use
      class="fr-artwork-minor"
      :xlink:href="`${imagePath}#artwork-minor`"
    ></use>
    <use
      class="fr-artwork-major"
      :xlink:href="`${imagePath}#artwork-major`"
    ></use>
  </svg>
</template>

<script setup lang="ts">
  const props = defineProps<{ name: string }>()

  const glob = import.meta.glob('~/assets/pictograms/*.svg', { eager: true })

  const imagePath = computed(() => glob[props.name]?.default)
</script>
