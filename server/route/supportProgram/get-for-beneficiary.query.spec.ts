import { afterEach, beforeEach, describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { prismaClient } from '~/server/prisma'
import { v4 } from 'uuid'

let familyFileId: string
let beneficiaryId: string
let supportProgramNameId: string

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

  const supportProgramName = await prismaClient.supportProgramName.create({
    data: {
      name: `GSPFB-SAVS-${v4()}`,
      structureId,
      createdById: socialWorkerId
    }
  })
  supportProgramNameId = supportProgramName.id

  await prismaClient.supportProgram.create({
    data: {
      id: v4(),
      beneficiary: { connect: { id: beneficiaryId } },
      supportProgramName: { connect: { id: supportProgramNameId } },
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31')
    }
  })
})

afterEach(async () => {
  await prismaClient.beneficiary.deleteMany({ where: { id: beneficiaryId } })
  await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
  await prismaClient.supportProgramName.deleteMany({
    where: { id: supportProgramNameId }
  })
})

describe('Support Program - Get For Beneficiary', () => {
  test('Returns support programs for a beneficiary', async ({ trpc }) => {
    const result = await trpc.structureManager.supportProgram.getForBeneficiary(
      {
        beneficiaryId
      }
    )

    expect(result).toHaveLength(1)
    expect(result[0]!.startDate).toEqual(new Date('2024-01-01'))
    expect(result[0]!.endDate).toEqual(new Date('2024-12-31'))
    expect(result[0]!.supportProgramName.id).toBe(supportProgramNameId)
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
