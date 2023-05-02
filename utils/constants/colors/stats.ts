export const STATS_NULL_COLOR = '#AAA'

export const getStatColor = <T extends string>(
  colors: Record<T, string>,
  key: T | null
) => (key ? colors[key] : STATS_NULL_COLOR)
