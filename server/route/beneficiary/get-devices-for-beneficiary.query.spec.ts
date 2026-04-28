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
let deviceNameId: string

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
      fileNumber: 'TEST-GET-DEVICES-001',
      status: 'Active'
    }
  })
  beneficiaryId = beneficiary.id

  const deviceName = await prismaClient.beneficiaryDeviceName.create({
    data: {
      name: `GDFB-SAVS-${v4()}`,
      structureId,
      createdById: socialWorkerId
    }
  })
  deviceNameId = deviceName.id

  await prismaClient.beneficiaryDevice.create({
    data: {
      id: v4(),
      beneficiary: { connect: { id: beneficiaryId } },
      deviceName: { connect: { id: deviceNameId } },
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31')
    }
  })
})

afterEach(async () => {
  await prismaClient.beneficiary.deleteMany({ where: { id: beneficiaryId } })
  await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
  await prismaClient.beneficiaryDeviceName.deleteMany({
    where: { id: deviceNameId }
  })
})

describe('Comportement', () => {
  test('Retourne les dispositifs dun bénéficiaire', async ({ trpc }) => {
    const result =
      await trpc.structureManager.beneficiary.getDevicesForBeneficiary({
        beneficiaryId
      })

    expect(result).toHaveLength(1)
    expect(result[0].startDate).toEqual(new Date('2024-01-01'))
    expect(result[0].endDate).toEqual(new Date('2024-12-31'))
    expect(result[0].deviceName.id).toBe(deviceNameId)
  })

  test('Retourne un tableau vide si beneficiaryId est vide', async ({
    trpc
  }) => {
    const result =
      await trpc.structureManager.beneficiary.getDevicesForBeneficiary({
        beneficiaryId: ''
      })
    expect(result).toEqual([])
  })

  test('Ne peut pas accéder aux dispositifs dun bénéficiaire dune autre structure', async ({
    trpc
  }) => {
    await expect(
      trpc.structureManagerMinistere.beneficiary.getDevicesForBeneficiary({
        beneficiaryId
      })
    ).rejects.toThrowError(/no record/i)
  })
})
