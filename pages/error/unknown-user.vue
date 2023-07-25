<template>
  <div>
    <h1 class="fr-text--regular">
      {{ RouteTitle.ErrorUnknownUser() }}
    </h1>
    <p class="fr-px-9w">
      Aucun compte Mon Suivi Social n'est rattaché à votre compte
      InclusionConnect. Veuillez vous rapprocher de votre responsable de
      structure pour qu'un compte Mon Suivi Social vous soit créé.
    </p>
  </div>
</template>

<script setup lang="ts">
  import { RouteTitle } from '~/utils/routing'

  useHead({
    title: RouteTitle.ErrorUnknownUser()
  })

  definePageMeta({
    layout: 'error'
  })
</script>
