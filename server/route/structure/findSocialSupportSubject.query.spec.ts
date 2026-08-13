import { describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import { fixturesSocialSupportSubjects } from '~~/prisma/fixtures'

describe('Structure - Find Social Support Subject - Data', () => {
  test('A SocialWorker finds an existing subject by name', async ({ trpc }) => {
    const name = fixturesSocialSupportSubjects[0]!.name
    const result = await trpc.socialWorker.structure.findSocialSupportSubject({
      name
    })
    expect(result).not.toBeNull()
    expect(result!.name).toBe(name)
  })

  test('Returns null for an unknown name', async ({ trpc }) => {
    const result = await trpc.socialWorker.structure.findSocialSupportSubject({
      name: 'NonExistentSubjectXYZ'
    })
    expect(result).toBeNull()
  })
})
