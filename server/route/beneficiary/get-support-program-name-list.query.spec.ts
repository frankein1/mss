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

const structureId = fixtureStructures[FixtureStructure.Test].id
const referentId = fixturesUsers[FixtureUserRole.Referent].id
const socialWorkerId = fixturesUsers[FixtureUserRole.SocialWorker].id

let familyFileId: string
let beneficiaryId: string
let supportProgramNameWithBeneficiaryId: string
let supportProgramNameWithoutBeneficiaryId: string

beforeEach(async () => {
  const suffix = v4()

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
      fileNumber: `TEST-GSPNL-${suffix}`,
      status: 'Active'
    }
  })
  beneficiaryId = beneficiary.id

  const supportProgramNameWithBeneficiary =
    await prismaClient.supportProgramName.create({
      data: {
        name: `GSPNL-Avec-beneficiaire-${suffix}`,
        structureId,
        createdById: socialWorkerId
      }
    })
  supportProgramNameWithBeneficiaryId = supportProgramNameWithBeneficiary.id

  const supportProgramNameWithoutBeneficiary =
    await prismaClient.supportProgramName.create({
      data: {
        name: `GSPNL-Sans-beneficiaire-${suffix}`,
        structureId,
        createdById: socialWorkerId
      }
    })
  supportProgramNameWithoutBeneficiaryId =
    supportProgramNameWithoutBeneficiary.id

  await prismaClient.supportProgram.create({
    data: {
      id: v4(),
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

describe('Comportement', () => {
  test('Retourne uniquement les noms de dispositifs liés à au moins un bénéficiaire', async ({
    trpc
  }) => {
    const result =
      await trpc.structureManager.beneficiary.getSupportProgramNameList()

    const ids = result.map(d => d.id)
    expect(ids).toContain(supportProgramNameWithBeneficiaryId)
    expect(ids).not.toContain(supportProgramNameWithoutBeneficiaryId)
  })

  test('Ne retourne pas les noms de dispositifs dune autre structure', async ({
    trpc
  }) => {
    const result =
      await trpc.structureManagerMinistere.beneficiary.getSupportProgramNameList()

    const ids = result.map(d => d.id)
    expect(ids).not.toContain(supportProgramNameWithBeneficiaryId)
  })
})
