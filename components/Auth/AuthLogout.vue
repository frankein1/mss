<template>
  <h1
    v-if="pending"
    class="logout-title fr-h2 fr-mb-2w"
  >
    En cours de déconnexion
  </h1>
  <h1
    v-else-if="error"
    class="logout-title fr-h2 fr-mb-2w"
  >
    Erreur lors de la déconnexion
  </h1>
  <div v-else-if="data?.success">
    <h1 class="logout-title fr-h2 fr-mb-2w">{{ RouteTitle.AuthLogout() }}</h1>
    <div
      v-if="inactive"
      class="fr-grid-row fr-grid-row--gutters logout-inactive"
    >
      <div class="fr-col-6">
        Suite à 30 minutes d'inactivité sur votre espace Mon Suivi Social, vous
        avez été déconnecté de votre espace automatiquement.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAuthStore } from '~/store/auth'
  import { RoutePath, RouteTitle } from '~/utils/routing'

  const props = defineProps<{
    inactive: boolean
  }>()

  const store = useAuthStore()

  const { data, pending, error } = await useFetch<{
    url: string | null
    success: boolean
  }>(RoutePath.ApiLogout(), {
    method: 'POST',
    body: { inactive: !!props.inactive },
    onResponse({ response }) {
      const { _data: data } = response
      if (!data) {
        return
      }
      const { success, url } = data
      if (success) {
        store.logout()
      }
      if (url) {
        window.location.href = url
      }
    }
  })
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
