export function useMatomo() {
  const { $loadTracker, $trackEvent } = useNuxtApp()

  return {
    loadTracker: $loadTracker,
    trackEvent: $trackEvent
  }
}
