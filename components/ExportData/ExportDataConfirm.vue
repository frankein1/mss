<template>
  <div>
    <p>Toutes les pages seront exportées avec les filtres actuels.</p>
    <button
      class="fr-btn"
      @click="emit('export')"
    >
      Exporter
    </button>
  </div>
</template>

<script lang="ts" setup>
  const emit = defineEmits<{ (e: 'export'): void }>()
</script>
