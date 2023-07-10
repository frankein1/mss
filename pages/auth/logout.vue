<template>
  <main class="fr-container fr-my-8w">
    <div class="fr-grid-row fr-my-5w">
      <div class="fr-col fr-col-lg-8 fr-col-offset-lg-2 logout__col">
        <h1 class="fr-text--regular">Vous êtes déconnecté.e.s</h1>
        <div
          v-if="inactive"
          class="fr-px-9w"
        >
          Suite à 15 minutes d'inactivité sur votre espace Mon Suivi Social,
          vous avez été déconnecté de votre espace automatiquement.
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
  import { useAuthStore } from '~/store/auth'
  import { RoutePath } from '~/utils/routing'

  definePageMeta({
    layout: 'landing'
  })

  const route = useRoute()

  const inactive = route.query.inactive

  if (process.client) {
    const res = await $fetch<{ url: string | null; success: boolean }>(
      RoutePath.ApiLogout(),
      {
        method: 'POST',
        body: { inactive: !!inactive }
      }
    )
    if (res.success) {
      useAuthStore().logout()
    }
    if (res.url) {
      window.location.href = res.url
    }
  }
</script>

<style lang="scss" scoped>
  .logout__col {
    text-align: center;
  }
</style>
