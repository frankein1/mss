import { inject } from 'vue'
import type { MatomoApi } from '~/types/matomo'

export function useMatomo() {
  const matomo = inject<MatomoApi>('Matomo')

  if (!matomo) {
    const { isProduction } = useEnvironment()
    if (!isProduction) {
      return {
        matomo: {
          trackEvent: () => {}
        } as MatomoApi
      }
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

  return { matomo }
}
