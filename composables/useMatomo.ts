import type { MatomoApi } from '~/types/matomo'
import { useMatomoStore } from '~/store/matomo'

export function useMatomo() {
  const matomoStore = useMatomoStore()

  const storeTracker = matomoStore.tracker

  if (storeTracker) {
    return { matomo: storeTracker }
  }

  return {
    matomo: {
      trackEvent: () => {
        // eslint-disable-next-line no-console
        console.error('Matomo not installed')
      }
    } as MatomoApi
  }
}
