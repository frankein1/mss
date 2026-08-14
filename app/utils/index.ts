import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'

dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

export function dateIsSameOrBefore(date: Dayjs, upper: Dayjs): boolean {
  return date.isSameOrBefore(upper, 'day')
}

export function dateIsSameOrAfter(date: Dayjs, lower: Dayjs): boolean {
  return date.isSameOrAfter(lower, 'day')
}

export function dateIsBetween(
  date: Dayjs,
  lower: Dayjs,
  upper: Dayjs
): boolean {
  return date.isBetween(lower, upper, 'day', '[]')
}

export * from './beneficiary'
export * from './formatSearchPattern'
