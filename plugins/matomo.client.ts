import VueMatomo from 'vue-matomo'

export default defineNuxtPlugin(() => {
  const nuxtApp = useNuxtApp()
  const router = useRouter()
  const { public: publicConfig } = useRuntimeConfig()

  if (publicConfig.mssEnvironment !== 'production') {
    return
  }

  nuxtApp.vueApp.use(VueMatomo, {
    host: publicConfig.matomo.host,
    siteId: publicConfig.matomo.siteId,
    // Enables automatically registering pageviews on the router
    router,
    enableLinkTracking: true,
    trackInitialView: true,
    disableCookies: true
  })
})
