<template>
  <div>
    <h1>{{ RouteTitle.ErrorUnknownUser() }}</h1>
    <p class="fr-text--lead fr-mb-3w">
      Aucun compte Mon Suivi Social n'est rattaché à votre compte
      InclusionConnect.
    </p>
    <p class="fr-text--sm fr-mb-5w">
      Vous avez accedé à Mon Suivi Social avec InclusionConnect mais votre
      compte InclusionConnect est inconnu de nos services.<br />
      Si votre structure a un espace Mon Suivi Social, veuillez vous rapprocher
      de votre responsable de structure pour qu'un compte Mon Suivi Social
      rattaché à votre compte InclusionConnect vous soit créé.
      <br />Si votre structure n'a pas d'espace Mon Suivi Social, vous trouverez
      toutes les informations nécessaires pour créer un espace sur notre service
      sur la page <strong>Créer un espace</strong>.<br />
      Sinon, contactez-nous pour que nous puissions solutionner vos problèmes
      d'accès.
    </p>
    <ul class="fr-btns-group fr-btns-group--inline-md fr-btns-group--icon-left">
      <li>
        <NuxtLink
          class="fr-btn fr-icon-add-line"
          :to="RoutePath.Register()"
          target="_self"
        >
          Créer un espace
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
  import { RouteTitle, RoutePath } from '~/utils/routing'

  const {
    public: {
      email: { from: supportEmail }
    }
  } = useRuntimeConfig()

  useHead({
    title: RouteTitle.ErrorUnknownUser()
  })

  definePageMeta({
    layout: 'error'
  })
</script>
