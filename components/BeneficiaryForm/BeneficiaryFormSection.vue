<template>
  <div
    class="fr-grid-row fr-grid-row--center fr-grid-row--bottom fr-grid-row--gutters feature-section fr-mb-3w"
  >
    <div
      v-if="sectionTitle"
      class="fr-col-12"
      :class="{ 'beneficiaryformsection__title-action': hasTitleAction }"
    >
      <h3 class="fr-h4 fr-mb-0">
        {{ sectionTitle }}
      </h3>
      <slot name="titleAction"></slot>
    </div>
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

  const slots = useSlots()

  const hasTitleAction = computed(() => slots.titleAction)
</script>

<style lang="scss">
  .beneficiaryformsection__title-action {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
