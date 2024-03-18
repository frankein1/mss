import { STATS_NULL_KEY } from '~/utils/constants/stats'
import { StatPeriodFilter } from '~/types/stat'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const STATS_NULL_LABEL = 'Non renseigné'

export const getStatLabel = <T extends string>(
  labels: Record<T, string>,
  key: T | null
) => (key && key !== STATS_NULL_KEY ? labels[key] : STATS_NULL_LABEL)

export const periodKeys = buildKeys({
  [StatPeriodFilter.ThisYear]: 'Cette année',
  [StatPeriodFilter.LastYear]: "L'année dernière",
  [StatPeriodFilter.ThisMonth]: 'Ce mois-ci',
  [StatPeriodFilter.LastMonth]: 'Le mois dernier',
  [StatPeriodFilter.Custom]: 'Personnaliser'
})
