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
  import { useMatomoStore } from '~/store/matomo'

  const MATOMO_SCRIPT_FILENAME = 'matomo.js'

  const { public: publicConfig } = useRuntimeConfig()
  const matomoStore = useMatomoStore()

  useHead({
    htmlAttrs: {
      lang: 'fr'
    }
  })

  onMounted(() => {
    if (window.Matomo) {
      loadTracker()
      return
    }

    const matomoScriptSrc = `${publicConfig.matomo.host}/${MATOMO_SCRIPT_FILENAME}`

    const matomoScript = document.querySelector<HTMLScriptElement>(
      `script[src='${matomoScriptSrc}']`
    )

    if (!matomoScript) {
      return
    }

    matomoScript.addEventListener('load', injectMatomo)
  })

  function injectMatomo() {
    if (!window.Matomo) {
      return
    }

    loadTracker()
  }

  function loadTracker() {
    const tracker = window.Matomo?.getAsyncTracker()
    matomoStore.loadTracker(tracker)
  }
</script>
