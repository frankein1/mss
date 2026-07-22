import { afterEach, beforeEach, describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { prismaClient } from '~/server/prisma'

let familyFileId: string
let beneficiaryId: string

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
      fileNumber: 'TEST-EXT-ORG-001',
      status: 'Active'
    }
  })
  beneficiaryId = beneficiary.id
})

afterEach(async () => {
  await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
})

const baseInput = () => ({
  id: beneficiaryId
})

describe('External Organisations - Update - Authorizations', () => {
  test('A ReceptionAgent cannot update external organisations', async ({
    trpc
  }) => {
    await expect(
      trpc.receptionAgent.beneficiary.updateExternalOrganisations(baseInput())
    ).rejects.toThrow(/not allowed to access route/i)
  })

  test('A user from another structure cannot update external organisations', async ({
    trpc
  }) => {
    await expect(
      trpc.structureManagerMinistere.beneficiary.updateExternalOrganisations(
        baseInput()
      )
    ).rejects.toThrow(/no record/i)
  })
})

describe('External Organisations - Update - Fields', () => {
  test('A StructureManager can update external organisation fields', async ({
    trpc
  }) => {
    const result =
      await trpc.structureManager.beneficiary.updateExternalOrganisations({
        ...baseInput(),
        representative: 'M. Dupont',
        prescribingStructure: 'CCAS Paris'
      })

    expect(result.id).toBe(beneficiaryId)

    const beneficiary = await prismaClient.beneficiary.findUnique({
      where: { id: beneficiaryId }
    })
    expect(beneficiary?.representative).toBe('M. Dupont')
    expect(beneficiary?.prescribingStructure).toBe('CCAS Paris')
  })
})
