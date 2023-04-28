type StatBase = {
  key: string
  label: string
  count: number
}

type StatList = StatsBase & {
  color?: string
}

type StatPie = StatBase & {
  color: string
}

export type StatsList = Array<StatList>
export type StatsPie = Array<StatPie>
