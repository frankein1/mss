import { describe, expect, afterEach } from 'vitest'
import type { inferProcedureInput } from '@trpc/server'
import { BeneficiaryStatus } from '@prisma/client'
import { fixturesUsers, FixtureUserRole } from '~/prisma/fixtures'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'
import type { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['beneficiary']['create']>

const referentId = fixturesUsers[FixtureUserRole.SocialWorker].id

const baseInput: Input = {
  status: BeneficiaryStatus.Active,
  referents: [referentId]
}

let createdFamilyFileId: string | undefined

afterEach(async () => {
  if (createdFamilyFileId) {
    await prismaClient.familyFile.delete({ where: { id: createdFamilyFileId } })
    createdFamilyFileId = undefined
  }
})

describe('Beneficiary - Create - Authorizations', () => {
  test('should allow structureManager to create a beneficiary', async ({
    trpc
  }) => {
    const { id, familyFileId } =
      await trpc.structureManager.beneficiary.create(baseInput)
    createdFamilyFileId = familyFileId
    expect(id).toBeDefined()
  })

  test('should allow socialWorker to create a beneficiary', async ({
    trpc
  }) => {
    const { id, familyFileId } =
      await trpc.socialWorker.beneficiary.create(baseInput)
    createdFamilyFileId = familyFileId
    expect(id).toBeDefined()
  })

  test('should allow receptionAgent to create a beneficiary', async ({
    trpc
  }) => {
    const { id, familyFileId } =
      await trpc.receptionAgent.beneficiary.create(baseInput)
    createdFamilyFileId = familyFileId
    expect(id).toBeDefined()
  })

  test('creatBeneficiary - cannot create a beneficiary to another structure', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManagerMinistere.beneficiary.create(baseInput)
    ).rejects.toThrow(/not allowed to access route/i)
  })
})
