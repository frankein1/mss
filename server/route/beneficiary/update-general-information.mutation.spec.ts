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

const structureId = fixtureStructures[FixtureStructure.Test].id
const socialWorkerId = fixturesUsers[FixtureUserRole.SocialWorker].id
const referentId = fixturesUsers[FixtureUserRole.Referent].id
const structureManagerMinistereId =
  fixturesUsers[FixtureUserRole.StructureManagerMinistere].id

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
      fileNumber: 'TEST001',
      status: 'Active'
    }
  })
  beneficiaryId = beneficiary.id
})

afterEach(async () => {
  await prismaClient.beneficiary.deleteMany({ where: { id: beneficiaryId } })
  await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
})

describe('Beneficiary - updateGeneralInformation - Authorizations', () => {
  test("A ReceptionAgent cannot change a beneficiary's referents", async ({
    trpc
  }) => {
    await expect(
      trpc.receptionAgent.beneficiary.updateGeneralInformation({
        id: beneficiaryId,
        structureId,
        referents: [referentId, socialWorkerId],
        aidantConnectAuthorized: false,
        vulnerablePerson: false,
        status: 'Active'
      })
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  test('A StructureManager from another structure cannot update general information', async ({
    trpc
  }) => {
    await expect(
      trpc.structureManagerMinistere.beneficiary.updateGeneralInformation({
        id: beneficiaryId,
        structureId,
        referents: [referentId],
        aidantConnectAuthorized: false,
        vulnerablePerson: false,
        status: 'Active'
      })
    ).rejects.toThrow(/no record/i)
  })

  test('A StructureManager cannot assign a referent from another structure', async ({
    trpc
  }) => {
    await expect(
      trpc.structureManager.beneficiary.updateGeneralInformation({
        id: beneficiaryId,
        structureId,
        referents: [referentId, structureManagerMinistereId],
        aidantConnectAuthorized: false,
        vulnerablePerson: false,
        status: 'Active'
      })
    ).rejects.toThrow(/not allowed to access route/i)
  })
})
