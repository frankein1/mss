<template>
  <div>
    <p>Toutes les pages seront exportées avec les filtres actuels.</p>
    <div class="export-btn-container">
      <button
        class="fr-btn"
        @click="onExport"
      >
        Exporter
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{ export: () => void }>()

  function onExport() {
    props.export()
  }
</script>

<style scoped>
  .export-btn-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
