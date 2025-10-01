import { ChartColor } from '~/utils/color/chartColors'

export const STATS_NULL_COLOR = ChartColor.Gray

export const getStatColor = <T extends string>(
  colors: Record<T, string>,
  key: T | null
): string => (key ? (colors[key] ?? STATS_NULL_COLOR) : STATS_NULL_COLOR)
