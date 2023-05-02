import { AgeGroup } from '~/client/options/ageGroup'
import { Dayjs } from 'dayjs'

export type AgeGroupsFilter = { lower?: Dayjs; upper?: Dayjs }

export enum NullAgeGroup {
  null = 'null'
}

export type AgeGroupOrNull = AgeGroup | NullAgeGroup
