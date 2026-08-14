<template>
  <div>
    <DsfrAlert
      class="fr-mb-4w"
      :type="inactive ? 'warning' : 'success'"
      :title="logoutTitle"
    ></DsfrAlert>

    <h2 class="logout-title fr-h2 fr-mb-2w">
      {{ logoutTitle }}
    </h2>
    <p v-if="inactive">
      Pensez à verrouiller votre ordinateur ou fermer votre session quand vous
      quittez votre poste de travail.
    </p>
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
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    inactive: boolean
  }>()

  const auth = useAuth()

  const {
    public: {
      disconnect: { threshold }
    }
  } = useRuntimeConfig()

  auth.logout()

  const logoutTitle = props.inactive
    ? `Déconnexion effectuée après ${threshold} minutes d'inactivité`
    : routes.auth.AuthLogout.title
</script>
