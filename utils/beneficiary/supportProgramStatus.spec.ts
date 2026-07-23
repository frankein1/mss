import { vi, test, expect, afterEach, describe } from 'vitest'
import {
  supportProgramStatus,
  formatSupportProgramDateRange
} from './supportProgramStatus'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
})

function fakeToday(dateStr: string) {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(`${dateStr}T12:00:00.000Z`))
}

function utcDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00.000Z`)
}

describe('supportProgramStatus', () => {
  describe('returns En cours', () => {
    test('when no start and no end date', () => {
      expect(supportProgramStatus({ startDate: null, endDate: null })).toBe(
        'En cours'
      )
    })

    test('when start date is today', () => {
      fakeToday('2026-06-23')
      expect(
        supportProgramStatus({
          startDate: utcDate('2026-06-23'),
          endDate: null
        })
      ).toBe('En cours')
    })

    test('when start date is in the past', () => {
      fakeToday('2026-06-23')
      expect(
        supportProgramStatus({
          startDate: utcDate('2026-01-01'),
          endDate: null
        })
      ).toBe('En cours')
    })

    test('when end date is today', () => {
      fakeToday('2026-06-23')
      expect(
        supportProgramStatus({
          startDate: utcDate('2026-01-01'),
          endDate: utcDate('2026-06-23')
        })
      ).toBe('En cours')
    })
  })

  describe('returns À venir', () => {
    test('when start date is in the future', () => {
      fakeToday('2026-06-23')
      expect(
        supportProgramStatus({
          startDate: utcDate('2026-07-01'),
          endDate: null
        })
      ).toBe('À venir')
    })

    test('when start date is tomorrow', () => {
      fakeToday('2026-06-23')
      expect(
        supportProgramStatus({
          startDate: utcDate('2026-06-24'),
          endDate: null
        })
      ).toBe('À venir')
    })
  })

  describe('returns Terminé', () => {
    test('when end date is in the past', () => {
      fakeToday('2026-06-23')
      expect(
        supportProgramStatus({
          startDate: utcDate('2026-01-01'),
          endDate: utcDate('2026-06-22')
        })
      ).toBe('Terminé')
    })
  })

  describe('timezone safety', () => {
    const timezones = [
      'Pacific/Noumea',
      'America/Guadeloupe',
      'Europe/Paris',
      'Pacific/Tahiti',
      'Indian/Mayotte'
    ]

    for (const tz of timezones) {
      describe(`in ${tz}`, () => {
        test('program starting today is En cours', () => {
          vi.stubEnv('TZ', tz)
          fakeToday('2026-06-23')
          expect(
            supportProgramStatus({
              startDate: utcDate('2026-06-23'),
              endDate: null
            })
          ).toBe('En cours')
        })

        test('program starting tomorrow is À venir', () => {
          vi.stubEnv('TZ', tz)
          fakeToday('2026-06-23')
          expect(
            supportProgramStatus({
              startDate: utcDate('2026-06-24'),
              endDate: null
            })
          ).toBe('À venir')
        })

        test('program ending today is En cours', () => {
          vi.stubEnv('TZ', tz)
          fakeToday('2026-06-23')
          expect(
            supportProgramStatus({
              startDate: utcDate('2026-01-01'),
              endDate: utcDate('2026-06-23')
            })
          ).toBe('En cours')
        })

        test('program ending yesterday is Terminé', () => {
          vi.stubEnv('TZ', tz)
          fakeToday('2026-06-23')
          expect(
            supportProgramStatus({
              startDate: utcDate('2026-01-01'),
              endDate: utcDate('2026-06-22')
            })
          ).toBe('Terminé')
        })
      })
    }
  })
})

describe('formatSupportProgramDateRange', () => {
  test('returns empty string when no start date', () => {
    expect(
      formatSupportProgramDateRange({ startDate: null, endDate: null })
    ).toBe('')
  })

  test('returns start date with arrow when no end date', () => {
    expect(
      formatSupportProgramDateRange({
        startDate: utcDate('2026-01-15'),
        endDate: null
      })
    ).toBe("15/01/2026 →  (aujourd'hui)")
  })

  test('returns date range when both dates exist', () => {
    expect(
      formatSupportProgramDateRange({
        startDate: utcDate('2026-01-15'),
        endDate: utcDate('2026-06-30')
      })
    ).toBe('15/01/2026 → 30/06/2026')
  })
})
