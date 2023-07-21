<template>
  <div>
    <p>Les données seront exportées avec les filtres actuels.</p>
    <button
      class="fr-btn"
      @click="emit('export')"
    >
      Télécharger
    </button>
  </div>
</template>

<script lang="ts" setup>
  const emit = defineEmits<{ (e: 'export'): void }>()
</script>
