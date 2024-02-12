import dayjs, { Dayjs } from 'dayjs'
import { AgeGroup } from '~/client/options'

export function ageGroupToDateRange(ageGroup: AgeGroup): {
  [key: string]: Dayjs
} {
  switch (ageGroup) {
    case AgeGroup.Less25:
      return { lower: dayjs().subtract(25, 'year').add(1, 'day') }
    case AgeGroup.Group25_34:
      return {
        lower: dayjs().subtract(35, 'year').add(1, 'day'),
        upper: dayjs().subtract(25, 'year')
      }
    case AgeGroup.Group35_44:
      return {
        lower: dayjs().subtract(45, 'year').add(1, 'day'),
        upper: dayjs().subtract(35, 'year')
      }
    case AgeGroup.Group45_54:
      return {
        lower: dayjs().subtract(55, 'year').add(1, 'day'),
        upper: dayjs().subtract(45, 'year')
      }
    case AgeGroup.Group55_64:
      return {
        lower: dayjs().subtract(65, 'year').add(1, 'day'),
        upper: dayjs().subtract(55, 'year')
      }
    case AgeGroup.More65:
      return { upper: dayjs().subtract(65, 'year') }
  }
}
