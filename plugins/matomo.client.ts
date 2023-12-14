import VueMatomo from 'vue-matomo'

export default defineNuxtPlugin(() => {
  const { public: publicConfig } = useRuntimeConfig()

  if (!publicConfig.matomo.host || !publicConfig.matomo.siteId) {
    return
  }

  const nuxtApp = useNuxtApp()
  const router = useRouter()

  nuxtApp.vueApp.use(VueMatomo, {
    host: publicConfig.matomo.host,
    siteId: publicConfig.matomo.siteId,
    router, // Enables automatically registering page views on the router
    enableLinkTracking: true,
    trackInitialView: true,
    disableCookies: true,
    crossOrigin: 'anonymous'
  })
})
