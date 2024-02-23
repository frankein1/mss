<template>
  <NuxtLayout>
    <Head>
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
        content="telephone=no,date=no,address=no,email=no,url=no"
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
  const MATOMO_SCRIPT_FILENAME = 'matomo.js'

  const { public: publicConfig } = useRuntimeConfig()
  const matomo = useMatomo()

  useHead({
    htmlAttrs: {
      lang: 'fr'
    },
    bodyAttrs: {
      class: computed(() => {
        const { mssEnvironment } = publicConfig
        if (mssEnvironment === 'demo') {
          return 'ribbon ribbon-demo'
        }
        if (mssEnvironment === 'development') {
          return 'ribbon ribbon-development'
        }
        if (mssEnvironment === 'local') {
          return 'ribbon ribbon-local'
        }
        return ''
      })
    },
    titleTemplate: pageTitle => {
      return pageTitle ? `${pageTitle} | Mon Suivi Social` : 'Mon Suivi Social'
    },
    link: [
      { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/apple-touch-favicon.png' },
      { rel: 'manifest', href: '/manifest.webmanifest' }
    ]
  })

  const matomoScriptSrc = `${publicConfig.matomo.host}/${MATOMO_SCRIPT_FILENAME}`

  onMounted(() => {
    if (window.Matomo) {
      loadTracker()
      return
    }

    const matomoScript = document.querySelector<HTMLScriptElement>(
      `script[src='${matomoScriptSrc}']`
    )

    if (!matomoScript) {
      return
    }

    matomoScript.addEventListener('load', injectMatomo)
  })

  onUnmounted(() => {
    const matomoScript = document.querySelector<HTMLScriptElement>(
      `script[src='${matomoScriptSrc}']`
    )

    if (!matomoScript) {
      return
    }

    matomoScript.removeEventListener('load', injectMatomo)
  })

  function injectMatomo() {
    if (!window.Matomo) {
      return
    }

    loadTracker()
  }

  function loadTracker() {
    const tracker = window.Matomo?.getAsyncTracker()
    matomo.loadTracker(tracker)
  }
</script>

<style>
  @media not print {
    .ribbon::after {
      position: fixed;
      width: 100px;
      height: 25px;
      top: 10px;
      left: -30px;
      text-align: center;
      font-size: 13px;
      font-family: sans-serif;
      text-transform: uppercase;
      font-weight: bold;
      color: #fff;
      line-height: 27px;
      transform: rotate(-45deg);
    }

    .ribbon-local::after {
      content: 'LOCAL';
      background: #30bb76;
    }

    .ribbon-demo::after {
      content: 'DEMO';
      background: #ee8e4a;
    }

    .ribbon-development::after {
      content: 'DEV';
      background: #d12b23;
    }
  }
</style>
