<template>
  <main class="fr-container fr-my-8w">
    <div class="fr-grid-row fr-my-5w">
      <div class="fr-col fr-col-lg-8 fr-col-offset-lg-2">
        <h1 class="logout__title">Vous êtes déconnecté.e.s</h1>
        <div
          v-if="inactive"
          class="logout__inactive"
        >
          Suite à 15 minutes d'inactivité sur votre espace Mon Suivi Social,
          vous avez été déconnecté de votre espace automatiquement.
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'landing'
  })

  const route = useRoute()
  const inactive = route.query.inactive
</script>

<style lang="scss">
  .logout__title {
    text-align: center;
    font-weight: normal !important;
  }

  .logout__inactive {
    text-align: center;
    padding-left: 5em;
    padding-right: 5em;
  }
</style>
