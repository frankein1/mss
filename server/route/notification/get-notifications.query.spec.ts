import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'

describe('Notification - Get - Data', () => {
  test('A SocialWorker can fetch notifications', async ({ trpc }) => {
    const result = await trpc.socialWorker.notification.get({
      onlyUnread: false,
      page: 1,
      perPage: 10
    })
    expect(result.notifications).toBeDefined()
    expect(result.totalCount).toBeGreaterThanOrEqual(0)
  })

  test('A user only sees their own notifications', async ({ trpc }) => {
    const referentResult = await trpc.referent.notification.get({
      onlyUnread: false,
      page: 1,
      perPage: 50
    })
    const instructorResult = await trpc.instructor.notification.get({
      onlyUnread: false,
      page: 1,
      perPage: 50
    })

    const referentIds = referentResult.notifications.map(n => n.id)
    const instructorIds = instructorResult.notifications.map(n => n.id)
    const overlap = referentIds.filter(id => instructorIds.includes(id))
    expect(overlap).toHaveLength(0)
  })

  test('onlyUnread filters correctly', async ({ trpc }) => {
    const allResult = await trpc.referent.notification.get({
      onlyUnread: false,
      page: 1,
      perPage: 50
    })
    const unreadResult = await trpc.referent.notification.get({
      onlyUnread: true,
      page: 1,
      perPage: 50
    })
    expect(unreadResult.totalCount).toBeLessThanOrEqual(allResult.totalCount)
    for (const n of unreadResult.notifications) {
      expect(n.read).toBe(false)
    }
  })

  test('Pagination returns totalCount', async ({ trpc }) => {
    const result = await trpc.referent.notification.get({
      onlyUnread: false,
      page: 1,
      perPage: 5
    })
    expect(typeof result.totalCount).toBe('number')
    expect(result.notifications.length).toBeLessThanOrEqual(5)
  })
})
