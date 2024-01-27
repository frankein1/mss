import { Dayjs } from 'dayjs'

type StatBase = {
  key: string
  label: string
  picto?: string
}

export type StatList = StatBase & {
  color?: string
  count: number
}

type StatPie = StatBase & {
  color: string
  count: number
}

export type StatsListPropType = Array<StatList>
export type StatsPiePropType = Array<StatPie>

export type AgeGroupsFilter = { lower?: Dayjs; upper?: Dayjs }
