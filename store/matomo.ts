import { defineStore } from 'pinia'
import type { MatomoApi } from '~/types/matomo'

export const useMatomoStore = defineStore({
  id: 'matomo',

  state: () => ({
    tracker: null as MatomoApi | null
  }),

  actions: {
    loadTracker(tracker: MatomoApi) {
      this.tracker = tracker
    }
  }
})
