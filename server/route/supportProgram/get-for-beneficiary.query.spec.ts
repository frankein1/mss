import { afterEach, beforeEach, describe, expect } from 'vitest'
import { test } from '~~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~~/prisma/fixtures'
import { prismaClient } from '~~/server/prisma'

let familyFileId: string
let beneficiaryId: string
let lifecycleNameId: string
let nonLifecycleNameId: string

const structureId = fixtureStructures[FixtureStructure.Test].id
const referentId = fixturesUsers[FixtureUserRole.Referent].id
const socialWorkerId = fixturesUsers[FixtureUserRole.SocialWorker].id

beforeEach(async () => {
  const familyFile = await prismaClient.familyFile.create({
    data: {
      structure: { connect: { id: structureId } },
      referents: { connect: [{ id: referentId }] }
    }
  })
  familyFileId = familyFile.id

  const beneficiary = await prismaClient.beneficiary.create({
    data: {
      familyFile: { connect: { id: familyFileId } },
      structure: { connect: { id: structureId } },
      createdBy: { connect: { id: socialWorkerId } },
      fileNumber: 'TEST-GET-SUPPORT-PROGRAMS-001',
      status: 'Active'
    }
  })
  beneficiaryId = beneficiary.id

  const [{ id: nameId1 }, { id: nameId2 }] = await Promise.all([
    prismaClient.supportProgramName.create({
      select: { id: true },
      data: {
        name: `GSPFB-Lifecycle-${crypto.randomUUID()}`,
        structureId,
        createdById: socialWorkerId,
        hasLifecycle: true
      }
    }),
    prismaClient.supportProgramName.create({
      select: { id: true },
      data: {
        name: `GSPFB-NonLifecycle-${crypto.randomUUID()}`,
        structureId,
        createdById: socialWorkerId,
        hasLifecycle: false
      }
    })
  ])
  lifecycleNameId = nameId1
  nonLifecycleNameId = nameId2

  await Promise.all([
    prismaClient.supportProgram.create({
      data: {
        id: crypto.randomUUID(),
        beneficiary: { connect: { id: beneficiaryId } },
        supportProgramName: { connect: { id: lifecycleNameId } },
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
      }
    }),
    prismaClient.supportProgram.create({
      data: {
        id: crypto.randomUUID(),
        beneficiary: { connect: { id: beneficiaryId } },
        supportProgramName: { connect: { id: nonLifecycleNameId } },
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-09-30')
      }
    })
  ])
})

afterEach(async () => {
  await prismaClient.supportProgram.deleteMany({
    where: { beneficiaryId }
  })
  await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
  await prismaClient.supportProgramName.deleteMany({
    where: { id: { in: [lifecycleNameId, nonLifecycleNameId] } }
  })
})

describe('Support Program - Get For Beneficiary', () => {
  test('Returns support programs for a beneficiary', async ({ trpc }) => {
    const result = await trpc.structureManager.supportProgram.getForBeneficiary(
      {
        beneficiaryId
      }
    )
    expect(result).toHaveLength(2)
  })

  test('Lifecycle name returns dates', async ({ trpc }) => {
    const result = await trpc.structureManager.supportProgram.getForBeneficiary(
      {
        beneficiaryId
      }
    )

    const lifecycleEntry = result.find(
      sp => sp.supportProgramName.id === lifecycleNameId
    )
    expect(lifecycleEntry!.startDate).toEqual(new Date('2024-01-01'))
    expect(lifecycleEntry!.endDate).toEqual(new Date('2024-12-31'))
    expect(lifecycleEntry!.supportProgramName.hasLifecycle).toBe(true)
  })

  test('Non-lifecycle name strips dates', async ({ trpc }) => {
    const result = await trpc.structureManager.supportProgram.getForBeneficiary(
      {
        beneficiaryId
      }
    )

    const nonLifecycleEntry = result.find(
      sp => sp.supportProgramName.id === nonLifecycleNameId
    )
    expect(nonLifecycleEntry!.startDate).toBeNull()
    expect(nonLifecycleEntry!.endDate).toBeNull()
    expect(nonLifecycleEntry!.supportProgramName.hasLifecycle).toBe(false)
  })

  test('Another structure cannot access beneficiary support programs', async ({
    trpc
  }) => {
    await expect(
      trpc.structureManagerMinistere.supportProgram.getForBeneficiary({
        beneficiaryId
      })
    ).rejects.toThrow(/beneficiary[\s\S]*?no record/im)
  })
})
