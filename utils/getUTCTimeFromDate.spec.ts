import { test, expect, beforeAll } from 'vitest'
import { getUTCTimeFromDate } from './getUTCTimeFromDate'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

beforeAll(() => {
  dayjs.extend(utc)
})

test('a date in UTC timezone has time preserved when removing timezone', () => {
  expect(getUTCTimeFromDate(new Date('2025-03-20T12:00:00.000Z'))).toBe('12h00')
})

test('a date in UTC timezone with single digit hour and minute is properly formatted', () => {
  expect(getUTCTimeFromDate(new Date('2025-03-20T01:08:00.000Z'))).toBe('01h08')
})

test('a date in Guadeloupe timezone returns time in UTC timezone', () => {
  expect(getUTCTimeFromDate(new Date('2025-03-20 08:00:00 -0400'))).toBe(
    '12h00'
  )
})

test('a date in 1970-01-01 UTC (used by prisma to store time) has time preserved when removing timezone', () => {
  expect(getUTCTimeFromDate(new Date('1970-01-01T12:00:00.000Z'))).toBe('12h00')
})
