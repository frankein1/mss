import type { MatomoApi } from '~/types/matomo'

export function useMatomo() {
  const matomo = ref<MatomoApi>({
    trackEvent: () => {}
  })

  function loadTracker(tracker: MatomoApi) {
    matomo.value = tracker
  }

  return {
    loadTracker,
    matomo
  }
}
