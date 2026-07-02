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
  await prismaClient.socialSupport.deleteMany({
    where: { beneficiaryId: { in: beneficiaryIds } }
  })
  await prismaClient.supportProgram.deleteMany({
    where: { beneficiaryId: { in: beneficiaryIds } }
  })
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

async function createBeneficiaryWithProgram() {
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
      fileNumber: `CLSS-${v4()}`,
      status: 'Active'
    }
  })
  beneficiaryIds.push(beneficiary.id)

  const supportProgramName = await prismaClient.supportProgramName.create({
    data: {
      name: `CLSS-${v4()}`,
      structureId,
      createdById: managerId
    },
    select: { id: true }
  })
  nameIds.push(supportProgramName.id)

  const supportProgram = await prismaClient.supportProgram.create({
    data: {
      id: v4(),
      beneficiary: { connect: { id: beneficiary.id } },
      supportProgramName: { connect: { id: supportProgramName.id } }
    },
    select: { id: true }
  })

  return { familyFile, beneficiary, supportProgram }
}

describe('SupportProgram - Count Linked Social Supports - Count', () => {
  test('Returns 0 when no social supports reference the support program', async ({
    trpc
  }) => {
    const { supportProgram } = await createBeneficiaryWithProgram()

    const count =
      await trpc.structureManager.supportProgram.countLinkedSocialSupports({
        id: supportProgram.id
      })
    expect(count).toBe(0)
  })

  test('Returns correct count when social supports are linked', async ({
    trpc
  }) => {
    const { familyFile, beneficiary, supportProgram } =
      await createBeneficiaryWithProgram()

    await prismaClient.socialSupport.create({
      data: {
        structure: { connect: { id: structureId } },
        familyFile: { connect: { id: familyFile.id } },
        beneficiary: { connect: { id: beneficiary.id } },
        createdBy: { connect: { id: managerId } },
        status: 'InProgress',
        socialSupportType: 'Followup',
        supportProgram: { connect: { id: supportProgram.id } },
        followup: { create: { medium: 'PlannedInPerson' } }
      }
    })

    await prismaClient.socialSupport.create({
      data: {
        structure: { connect: { id: structureId } },
        familyFile: { connect: { id: familyFile.id } },
        beneficiary: { connect: { id: beneficiary.id } },
        createdBy: { connect: { id: managerId } },
        status: 'InProgress',
        socialSupportType: 'Followup',
        supportProgram: { connect: { id: supportProgram.id } },
        followup: { create: { medium: 'PlannedInPerson' } }
      }
    })

    const count =
      await trpc.structureManager.supportProgram.countLinkedSocialSupports({
        id: supportProgram.id
      })
    expect(count).toBe(2)
  })

  test('Scoped to user structure — cross-structure support programs return 0', async ({
    trpc
  }) => {
    const { familyFile, beneficiary, supportProgram } =
      await createBeneficiaryWithProgram()

    await prismaClient.socialSupport.create({
      data: {
        structure: { connect: { id: structureId } },
        familyFile: { connect: { id: familyFile.id } },
        beneficiary: { connect: { id: beneficiary.id } },
        createdBy: { connect: { id: managerId } },
        status: 'InProgress',
        socialSupportType: 'Followup',
        supportProgram: { connect: { id: supportProgram.id } },
        followup: { create: { medium: 'PlannedInPerson' } }
      }
    })

    const count =
      await trpc.structureManagerMinistere.supportProgram.countLinkedSocialSupports(
        { id: supportProgram.id }
      )
    expect(count).toBe(0)
  })
})
