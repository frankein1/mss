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

export type StatsList = Array<StatList>
export type StatsPie = Array<StatPie>
