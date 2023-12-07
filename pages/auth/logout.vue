<template>
  <main class="landing-main-container fr-container fr-my-8w">
    <div class="fr-grid-row fr-my-5w">
      <div class="fr-col fr-col-lg-8 fr-col-offset-lg-2 logout__col">
        <h1 class="fr-text--regular">{{ RouteTitle.AuthLogout() }}</h1>
        <div
          v-if="inactive"
          class="fr-px-9w"
        >
          {{
            `Suite à ${threshold} minutes d'inactivité sur votre espace Mon Suivi Social,
          vous avez été déconnecté de votre espace automatiquement.`
          }}
        </div>
      </div>
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
  .logout__col {
    text-align: center;
  }
</style>
