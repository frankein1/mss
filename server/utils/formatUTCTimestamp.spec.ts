import { vi, test, expect, beforeAll, afterEach } from 'vitest'
import { formatUTCTimestamp } from './formatUTCTimestamp'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

beforeAll(() => {
  dayjs.extend(utc)
})

afterEach(() => vi.unstubAllEnvs())

test('Format date from UTC timestamp should not modify date or hour', () => {
  vi.stubEnv('TZ', 'UTC')

  expect(
    formatUTCTimestamp(new Date('2025-03-20 20:19 +0000'), 'YYYY-MM-DD HH:mm')
  ).toBe('2025-03-20 20:19')
})
