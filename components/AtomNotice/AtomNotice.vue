<template>
  <div
    v-if="hasSlot"
    class="fr-notice fr-notice--info"
  >
    <div class="fr-container">
      <div class="fr-notice__body">
        <p class="fr-notice__title">
          <slot></slot>
        </p>
        <p
          v-if="hasContentSlot"
          class="notice__content"
        >
          <slot name="content"></slot>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const slots = useSlots()

  const hasSlot = computed(() => slots.default)
  const hasContentSlot = computed(() => slots.content)
</script>

<style scoped>
  .notice__content {
    color: var(--text-default-grey);
    font-weight: 400;
  }
</style>
