<template>
  <div>
    <h1>{{ routes.error.ErrorInvalidToken.title }}</h1>
    <p class="fr-text--lead fr-mb-3w">
      Votre jeton d'authentification est invalide ou a expiré.
    </p>
    <p class="fr-text--sm fr-mb-5w">
      Veuillez vous authentifier à nouveau.<br />
      En cas d'échec répété, contactez-nous pour que nous puissions solutionner
      vos problèmes d'accès.
    </p>
    <ul class="fr-btns-group fr-btns-group--inline-md fr-btns-group--icon-left">
      <li>
        <NuxtLink
          class="fr-btn fr-icon-add-line"
          :to="routes.auth.AuthLogin.path()"
        >
          Se connecter
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          class="fr-btn fr-btn--secondary"
          :to="`mailto:${supportEmail}`"
        >
          Contactez-nous
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'

  useHead({ title: routes.error.ErrorInvalidToken.title })

  const {
    public: {
      email: { from: supportEmail }
    }
  } = useRuntimeConfig()

  definePageMeta({
    layout: 'error'
  })
</script>
