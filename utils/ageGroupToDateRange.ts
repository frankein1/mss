import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { AgeGroup } from '~/client/options'

export function ageGroupToDateRange(ageGroup: AgeGroup): {
  [key: string]: Dayjs
} {
  const today = dayjs().hour(0).minute(0).second(0).millisecond(0)
  switch (ageGroup) {
    case AgeGroup.Less18:
      return { lower: today.subtract(18, 'year').add(1, 'day') }
    case AgeGroup.Group18_24:
      return {
        lower: today.subtract(25, 'year').add(1, 'day'),
        upper: today.subtract(18, 'year')
      }
    case AgeGroup.Group25_34:
      return {
        lower: today.subtract(35, 'year').add(1, 'day'),
        upper: today.subtract(25, 'year')
      }
    case AgeGroup.Group35_44:
      return {
        lower: today.subtract(45, 'year').add(1, 'day'),
        upper: today.subtract(35, 'year')
      }
    case AgeGroup.Group45_54:
      return {
        lower: today.subtract(55, 'year').add(1, 'day'),
        upper: today.subtract(45, 'year')
      }
    case AgeGroup.Group55_64:
      return {
        lower: today.subtract(65, 'year').add(1, 'day'),
        upper: today.subtract(55, 'year')
      }
    case AgeGroup.More65:
      return { upper: today.subtract(65, 'year') }
  }
}
