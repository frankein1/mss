import { afterEach, beforeEach, describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { prismaClient } from '~/server/prisma'

const structureId = fixtureStructures[FixtureStructure.Test].id
const socialWorkerId = fixturesUsers[FixtureUserRole.SocialWorker].id

let familyFileId: string
let beneficiaryId: string
let deviceNameId: string

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
      fileNumber: 'TEST-DEVICE-NAMES-FF',
      status: 'Active'
    }
  })
  beneficiaryId = beneficiary.id

  const deviceName = await prismaClient.beneficiaryDeviceName.create({
    data: {
      name: 'Aide alimentaire-GETNAMES',
      structureId,
      createdById: socialWorkerId
    }
  })
  deviceNameId = deviceName.id

  await prismaClient.beneficiaryDevice.create({
    data: {
      beneficiary: { connect: { id: beneficiaryId } },
      deviceName: { connect: { id: deviceNameId } }
    }
  })
})

afterEach(async () => {
  await prismaClient.beneficiaryDevice.deleteMany({ where: { beneficiaryId } })
  await prismaClient.beneficiaryDeviceName.deleteMany({
    where: { id: deviceNameId }
  })
  await prismaClient.beneficiary.deleteMany({ where: { id: beneficiaryId } })
  await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
})

describe('FamilyFile - getDeviceNames', () => {
  test('returns device names of all beneficiaries in the family file', async ({
    trpc
  }) => {
    const names = await trpc.structureManager.file.getDeviceNamesForFamilyFile({
      familyFileId
    })
    expect(names).toContain('Aide alimentaire-GETNAMES')
  })

  test('returns unique names sorted alphabetically', async ({ trpc }) => {
    const names = await trpc.structureManager.file.getDeviceNamesForFamilyFile({
      familyFileId
    })
    expect(names).toEqual([...new Set(names)].sort())
  })
})

describe('FamilyFile - getDeviceNames - Authorizations', () => {
  test('a user from another structure cannot get device names', async ({
    trpc
  }) => {
    await expect(
      trpc.structureManagerMinistere.file.getDeviceNamesForFamilyFile({
        familyFileId
      })
    ).rejects.toThrow()
  })

  test('a SocialWorker can get device names', async ({ trpc }) => {
    await expect(
      trpc.socialWorker.file.getDeviceNamesForFamilyFile({ familyFileId })
    ).resolves.toBeDefined()
  })
})
