import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'

describe('Structure - Get Active Social Support Subjects - Data', () => {
  test('A SocialWorker gets active-only subjects', async ({ trpc }) => {
    const result =
      await trpc.socialWorker.structure.getActiveSocialSupportSubjects()
    expect(result.length).toBeGreaterThan(0)
    for (const subject of result) {
      expect(subject.inactive).toBe(false)
    }
  })
})
