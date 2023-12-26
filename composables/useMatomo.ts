import type { MatomoApi } from '~/types/matomo'

export function useMatomo() {
  const matomo = useState<MatomoApi | null>('matomo')

  function loadTracker(tracker: MatomoApi) {
    matomo.value = tracker
  }

  return {
    loadTracker,
    matomo: {
      trackEvent: () => {
        // eslint-disable-next-line no-console
        console.error('Matomo not installed')
      }
    } as MatomoApi
  }
}
