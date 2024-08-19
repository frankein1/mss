import { describe, expect, afterEach } from 'vitest'
import { inferProcedureInput } from '@trpc/server'
import { fixturesBeneficiaries, FixtureBeneficiary } from '~/prisma/fixtures'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'

import { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<
  AppRouter['beneficiary']['createFamilyFileMember']
>

const familyFileId =
  fixturesBeneficiaries[FixtureBeneficiary.TEARLE].familyFileId

async function resetDatabaseAfterTest(usualName: string, firstName: string) {
  await prismaClient.beneficiary.deleteMany({
    where: { usualName, firstName }
  })
}

afterEach(async () => {
  await resetDatabaseAfterTest('TEARLE', 'Camille')
})

async function getNewCreatedbeneficiaryAndFile(beneficiaryId: string) {
  return await prismaClient.beneficiary.findUniqueOrThrow({
    where: { id: beneficiaryId }
  })
}

describe('Beneficiary - Add Member to Family File - StructureManager', () => {
  test.fails(
    'should fail to add member from another structure',
    async ({ trpc }) => {
      const familyFileIdMartin =
        fixturesBeneficiaries[FixtureBeneficiary.MARTIN].familyFileId
      const input: Input = {
        familyFileId: familyFileIdMartin,
        usualName: 'TEARLE',
        firstName: 'Camille',
        relationship: 'Conjoint'
      }

      await expect(() =>
        trpc.structureManager.beneficiary.createFamilyFileMember(input)
      ).rejects.toThrowError(/no familyfile found/i)
    }
  )

  test('should add member when family belongs to structure', async ({
    trpc
  }) => {
    const input: Input = {
      familyFileId,
      usualName: 'TEARLE',
      firstName: 'Camille',
      relationship: 'Conjoint'
    }

    const { id } =
      await trpc.structureManager.beneficiary.createFamilyFileMember(input)

    expect(id).toBeDefined()

    const beneficiary = await getNewCreatedbeneficiaryAndFile(id)

    expect(beneficiary.firstName).toBe('Camille')
    expect(beneficiary.usualName).toBe('TEARLE')
    expect(beneficiary.relationship).toBe('Conjoint')
    expect(beneficiary.familyFileId).toBe(familyFileId)
  })
})
