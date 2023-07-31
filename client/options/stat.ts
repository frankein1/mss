import { STATS_NULL_KEY } from '~/utils/constants/stats'

export const STATS_NULL_LABEL = 'Non renseigné'

export const getStatLabel = <T extends string>(
  labels: Record<T, string>,
  key: T | null
) => (key && key !== STATS_NULL_KEY ? labels[key] : STATS_NULL_LABEL)
