<template>
  <main class="landing-main-container fr-container fr-my-8w">
    <h1 class="logout-title fr-h2 fr-mb-2w">{{ RouteTitle.AuthLogout() }}</h1>
    <div
      v-if="inactive"
      class="fr-grid-row fr-grid-row--gutters logout-inactive"
    >
      <div class="fr-col-6">
        {{
          `Suite à ${threshold} minutes d'inactivité sur votre espace Mon Suivi Social,
          vous avez été déconnecté de votre espace automatiquement.`
        }}
      </div>
    </div>
    <div class="fr-pt-6w">
      <InclusionConnectButton />
    </div>
  </main>
</template>

<script setup lang="ts">
  import { useAuthStore } from '~/store/auth'
  import { RoutePath, RouteTitle } from '~/utils/routing'

  useHead({
    title: RouteTitle.AuthLogout()
  })

  definePageMeta({
    layout: 'landing'
  })

  const route = useRoute()

  const {
    public: {
      disconnect: { threshold }
    }
  } = useRuntimeConfig()

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
  @use '~/assets/style/variables' as *;

  .logout-inactive {
    text-align: center;
    justify-content: center;
  }

  .logout-title {
    text-align: center;
    color: $primary;
  }
</style>
