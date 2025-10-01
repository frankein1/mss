import dayjs from 'dayjs'
import { AgeGroup } from '~/client/options'
import { ageGroupToDateRange } from '~/utils/ageGroupToDateRange'
import { dateIsBetween, dateIsSameOrBefore, dateIsSameOrAfter } from '~/utils'

const ageGroupRanges = Object.values(AgeGroup).map(ageGroup => ({
  ...ageGroupToDateRange(ageGroup),
  ageGroup
}))

export default function getAgeGroup(birthdate: Date) {
  const birthdatejs = dayjs(birthdate)
  const range = ageGroupRanges.find(range => {
    if (range.lower && range.upper) {
      return dateIsBetween(birthdatejs, range.lower, range.upper)
    }
    if (range.lower) {
      return dateIsSameOrAfter(birthdatejs, range.lower)
    }
    if (range.upper) {
      return dateIsSameOrBefore(birthdatejs, range.upper)
    }
    return false
  })
  if (!range) {
    throw Error('Impossible to compute age group')
  }
  return range.ageGroup
}
