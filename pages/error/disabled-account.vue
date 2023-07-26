<template>
  <div>
    <h1 class="fr-text--regular">{{ RouteTitle.ErrorDisabledAccount() }}</h1>
    <p class="fr-px-9w">
      Votre accès à Mon Suivi Social a été désactivé. Veuillez vous rapprocher
      de votre responsable de structure pour rétablir votre accès.
    </p>
  </div>
</template>

<script setup lang="ts">
  import { RouteTitle } from '~/utils/routing'

  useHead({
    title: RouteTitle.ErrorDisabledAccount()
  })

  definePageMeta({
    layout: 'error'
  })
</script>
