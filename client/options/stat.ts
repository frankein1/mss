import { STATS_NULL_KEY, STATS_NULL_LABEL } from '~/utils/constants/stats'
import { StatPeriodFilter } from '~~/types/stat'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const getStatLabel = <T extends string>(
  labels: Record<T, string>,
  key: T | null
): string =>
  key && key !== STATS_NULL_KEY && key in labels
    ? labels[key]
    : STATS_NULL_LABEL

export const periodKeys = buildKeys({
  [StatPeriodFilter.ThisYear]: 'Cette année',
  [StatPeriodFilter.LastYear]: "L'année dernière",
  [StatPeriodFilter.ThisMonth]: 'Ce mois-ci',
  [StatPeriodFilter.LastMonth]: 'Le mois dernier',
  [StatPeriodFilter.Custom]: 'Personnalisée'
})
