import { test } from '~~/test/server/test-utils'
import { fixturesSocialSupportSubjects } from '~~/prisma/fixtures'
import { describe, expect } from 'vitest'

describe('Authorizations', () => {
  test('Admin - Update Subject - Only an admin can use the route', async ({
    trpc
  }) => {
    const id = fixturesSocialSupportSubjects[0].id
    await expect(() =>
      trpc.socialWorker.admin.updateSocialSupportSubject({
        id,
        name: 'new name'
      })
    ).rejects.toThrow(/user is not an administrator/i)
  })
})
