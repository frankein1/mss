import { describe, expect, test, beforeAll } from 'vitest'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { test as t } from './validateDraftAppointment.service'

beforeAll(() => {
  dayjs.extend(utc)
})

describe('Extract date for appointment setting should change the timezone to UTC while preserving the original time', () => {
  test('with + timezone', () => {
    expect(
      t.getDateWithoutTimezoneInformation('2025-02-19 11:53:10 +0100')
    ).toStrictEqual(new Date('2025-02-19T11:53:10.000Z'))
  })

  test('with - timezone', () => {
    expect(
      t.getDateWithoutTimezoneInformation('2025-02-19 11:53:10 -0100')
    ).toStrictEqual(new Date('2025-02-19T11:53:10.000Z'))
  })

  test('without space before timezone', () => {
    expect(
      t.getDateWithoutTimezoneInformation('2025-02-19 11:53:10-0500')
    ).toStrictEqual(new Date('2025-02-19T11:53:10.000Z'))
  })

  test('with utc format', () => {
    expect(
      t.getDateWithoutTimezoneInformation('2025-02-19 11:53:10.000Z')
    ).toStrictEqual(new Date('2025-02-19T11:53:10.000Z'))
  })
})
