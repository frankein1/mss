import { describe, expect, afterEach } from 'vitest'
import { inferProcedureInput } from '@trpc/server'
import {
  fixturesBeneficiaries,
  FixtureBeneficiary,
  FixtureUserRole,
  fixturesUsers
} from '~/prisma/fixtures'
import { test } from '~/test/server/test-utils'
import { prismaClient } from '~/server/prisma'

import { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<
  AppRouter['beneficiary']['addFamilyFileMember']
>

const idInstructeur = fixturesUsers[FixtureUserRole.Instructor].id
const idStructureManager = fixturesUsers[FixtureUserRole.StructureManager].id
const idStructureManagerNew =
  fixturesUsers[FixtureUserRole.StructureManagerNew].id
const familyFileId =
  fixturesBeneficiaries[FixtureBeneficiary.TEARLE].familyFileId

async function resetDatabaseAfterTest(
  usualName: string,
  firstName: string,
  familyFileId: string
) {
  await Promise.all([
    prismaClient.beneficiary.deleteMany({
      where: { usualName, firstName }
    }),
    prismaClient.familyFile.update({
      where: { id: familyFileId },
      data: {
        referents: {
          disconnect: [{ id: idInstructeur }, { id: idStructureManagerNew }]
        }
      }
    })
  ])
}

afterEach(async () => {
  await resetDatabaseAfterTest('TEARLE', 'Camille', familyFileId)
})

async function getNewCreatedbeneficiaryAndFile(
  beneficiaryId: string,
  familyFileId: string
) {
  return await Promise.all([
    prismaClient.beneficiary.findUniqueOrThrow({
      where: { id: beneficiaryId }
    }),
    prismaClient.familyFile.findUniqueOrThrow({
      where: { id: familyFileId },
      include: { referents: true }
    })
  ])
}

describe('Beneficiary - Add Member to Family File - StructureManager', () => {
  test('should fail to add member from another structure', async ({ trpc }) => {
    const familyFileIdMartin =
      fixturesBeneficiaries[FixtureBeneficiary.MARTIN].familyFileId

    const input: Input = {
      familyFileId: familyFileIdMartin,
      usualName: 'TEARLE',
      firstName: 'Camille',
      referents: [idInstructeur, idStructureManager],
      relationship: 'Conjoint'
    }

    await expect(() =>
      trpc.structureManager.beneficiary.addFamilyFileMember(input)
    ).rejects.toThrowError(/no familyfile found/i)
  })

  test.fails(
    'should not update referent to one from another structure',
    async ({ trpc }) => {
      const input: Input = {
        familyFileId,
        usualName: 'TEARLE',
        firstName: 'Camille',
        referents: [idInstructeur, idStructureManager, idStructureManagerNew],
        relationship: 'Conjoint'
      }

      const { id } =
        await trpc.structureManager.beneficiary.addFamilyFileMember(input)

      expect(id).toBeDefined()

      const [beneficiary, file] = await getNewCreatedbeneficiaryAndFile(
        id,
        familyFileId
      )

      expect(beneficiary.firstName).toBe('Camille')
      expect(beneficiary.usualName).toBe('TEARLE')
      expect(beneficiary.relationship).toBe('Conjoint')
      expect(beneficiary.familyFileId).toBe(familyFileId)
      expect(file.referents).toHaveLength(2)

      // Currently it is possible to update the referents to one from
      // another structure. Is it a problem if reading is restricted?
      // We should test that new structure manager cannot read the new beneficiary
    }
  )

  test('should add member when family belongs to structure', async ({
    trpc
  }) => {
    const input: Input = {
      familyFileId,
      usualName: 'TEARLE',
      firstName: 'Camille',
      referents: [idInstructeur, idStructureManager],
      relationship: 'Conjoint'
    }

    const { id } =
      await trpc.structureManager.beneficiary.addFamilyFileMember(input)

    expect(id).toBeDefined()

    const [beneficiary, file] = await getNewCreatedbeneficiaryAndFile(
      id,
      familyFileId
    )

    expect(beneficiary.firstName).toBe('Camille')
    expect(beneficiary.usualName).toBe('TEARLE')
    expect(beneficiary.relationship).toBe('Conjoint')
    expect(beneficiary.familyFileId).toBe(familyFileId)
    expect(file.referents).toHaveLength(2)
  })
})
