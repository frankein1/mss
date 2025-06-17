<template>
  <h2
    v-if="pending"
    class="logout-title"
  >
    En cours de déconnexion
  </h2>
  <h2
    v-else-if="error"
    class="logout-title"
  >
    Erreur lors de la déconnexion
  </h2>
  <div v-else-if="data?.success">
    <h2 class="logout-title">Se connecter à nouveau à son espace de travail</h2>
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
  </div>
  <div class="fr-container">
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--left fr-mb-2w">
      <div class="fr-col-12 fr-col-md-4">
        <SsoButton class="fr-my-4w" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { apiRoutes } from '~/utils/routes'

  const props = defineProps<{
    inactive: boolean
  }>()

  const auth = useAuth()
  const { provider } = useAuthProvider()

  const {
    public: {
      disconnect: { threshold }
    }
  } = useRuntimeConfig()

  const url = apiRoutes.proConnect.ApiLogout.path()

  const { data, pending, error } = await useFetch<{
    url: string | null
    success: boolean
  }>(url, {
    method: 'POST',
    body: { inactive: !!props.inactive },
    onResponse({ response }) {
      const { _data: data } = response
      if (!data) {
        return
      }
      const { success, url } = data
      if (success) {
        provider.value = undefined
        auth.logout()
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
    color: $primary;
  }
</style>
