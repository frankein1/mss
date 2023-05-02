type StatBase = {
  key: string
  label: string
}

export type StatList = StatsBase & {
  color?: string
  count: number | string
}

type StatPie = StatBase & {
  color: string
  count: number
}

export type StatsListPropType = Array<StatList>
export type StatsPiePropType = Array<StatPie>
