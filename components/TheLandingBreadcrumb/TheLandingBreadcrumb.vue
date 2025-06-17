<template>
  <nav
    role="navigation"
    class="fr-breadcrumb"
    aria-label="vous êtes ici :"
  >
    <button
      class="fr-breadcrumb__button"
      aria-expanded="false"
      aria-controls="breadcrumb-landing-page"
    >
      Voir le fil d’Ariane
    </button>
    <div
      id="breadcrumb-landing-page"
      class="fr-collapse"
    >
      <ol class="fr-breadcrumb__list">
        <li>
          <NuxtLink
            class="fr-breadcrumb__link"
            :to="routes.landing.Accueil.path(landingPageUrl)"
            external
          >
            Accueil
          </NuxtLink>
        </li>
        <li>
          <a
            class="fr-breadcrumb__link"
            aria-current="page"
            >{{ text }}</a
          >
        </li>
      </ol>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'
  const {
    public: { landingPageUrl }
  } = useRuntimeConfig()

  const { text } = defineProps<{ text: string }>()
</script>
