import { afterEach, describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { prismaClient } from '~/server/prisma'
import { v4 } from 'uuid'

const structureId = fixtureStructures[FixtureStructure.Test].id
const managerId = fixturesUsers[FixtureUserRole.StructureManager].id
const referentId = fixturesUsers[FixtureUserRole.Referent].id

const nameIds: string[] = []
const beneficiaryIds: string[] = []
const familyFileIds: string[] = []

afterEach(async () => {
  await prismaClient.beneficiary.deleteMany({
    where: { id: { in: beneficiaryIds } }
  })
  await prismaClient.familyFile.deleteMany({
    where: { id: { in: familyFileIds } }
  })
  await prismaClient.supportProgramName.deleteMany({
    where: { id: { in: nameIds } }
  })
  nameIds.length = 0
  beneficiaryIds.length = 0
  familyFileIds.length = 0
})

async function createBeneficiary(fileNumber: string) {
  const familyFile = await prismaClient.familyFile.create({
    data: {
      structure: { connect: { id: structureId } },
      referents: { connect: [{ id: referentId }] }
    }
  })
  familyFileIds.push(familyFile.id)

  const beneficiary = await prismaClient.beneficiary.create({
    data: {
      familyFile: { connect: { id: familyFile.id } },
      structure: { connect: { id: structureId } },
      createdBy: { connect: { id: managerId } },
      fileNumber,
      status: 'Active'
    }
  })
  beneficiaryIds.push(beneficiary.id)
  return beneficiary
}

describe('SupportProgram - Count Name Usage - Authorizations', () => {
  test('A SocialWorker cannot count support program name usage', async ({
    trpc
  }) => {
    await expect(
      trpc.socialWorker.supportProgram.countNameUsage({ id: v4() })
    ).rejects.toThrowError(/not allowed to access route/i)
  })

  test('A ReceptionAgent cannot count support program name usage', async ({
    trpc
  }) => {
    await expect(
      trpc.receptionAgent.supportProgram.countNameUsage({ id: v4() })
    ).rejects.toThrowError(/not allowed to access route/i)
  })

  test('A Referent cannot count support program name usage', async ({
    trpc
  }) => {
    await expect(
      trpc.referent.supportProgram.countNameUsage({ id: v4() })
    ).rejects.toThrowError(/not allowed to access route/i)
  })
})

describe('SupportProgram - Count Name Usage - Count Scoping', () => {
  test('Returns 0 for a name with no linked programs', async ({ trpc }) => {
    const { id } = await prismaClient.supportProgramName.create({
      data: {
        name: `UCN-Sans-programme-${v4()}`,
        structureId,
        createdById: managerId
      },
      select: { id: true }
    })
    nameIds.push(id)

    const count = await trpc.structureManager.supportProgram.countNameUsage({
      id
    })
    expect(count).toBe(0)
  })

  test('Returns the correct count of linked programs', async ({ trpc }) => {
    const { id: nameId } = await prismaClient.supportProgramName.create({
      data: {
        name: `UCN-Avec-programmes-${v4()}`,
        structureId,
        createdById: managerId
      },
      select: { id: true }
    })
    nameIds.push(nameId)

    const b1 = await createBeneficiary(`UCN-B1-${v4()}`)
    const b2 = await createBeneficiary(`UCN-B2-${v4()}`)

    await prismaClient.supportProgram.createMany({
      data: [
        {
          id: v4(),
          beneficiaryId: b1.id,
          supportProgramNameId: nameId
        },
        {
          id: v4(),
          beneficiaryId: b2.id,
          supportProgramNameId: nameId
        }
      ]
    })

    const count = await trpc.structureManager.supportProgram.countNameUsage({
      id: nameId
    })
    expect(count).toBe(2)
  })

  test('Does not count programs from another structure', async ({ trpc }) => {
    const { id: nameId } = await prismaClient.supportProgramName.create({
      data: {
        name: `UCN-Cross-${v4()}`,
        structureId,
        createdById: managerId
      },
      select: { id: true }
    })
    nameIds.push(nameId)

    const beneficiary = await createBeneficiary(`UCN-CROSS-${v4()}`)

    await prismaClient.supportProgram.create({
      data: {
        id: v4(),
        beneficiary: { connect: { id: beneficiary.id } },
        supportProgramName: { connect: { id: nameId } }
      }
    })

    // structureManagerMinistere queries a name that belongs to the Test structure
    // → structure scope filters it out → 0
    const count =
      await trpc.structureManagerMinistere.supportProgram.countNameUsage({
        id: nameId
      })
    expect(count).toBe(0)
  })
})
