<template>
  <AtomAlert
    class="fr-mx-auto"
    :alert-type="AlertType.Error"
    message="Connexion à Rendez-vous Service Public impossible"
    ><template #detailedMessage
      ><p v-if="error.MSS_CODE === MSS_ERROR_CODES.RDVSP_NO_ACCOUNT">
        Vous n'avez pas de compte RDVSP, vous ne pouvez donc pas voir les
        rendez-vous déjà pris ni en prendre de nouveaux. Rapprochez-vous de
        votre responsable de structure pour activer votre compte.
      </p>
      <div v-else-if="error.MSS_CODE === MSS_ERROR_CODES.RDVSP_UNAUTHENTICATED">
        >
        <p>
          Vous n'êtes plus connecté à RDVSP. Reconnectez-vous pour rétablir
          l‘affichage des RDVs.
        </p>
        <div class="btn-container btn-container--center">
          <NuxtLink
            class="fr-btn"
            :to="apiRoutes.rdvsp.ApiSignIn.path()"
            >Se connecter</NuxtLink
          >
        </div>
      </div>
      <div v-else>
        Une erreur est survenue lors de la connexion à Rendez-vous Service
        Public.
      </div>
    </template>
  </AtomAlert>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { MSS_ERROR_CODES } from '~/utils/error'
  import { apiRoutes } from '~/utils/routes'

  const { error } = defineProps<{
    error: {
      code: string
      MSS_CODE?: MSS_ERROR_CODES
      httpStatus: number
    }
  }>()

  console.log('error', error)
</script>

<style scoped lang="scss"></style>
