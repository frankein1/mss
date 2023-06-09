<template>
  <main class="fr-container fr-my-8w">
    <div class="fr-grid-row fr-my-5w">
      <div class="fr-col fr-col-lg-8 fr-col-offset-lg-2 disabled-account__col">
        <h1 class="fr-text--regular">Votre compte est désactivé</h1>
        <div class="fr-px-9w">
          Votre accès à Mon Suivi Social a été désactivé. Veuillez vous
          rapprocher de votre responsable de structure pour rétablir votre
          accès.
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'landing'
  })
</script>

<style lang="scss" scoped>
  .disabled-account__col {
    text-align: center;
  }
</style>
