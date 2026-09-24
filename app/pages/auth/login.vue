<template>
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <TheLandingBreadcrumb :text="routes.auth.AuthLogin.title" />
        <h1>
          {{ routes.auth.AuthLogin.title }}
        </h1>

        <p>
          Mon Suivi Social utilise ProConnect pour sécuriser votre
          authentification. Pour vous connecter, utilisez votre adresse e-mail
          professionnelle.
        </p>

        <SsoButton class="fr-my-4w" />

        <p>
          Pour toute question, contactez notre équipe :
          <NuxtLink :to="`mailto:${SUPPORT_EMAIL}}`">{{
            SUPPORT_EMAIL
          }}</NuxtLink>
        </p>

        <p>
          <span aria-hidden="true">✅</span> Les adresses e-mails
          <span class="text--italic">@nomdedomaine</span> sont acceptées.
          <br /><span aria-hidden="true">❌</span> Les adresses génériques
          (@gmail.com, @orange.fr...) sont refusées. Contactez votre structure
          pour obtenir une adresse e-mail professionnelle.
        </p>
      </div>
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
  .text--italic {
    font-style: italic;
  }
</style>
