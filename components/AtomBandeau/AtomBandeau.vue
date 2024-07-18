<template>
  <div class="fr-notice fr-notice--info">
    <div class="fr-container">
      <div class="fr-notice__body">
        <p class="fr-text--bold">
          {{ content }}
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
    content: string
    closeButton?: boolean
  }>()
</script>
