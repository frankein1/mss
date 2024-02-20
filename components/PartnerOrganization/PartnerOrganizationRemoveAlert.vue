<template>
  <div>
    <div></div>
    <div class="button-bar">
      <button
        class="fr-btn fr-btn--secondary"
        title="Annuler"
        type="button"
        @click="onCancel"
      >
        Annuler
      </button>
      <button
        class="fr-btn"
        title="Supprimer"
        type="button"
        @click="onFinish"
      >
        Valider
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    id: string
  }>()

  const emit = defineEmits<{
    onFinish: [id: string]
    onCancel: []
  }>()

  function onCancel() {
    emit('onCancel')
  }
  function onFinish() {
    emit('onFinish', props.id)
  }
</script>

<style lang="scss" scoped>
  .button-bar {
    display: flex;
    gap: 01.5rem;
    justify-content: center;
  }
</style>
