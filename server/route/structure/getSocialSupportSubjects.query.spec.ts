import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'

describe('Structure - Get Social Support Subjects - Data', () => {
  test('A SocialWorker gets all subjects including inactive', async ({
    trpc
  }) => {
    const result = await trpc.socialWorker.structure.getSocialSupportSubjects()
    expect(result.length).toBeGreaterThan(0)
  })
})
