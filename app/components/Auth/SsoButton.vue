<template>
  <div class="fr-connect-group">
    <NuxtLink
      id="proconnect-link"
      class="fr-connect fr-connect--pro"
      :href="signinUrl"
      external
    >
      <span class="fr-connect__login">S’identifier avec</span>
      <span class="fr-connect__brand">ProConnect</span>
    </NuxtLink>
    <p>
      <NuxtLink
        id="connect-link-45"
        href="https://www.proconnect.gouv.fr"
        target="_blank"
        rel="noopener"
        title="Qu’est-ce que ProConnect ? - nouvelle fenêtre"
        >Qu’est-ce que ProConnect ?</NuxtLink
      >
    </p>
  </div>
</template>

<script lang="ts" setup>
  import { apiRoutes } from '~/utils/routes'

  const SIGNIN_PATH = apiRoutes.proConnect.ApiSignIn.path()

  const route = useRoute()

  const signinUrl = computed(() => {
    const { redirectUrl } = route.query
    if (!redirectUrl) {
      return SIGNIN_PATH
    }
    const params = new URLSearchParams({ redirectUrl: redirectUrl as string })
    return `${SIGNIN_PATH}?${params}`
  })
</script>

<style lang="scss" scoped>
  // Restore DSFR default colors overridden in main.scss, required by ProConnect guidelines
  .fr-connect-group {
    --background-action-high-blue-france: var(--blue-france-sun-113-625);
    --background-action-high-blue-france-hover: var(
      --blue-france-sun-113-625-hover
    );
    --background-action-high-blue-france-active: var(
      --blue-france-sun-113-625-active
    );
  }
</style>
