<template>
  <div class="landing-main-container fr-container fr-my-8w">
    <h1>{{ routes.landing.Statistiques.title }}</h1>
    <iframe
      title="Dashboard Metabase"
      :src="`${publicConfig.metabase.publicUrl}#bordered=false&titled=false`"
      frameborder="0"
      width="100%"
      height="2000"
      allowtransparency
    ></iframe>
  </div>
</template>

<script setup>
  import { routes } from '~/utils/routes'

  useHead({
    title: routes.landing.Statistiques.title
  })

  definePageMeta({
    layout: 'landing'
  })

  const { public: publicConfig } = useRuntimeConfig()
</script>
