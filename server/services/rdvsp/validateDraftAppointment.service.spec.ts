import { expect, test, beforeAll } from 'vitest'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { test as t } from './validateDraftAppointment.service'

beforeAll(() => {
  dayjs.extend(utc)
})

test('Extract date for appointment setting should change the timezone to UTC while preserving the original time', () => {
  expect(
    t.getDateWithoutTimezoneInformation('2025-02-19 11:53:10 +0100')
  ).toStrictEqual(new Date('2025-02-19T11:53:10.000Z'))
})
