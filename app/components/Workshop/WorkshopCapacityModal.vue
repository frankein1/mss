<template>
  <div class="alert--image"></div>
  <p class="title">{{ message }}</p>
  <div class="btn-container">
    <button
      class="fr-btn fr-mb-0"
      type="button"
      @click="modal.close"
    >
      J‘ai compris
    </button>
  </div>
</template>

<script setup lang="ts">
  const modal = useModal()

  const { isFull } = defineProps<{ isFull: boolean }>()

  const message = computed(() => {
    if (isFull) {
      return 'L’atelier est complet, une ou plusieurs personnes ont été ajoutée(s) sur liste d’attente'
    }
    return 'Une place est disponible. Pensez à transférer quelqu‘un de la liste d‘attente.'
  })
</script>

<style scoped lang="scss">
  .alert--image {
    background-image: url('/pictograms/alerte.svg');
    background-position-x: center;
    background-position-y: center;
    background-repeat: no-repeat;
    background-size: contain;
    height: 98px;
  }

  .btn-container {
    display: flex;
    justify-content: center;
  }

  .title {
    font-weight: 700;
    font-size: 1.375rem;
    text-align: center;
    margin-bottom: 3rem;
  }
</style>
