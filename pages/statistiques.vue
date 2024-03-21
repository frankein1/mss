<template>
  <div class="landing-main-container fr-container fr-my-8w">
    <h1>{{ RouteTitle.Statistiques() }}</h1>
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
  import { RouteTitle } from '~/utils/routing/titles'

  useHead({
    title: RouteTitle.Statistiques()
  })

  definePageMeta({
    layout: 'landing'
  })

  const { public: publicConfig } = useRuntimeConfig()
</script>
