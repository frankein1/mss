import type { Dayjs } from 'dayjs'

type StatBase = {
  key: string
  label: string
  picto?: string
}

export type StatList = StatBase & {
  color?: string
  count: number
  subCount?: number
  emphasis?: boolean
  description?: string
}

type StatPie = StatBase & {
  color: string
  count: number
}

export type StatArrayRow = [label: string, ...values: (number | null)[]]

export type StatsListPropType = Array<StatList>

export type StatsArrayPropType = Array<StatArrayRow>

export type StatsPiePropType = Array<StatPie>

export type AgeGroupsFilter = { lower?: Dayjs; upper?: Dayjs }

export enum StatPeriodFilter {
  ThisYear = 'ThisYear',
  LastYear = 'LastYear',
  ThisMonth = 'ThisMonth',
  LastMonth = 'LastMonth',
  Custom = 'Custom'
}

export type StatsCardConfig = {
  [key: string]: {
    id: string
    name: string
  }
}
