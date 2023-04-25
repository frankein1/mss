<template>
  <NuxtLayout>
    <Head>
      <Title>Mon Suivi Social</Title>
      <Meta charset="utf-8" />
      <Meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
      <Meta
        name="description"
        content="Mon Suivi Social est un outil simple d'utilisation et complet pour gérer l'accompagnement social."
      />
      <Meta
        name="format-detection"
        content="telephone=no"
      />
      <Link
        rel="icon"
        type="image/x-icon"
        href="/favicon.ico"
      />
    </Head>

    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
  useHead({
    htmlAttrs: {
      lang: 'fr'
    }
  })
</script>
