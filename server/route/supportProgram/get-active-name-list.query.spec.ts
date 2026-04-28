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
const referentId = fixturesUsers[FixtureUserRole.Referent].id
const socialWorkerId = fixturesUsers[FixtureUserRole.SocialWorker].id

let familyFileId: string
let beneficiaryId: string
let supportProgramNameWithBeneficiaryId: string
let supportProgramNameWithoutBeneficiaryId: string

beforeEach(async () => {
  const suffix = crypto.randomUUID()

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
      fileNumber: `TEST-GASPNL-${suffix}`,
      status: 'Active'
    }
  })
  beneficiaryId = beneficiary.id

  const supportProgramNameWithBeneficiary =
    await prismaClient.supportProgramName.create({
      data: {
        name: `GASPNL-With-beneficiary-${suffix}`,
        structureId,
        createdById: socialWorkerId
      }
    })
  supportProgramNameWithBeneficiaryId = supportProgramNameWithBeneficiary.id

  const supportProgramNameWithoutBeneficiary =
    await prismaClient.supportProgramName.create({
      data: {
        name: `GASPNL-Without-beneficiary-${suffix}`,
        structureId,
        createdById: socialWorkerId
      }
    })
  supportProgramNameWithoutBeneficiaryId =
    supportProgramNameWithoutBeneficiary.id

  await prismaClient.supportProgram.create({
    data: {
      id: crypto.randomUUID(),
      beneficiary: { connect: { id: beneficiaryId } },
      supportProgramName: {
        connect: { id: supportProgramNameWithBeneficiaryId }
      }
    }
  })
})

afterEach(async () => {
  await prismaClient.supportProgram.deleteMany({
    where: { beneficiaryId }
  })
  await prismaClient.beneficiary.deleteMany({ where: { id: beneficiaryId } })
  await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
  await prismaClient.supportProgramName.deleteMany({
    where: {
      id: {
        in: [
          supportProgramNameWithBeneficiaryId,
          supportProgramNameWithoutBeneficiaryId
        ]
      }
    }
  })
})

describe('Support Program - Get Active Name List - Filtering', () => {
  test('Returns only names linked to at least one support program', async ({
    trpc
  }) => {
    const result =
      await trpc.structureManager.supportProgram.getActiveNameList()

    const ids = result.map(d => d.id)
    expect(ids).toContain(supportProgramNameWithBeneficiaryId)
    expect(ids).not.toContain(supportProgramNameWithoutBeneficiaryId)
  })

  test('Returns hasLifecycle in the response', async ({ trpc }) => {
    const result =
      await trpc.structureManager.supportProgram.getActiveNameList()

    const item = result.find(d => d.id === supportProgramNameWithBeneficiaryId)
    expect(item?.hasLifecycle).toBe(false)
  })
})

describe('Support Program - Get Active Name List - Authorizations', () => {
  test('Another structure cannot see active names from this structure', async ({
    trpc
  }) => {
    const result =
      await trpc.structureManagerMinistere.supportProgram.getActiveNameList()

    const ids = result.map(d => d.id)
    expect(ids).not.toContain(supportProgramNameWithBeneficiaryId)
  })
})
