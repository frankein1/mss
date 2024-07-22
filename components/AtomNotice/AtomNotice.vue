<template>
  <div
    v-if="hasSlot"
    class="fr-notice fr-notice--info"
  >
    <div class="fr-container">
      <div class="fr-notice__body">
        <p class="fr-notice__title fr-text--bold">
          <slot name="default"></slot>
        </p>
        <p
          v-if="hasContentSlot"
          class="notice__content"
        >
          <slot name="content"></slot>
        </p>
        <button
          v-if="closeButton"
          id="button-1299"
          title="Masquer le message"
          onclick="const notice = this.parentNode.parentNode.parentNode; notice.parentNode.removeChild(notice)"
          class="fr-btn--close fr-btn"
        >
          Masquer le message
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    closeButton?: boolean
  }>()

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
