<template>
  <div>
    <p>Toutes les pages seront exportées avec les filtres actuels.</p>
    <div class="export-btn-container">
      <button
        class="fr-btn"
        @click="emit('export')"
      >
        Exporter
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const emit = defineEmits<{ export: [] }>()
</script>

<style scoped>
  .export-btn-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
