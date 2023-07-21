import VueMatomo from 'vue-matomo'

export default defineNuxtPlugin(() => {
  const nuxtApp = useNuxtApp()
  const router = useRouter()
  const { public: publicConfig } = useRuntimeConfig()
  const { isProduction } = useEnvironment()

  if (!isProduction) {
    return
  }

  nuxtApp.vueApp.use(VueMatomo, {
    host: publicConfig.matomo.host,
    siteId: publicConfig.matomo.siteId,
    router, // Enables automatically registering page views on the router
    enableLinkTracking: true,
    trackInitialView: true,
    disableCookies: true
  })
})
