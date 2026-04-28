import { afterEach, beforeEach, describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~~/prisma/fixtures'
import { prismaClient } from '~~/server/prisma'

const structureId = fixtureStructures[FixtureStructure.Test].id
const socialWorkerId = fixturesUsers[FixtureUserRole.SocialWorker].id

let familyFileId: string
let beneficiaryId: string
let supportProgramNameId: string

beforeEach(async () => {
  const familyFile = await prismaClient.familyFile.create({
    data: { structure: { connect: { id: structureId } } }
  })
  familyFileId = familyFile.id

  const beneficiary = await prismaClient.beneficiary.create({
    data: {
      familyFile: { connect: { id: familyFileId } },
      structure: { connect: { id: structureId } },
      createdBy: { connect: { id: socialWorkerId } },
      fileNumber: 'TEST-SUPPORT-PROGRAM-NAMES-FF',
      status: 'Active'
    }
  })
  beneficiaryId = beneficiary.id

  const supportProgramName = await prismaClient.supportProgramName.create({
    data: {
      name: 'Aide alimentaire-GETNAMES',
      structureId,
      createdById: socialWorkerId
    }
  })
  supportProgramNameId = supportProgramName.id

  await prismaClient.supportProgram.create({
    data: {
      beneficiary: { connect: { id: beneficiaryId } },
      supportProgramName: { connect: { id: supportProgramNameId } }
    }
  })
})

afterEach(async () => {
  await prismaClient.supportProgram.deleteMany({
    where: { beneficiaryId }
  })
  await prismaClient.supportProgramName.deleteMany({
    where: { id: supportProgramNameId }
  })
  await prismaClient.beneficiary.deleteMany({ where: { id: beneficiaryId } })
  await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
})

describe('FamilyFile - getSupportProgramNames', () => {
  test('returns support program names of all beneficiaries in the family file', async ({
    trpc
  }) => {
    const result =
      await trpc.structureManager.supportProgram.getNamesForFamilyFile({
        familyFileId
      })
    expect(result).toContainEqual(
      expect.objectContaining({
        id: supportProgramNameId,
        name: 'Aide alimentaire-GETNAMES'
      })
    )
  })

  test('returns unique names sorted alphabetically', async ({ trpc }) => {
    const result =
      await trpc.structureManager.supportProgram.getNamesForFamilyFile({
        familyFileId
      })
    const names = result.map(r => r.name)
    expect(names).toEqual([...new Set(names)].sort())
  })
})

describe('FamilyFile - getSupportProgramNames - Authorizations', () => {
  test('a user from another structure cannot get support program names', async ({
    trpc
  }) => {
    await expect(
      trpc.structureManagerMinistere.supportProgram.getNamesForFamilyFile({
        familyFileId
      })
    ).rejects.toThrowError(/familyFile[\s\S]*?no record/im)
  })

  test('a SocialWorker can get support program names', async ({ trpc }) => {
    const result = await trpc.socialWorker.supportProgram.getNamesForFamilyFile(
      {
        familyFileId
      }
    )
    expect(result).toContainEqual(
      expect.objectContaining({
        id: supportProgramNameId,
        name: 'Aide alimentaire-GETNAMES'
      })
    )
  })
})
