<template>
  <form
    class="fr-container--fluid"
    @submit.prevent="onAcceptCGU"
  >
    <VeeCheckbox
      class="fr-mt-2w"
      name="read"
      label="Je confirme avoir pris connaissance des conditions générales d'utilisation"
      required
    />
    <VeeCheckbox
      class="fr-mt-2w"
      name="accept"
      label="J'accepte les conditions générales d'utilisation"
      required
    />
    <ul
      class="fr-btns-group fr-btns-group--inline-lg fr-btns-group--icon-left fr-mt-2w"
    >
      <li>
        <a
          :href="RoutePath.Logout()"
          target="_self"
          class="fr-btn fr-btn--secondary fr-icon-logout-box-r-line"
        >
          Déconnexion
        </a>
      </li>
      <li>
        <button
          class="fr-btn"
          type="submit"
        >
          Enregistrer
        </button>
      </li>
    </ul>
  </form>
</template>

<script lang="ts" setup>
  import { useAuthStore } from '~/store/auth'
  import { RoutePath } from '~/utils/routing'

  const trpcClient = useTrpcClient()
  const snackbar = useSnackbar()
  const auth = useAuthStore()

  async function onAcceptCGU() {
    try {
      const user = await trpcClient.user.acceptCGU.mutate()
      auth.login(user)
      return navigateTo(RoutePath.Overview())
    } catch {
      snackbar.error("L'acceptation des CGU a échoué.")
    }
  }
</script>
