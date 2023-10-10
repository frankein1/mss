<template>
  <main class="landing-main-container fr-container fr-my-8w">
    <div class="fr-grid-row fr-my-5w">
      <div class="fr-col fr-col-lg-8 fr-col-offset-lg-2">
        <h1 class="register-title">
          L'équipe de Mon Suivi Social se charge de créer votre espace
        </h1>
      </div>
    </div>

    <section class="fr-grid-row fr-grid-row--center register-step-grid">
      <div class="fr-col-12 fr-col-md-6 fr-col-lg-3">
        <img
          src="~/assets/img/register-01.svg"
          class="fr-responsive-img register-step-img"
          alt=""
        />
        <h2 class="fr-h3">01. Participez au prochain webinaire</h2>
        <NuxtLink
          to="https://framaforms.org/inscription-au-webinaire-mensuel-de-demonstration-1685106308"
          target="_blank"
          class="fr-btn"
          title="Nouvel onglet - Inscription au webinaire"
          >S'inscrire au webinaire</NuxtLink
        >
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-col-lg-3">
        <img
          src="~/assets/img/register-02.svg"
          class="fr-responsive-img register-step-img"
          alt=""
        />
        <h2 class="fr-h3">02. Renseignez vos informations</h2>
        <NuxtLink
          to="https://framaforms.org/mon-suivi-socialconfiguration-de-votre-espace-de-travail-1675077455"
          target="_blank"
          class="fr-btn"
          title="Nouvel onglet - Remplir le formulaire"
          >Remplir le formulaire</NuxtLink
        >
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-col-lg-3">
        <img
          src="~/assets/img/register-03.svg"
          class="fr-responsive-img register-step-img"
          alt=""
        />
        <h2 class="fr-h3">03. Connectez-vous à votre espace</h2>
      </div>
    </section>

    <section class="fr-grid-row fr-grid-row--center fr-mb-4w">
      <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
        <p class="landing-subtitle">
          Pour toute question, contactez-nous
          <NuxtLink to="mailto:monsuivisocial@anct.gouv.fr"
            >monsuivisocial@anct.gouv.fr</NuxtLink
          >
        </p>
      </div>
    </section>

    <section class="fr-grid-row fr-grid-row--center">
      <TheLandingVideo />
    </section>
  </main>
</template>

<script setup lang="ts">
  import { RouteTitle } from '~/utils/routing'

  useHead({
    title: RouteTitle.Register()
  })

  definePageMeta({
    layout: 'landing'
  })
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .register-title {
    text-align: center;
    font-weight: normal !important;
  }

  .register-step-grid {
    text-align: center;
    gap: 4rem;
    margin-bottom: 6rem;

    @include dsfr-media-query.respond-from('xl') {
      gap: 6rem;
    }
  }

  .register-step-img {
    max-height: 200px;
    margin-bottom: 1.5rem;
  }

  a[href^='mailto:'] {
    color: $primary;
  }
</style>
