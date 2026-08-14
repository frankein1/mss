import { vi, test, expect, beforeAll, afterEach } from 'vitest'
import { formatDate } from './formatDate'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

beforeAll(() => {
  dayjs.extend(utc)
})

const FORMAT = 'YYYY-MM-DD'

afterEach(() => vi.unstubAllEnvs())

test('Extract date from UTC timestamp without converting to Guadeloupe timezone', () => {
  vi.stubEnv('TZ', 'America/Guadeloupe')

  expect(formatDate(new Date('2025-03-20 00:00 +0000'), FORMAT)).toBe(
    '2025-03-20'
  )
})

test('Extract date from UTC timestamp without converting to Guadeloupe timezone', () => {
  vi.stubEnv('TZ', 'Pacific/Noumea')

  expect(formatDate(new Date('2025-03-20 00:00 +0000'), FORMAT)).toBe(
    '2025-03-20'
  )
})

test('Extract date from UTC timestamp', () => {
  vi.stubEnv('TZ', 'UTC')

  expect(formatDate(new Date('2025-03-20 00:00 +0000'), FORMAT)).toBe(
    '2025-03-20'
  )
})
