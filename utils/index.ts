import { Dayjs } from 'dayjs'

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
