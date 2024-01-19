import VueMatomo from 'vue-matomo'
import { MatomoApi, EventCategory, EventAction } from '~/types/matomo'

export default defineNuxtPlugin(() => {
  const { public: publicConfig } = useRuntimeConfig()

  const matomo = ref<MatomoApi>({
    trackEvent: () => {}
  })

  const loadTracker = (tracker: MatomoApi) => {
    matomo.value = tracker
  }

  const trackEvent = (category: EventCategory, action: EventAction) => {
    matomo.value.trackEvent(category, action)
  }

  const provide = {
    loadTracker,
    trackEvent
  }

  if (!publicConfig.matomo.host || !publicConfig.matomo.siteId) {
    return { provide }
  }

  const nuxtApp = useNuxtApp()
  const router = useRouter()

  nuxtApp.vueApp.use(VueMatomo, {
    host: publicConfig.matomo.host,
    siteId: publicConfig.matomo.siteId,
    router, // Enables automatically registering page views on the router
    enableLinkTracking: true,
    trackInitialView: true,
    disableCookies: true
  })

  return { provide }
})
