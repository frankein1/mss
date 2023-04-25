<template>
  <main class="fr-container fr-my-8w">
    <section class="fr-grid-row fr-grid-row--center fr-mb-16w">
      <div class="fr-col-12 fr-col-lg-5 landing-container-left">
        <h1 class="landing-title">
          Libérez du temps pour l'accompagnement social
        </h1>
        <p class="landing-subtitle">
          Mon Suivi Social est un logiciel simple et intuitif pour faciliter le
          suivi des bénéficiaires des structures d'accompagnement social.
        </p>
        <NuxtLink
          class="fr-btn"
          :to="Routes.Register"
          target="_self"
        >
          Enregistrer sa structure
        </NuxtLink>
      </div>
      <div class="fr-col-12 fr-col-lg-7 landing-container-right">
        <TheLandingVideo />
      </div>
    </section>

    <section class="fr-grid-row fr-grid-row--center fr-mb-16w">
      <div class="fr-col-12 fr-col-md-6 fr-col-lg-3 feature">
        <img
          src="~/assets/img/home-01.svg"
          class="fr-responsive-img feature-img"
          alt=""
        />
        <h2 class="feature-headline">Complet</h2>
        <p>Un suivi complet de vos bénéficiaires</p>
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-col-lg-3 feature">
        <img
          src="~/assets/img/home-02.svg"
          class="fr-responsive-img feature-img"
          alt=""
        />
        <h2 class="feature-headline">Simple</h2>
        <p>Toutes les fonctionnalités en quelques clics</p>
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-col-lg-3 feature">
        <img
          src="~/assets/img/home-03.svg"
          class="fr-responsive-img feature-img"
          alt=""
        />
        <h2 class="feature-headline">Sécurisé</h2>
        <p>Une sécurisation maximale de données</p>
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-col-lg-3 feature">
        <img
          src="~/assets/img/home-04.svg"
          class="fr-responsive-img feature-img"
          alt=""
        />
        <h2 class="feature-headline">Centralisé</h2>
        <p>Toutes vos infos au même endroit</p>
      </div>
    </section>

    <section class="fr-grid-row fr-grid-row--center list-section fr-mb-14w">
      <div class="fr-col-12 fr-col-lg-5">
        <img
          src="~/assets/img/home-05.svg"
          class="fr-responsive-img"
          alt=""
        />
      </div>
      <div class="fr-col-12 fr-col-lg-5">
        <h2 class="fr-h1">Mon Suivi Social</h2>
        <ul class="fr-mb-5v">
          <li class="fr-icon-success-fill">Aides légales et facultatives</li>
          <li class="fr-icon-success-fill">Statistiques</li>
          <li class="fr-icon-success-fill">Rappel des tâches</li>
          <li class="fr-icon-success-fill">Notifications entre agents</li>
          <li class="fr-icon-success-fill">Historique bénéficiaires</li>
          <li class="fr-icon-success-fill">Budget</li>
        </ul>
        <NuxtLink
          class="fr-btn"
          :to="Routes.Register"
          target="_self"
        >
          Enregistrer sa structure
        </NuxtLink>
      </div>
    </section>

    <section class="fr-grid-row fr-grid-row--center testimony-section">
      <div class="fr-col-12">
        <h2>Témoignages</h2>
        <p>Ils et elles utilisent déjà Mon Suivi Social</p>
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
            <figure class="fr-quote">
              <blockquote>
                <p class="fr-text--md">
                  J'ai déjà eu l'occasion d'utiliser d'autres logiciels.
                  Celui-ci est aéré et lumineux. Il n'est vraiment pas compliqué
                  et très intuitif.
                </p>
              </blockquote>
              <figcaption>
                <p class="fr-quote__author">Ludivine, Travailleuse social</p>
              </figcaption>
            </figure>
          </div>
          <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
            <figure class="fr-quote">
              <blockquote>
                <p class="fr-text--md">
                  Les statistiques sont déjà modélisées, c'est bien, c'est ce
                  que l'on cherche. On souhaite mettre en valeur le travail des
                  structures et nous avons besoin d'un outil de pilotage pour
                  vraiment connaître les besoins en accompagnements sur le
                  territoire.
                </p>
              </blockquote>
              <figcaption>
                <p class="fr-quote__author">
                  Julien, Responsable mission numérique au sein d'un département
                </p>
              </figcaption>
            </figure>
          </div>
          <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
            <figure class="fr-quote">
              <blockquote>
                <p class="fr-text--md">
                  Tout colle avec ce que j'ai aujourd'hui dans mon formulaire
                  d'entretien. On sent que l'outil à été créé avec une
                  expérience terrain. Je suis contente, ça répond parfaitement à
                  nos besoins ici. C'est aussi un argument dans le cadre d'une
                  mobilité professionnelle, pour faciliter le recrutement.
                </p>
              </blockquote>
              <figcaption>
                <p class="fr-quote__author">
                  Lucie, Chargée de l'action sociale et responsable d'un CCAS
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
  import { Routes } from '~/utils/routing/routes'

  definePageMeta({
    layout: 'landing'
  })
</script>

<style lang="scss" scoped>
  @use '~/assets/style/variables' as *;
  @use '@gouvfr/dsfr/src/core/index' as dsfr;
  @use '@gouvfr/dsfr/module/media-query' as dsfr-media-query;

  .landing-container-left {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 2rem;

    @include dsfr-media-query.respond-from('lg') {
      align-items: start;
      margin-bottom: 0;
    }
  }

  .landing-container-right {
    display: flex;
    justify-content: center;
    align-items: center;

    @include dsfr-media-query.respond-from('lg') {
      justify-content: flex-end;
    }
  }

  .landing-title {
    font-weight: 400;
    text-align: center;

    @include dsfr-media-query.respond-from('lg') {
      text-align: initial;
    }
  }

  @include dsfr-media-query.respond-from('lg') {
    .landing-subtitle {
      text-align: initial;
    }
  }

  .feature,
  .list-section {
    text-align: center;

    @include dsfr-media-query.respond-from('lg') {
      text-align: initial;
    }
  }

  .feature {
    &:not(:last-of-type) {
      margin-bottom: 3rem;

      @include dsfr-media-query.respond-from('lg') {
        margin-bottom: 0;
      }
    }
  }

  .feature-img {
    max-width: 100px;
    margin-bottom: 1rem;
  }

  .feature-headline {
    @include dsfr.title-style(h5);

    margin-bottom: 1rem;
  }

  .feature p {
    width: 100%;

    @include dsfr-media-query.respond-from('lg') {
      width: 70%;
    }
  }

  .testimony-section {
    text-align: center;
  }

  .list-section {
    column-gap: 5rem;
    row-gap: 2rem;
  }

  .list-section div:nth-child(2) {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    @include dsfr-media-query.respond-from('lg') {
      align-items: start;
    }
  }

  .list-section img {
    max-width: 250px;

    @include dsfr-media-query.respond-from('sm') {
      max-width: 300px;
    }

    @include dsfr-media-query.respond-from('lg') {
      max-width: 600px;
    }
  }

  .list-section ul {
    @include dsfr.disable-list-style;

    --li-bottom: 1rem;

    width: max-content;

    li {
      @include dsfr.title-style(h5);

      display: block;
      font-weight: normal;
    }

    li::before {
      color: $primary;
      margin-right: 0.5rem;
    }
  }
</style>
