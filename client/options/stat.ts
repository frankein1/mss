import { STATS_NULL_KEY } from '~/utils/constants/stats'
import { StatPeriodFilter } from '~/types/stat'

export const STATS_NULL_LABEL = 'Non renseigné'

export const getStatLabel = <T extends string>(
  labels: Record<T, string>,
  key: T | null
) => (key && key !== STATS_NULL_KEY ? labels[key] : STATS_NULL_LABEL)

export const periodOptions = new Map<StatPeriodFilter, string>([
  [StatPeriodFilter.ThisYear, 'Cette année'],
  [StatPeriodFilter.LastYear, "L'année dernière"],
  [StatPeriodFilter.ThisMonth, 'Ce mois-ci'],
  [StatPeriodFilter.LastMonth, 'Le mois dernier'],
  [StatPeriodFilter.Custom, 'Personnaliser']
])
