import { describe, vi, expect, beforeEach, afterEach, it } from 'vitest'
import createArchiveDueNotifications, {
  getInactiveBeneficiaries
} from './archiveNotifications'
import { getBeneficiaryLastActivity } from '../services/beneficiary/get-last-activity.service'

describe.skip('createArchiveDueNotifications', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers()
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  it('should return right number of notifications', async () => {
    // set hour within business hours
    const dateNow = new Date()
    const future = new Date('2029-01-01') // timeout au dessus de 100 secondes
    const inOneYear = new Date('2026-01-01') // timeout au dessus de 100 secondes
    const inApril = new Date('2025-04-04')
    vi.setSystemTime(dateNow)

    const notificationsCount = await createArchiveDueNotifications()
    console.log(notificationsCount)
    expect(notificationsCount).toBe(1140)
  })
}, 30000)
