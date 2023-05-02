export const STATS_NULL_LABEL = 'Non renseigné'

export const getStatLabel = <T extends string>(
  labels: Record<T, string>,
  key: T | null
) => (key ? labels[key] : STATS_NULL_LABEL)
