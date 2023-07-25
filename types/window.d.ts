interface Window {
  dsfr: (node: HTMLElement) => any
  Matomo?: {
    getAsyncTracker: () => MatomoApi
  }
}
