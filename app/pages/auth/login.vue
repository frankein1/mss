<template>
  <div>
    <div class="fr-container fr-pt-4w">
      <TheLandingBreadcrumb :text="routes.auth.AuthLogin.title" />
      <h1>
        {{ routes.auth.AuthLogin.title }}
      </h1>
    </div>
    <div class="fr-container">
      <p>
        Mon Suivi Social utilise Proconnect pour sécuriser votre
        authentification. Pour vous connecter, utilisez votre adresse email
        professionnelle.
      </p>
    </div>
    <div class="fr-container">
      <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--left fr-mb-2w">
        <div class="fr-col-12 fr-col-md-4">
          <SsoButton class="fr-my-4w" />
        </div>
      </div>
    </div>
    <div class="fr-container">
      <p>
        Pour toute question, contactez notre équipe :
        <NuxtLink :to="`mailto:${SUPPORT_EMAIL}}`">{{
          SUPPORT_EMAIL
        }}</NuxtLink>
      </p>
      <p>
        ✅ Les adresses emails <i>@nomdedomaine</i> sont acceptées <br />❌ Les
        adresses génériques (@gmail.com, @orange.fr...) sont refusées. Contactez
        votre structure pour obtenir une adresse e-mail professionnelle.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { routes } from '~/utils/routes'
  import { SUPPORT_EMAIL } from '~/utils/constants'

  useHead({
    title: routes.auth.AuthLogin.title
  })

  definePageMeta({
    layout: 'landing',
    middleware: 'skip-auth'
  })
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;

  .login-title {
    text-align: center;
    color: $primary;
  }
</style>
