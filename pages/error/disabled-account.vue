<template>
  <div>
    <h1>{{ RouteTitle.ErrorDisabledAccount() }}</h1>
    <p class="fr-text--lead fr-mb-3w">
      Votre accès à Mon Suivi Social a été désactivé.
    </p>
    <p class="fr-text--sm fr-mb-5w">
      Veuillez vous rapprocher de votre responsable de structure pour rétablir
      votre accès.<br />
      Si vous êtes le responsable de votre structure, contactez-nous pour que
      nous puissions solutionner vos problèmes d'accès.
    </p>
    <ul class="fr-btns-group fr-btns-group--inline-md">
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
  import { RouteTitle } from '~/utils/routing'

  const {
    public: {
      email: { from: supportEmail }
    }
  } = useRuntimeConfig()

  useHead({
    title: RouteTitle.ErrorDisabledAccount()
  })

  definePageMeta({
    layout: 'error'
  })
</script>
