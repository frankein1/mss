import type { InjectionKey } from 'vue'

export const STATS_COLLAPSED_LIMIT = 5

export const STATS_NULL_KEY = 'null'
export const STATS_NULL_LABEL = 'Non renseigné'

// Id of the parent StatsCard title, used to name the nested stats tables
export const statsCardTitleIdInjectionKey: InjectionKey<string> =
  Symbol('statsCardTitleId')
