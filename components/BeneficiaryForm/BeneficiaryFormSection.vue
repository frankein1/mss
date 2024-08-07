<template>
  <section
    class="fr-grid-row fr-grid-row--center fr-grid-row--bottom fr-grid-row--gutters feature-section fr-p-7v fr-mb-3w"
  >
    <div
      v-if="sectionTitle"
      class="fr-col-12"
      :class="{ 'beneficiaryformsection__title-action': hasTitleAction }"
    >
      <h3 class="fr-h4 beneficiaryformsection__title-headline title-blue">
        {{ sectionTitle }}
      </h3>
      <slot name="titleAction"></slot>
    </div>
    <slot></slot>
  </section>
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

<style lang="scss" scoped>
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .beneficiaryformsection__title-headline {
    margin-bottom: 0;
  }

  .beneficiaryformsection__title-action
    .beneficiaryformsection__title-headline {
    margin-bottom: 0.5rem;
  }

  @include dsfr-media-query.respond-from('lg') {
    .beneficiaryformsection__title-action {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .beneficiaryformsection__title-headline {
        margin-bottom: 0;
      }
    }
  }
</style>
