import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'

describe('Structure - Get Active Or Used Social Support Subjects - Data', () => {
  test('A SocialWorker gets active and used subjects', async ({ trpc }) => {
    const result =
      await trpc.socialWorker.structure.getActiveOrUsedSocialSupportSubjects()
    expect(result.length).toBeGreaterThan(0)
    for (const subject of result) {
      expect(subject.inactive === false || subject.used === true).toBe(true)
    }
  })
})
