import { vi, test, expect, beforeAll, afterEach } from 'vitest'
import { formatDateToLocalTimezone } from './formatDateToLocalTimezone'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

beforeAll(() => {
  dayjs.extend(utc)
})

const FORMAT = 'YYYY-MM-DD HH:mm'

afterEach(() => vi.unstubAllEnvs())

test('UTC time is converted to Guadeloupe timezone if set as system timezone', () => {
  vi.stubEnv('TZ', 'America/Guadeloupe')

  expect(
    formatDateToLocalTimezone(new Date('2025-03-20T12:00:00.000Z'), FORMAT)
  ).toBe('2025-03-20 08:00')
})

test('UTC time is unchanged if system timezone is UTC', () => {
  vi.stubEnv('TZ', 'UTC')

  expect(
    formatDateToLocalTimezone(new Date('2025-03-20T12:00:00.000Z'), FORMAT)
  ).toBe('2025-03-20 12:00')
})
