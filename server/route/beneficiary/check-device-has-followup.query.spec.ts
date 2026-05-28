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
let deviceId: string
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
      fileNumber: 'TEST-CHK-DEVICE-001',
      status: 'Active'
    }
  })
  beneficiaryId = beneficiary.id

  const deviceName = await prismaClient.beneficiaryDeviceName.create({
    data: {
      name: `CDHF-Dispositif-${v4()}`,
      structureId,
      createdById: socialWorkerId
    }
  })
  deviceNameId = deviceName.id

  const device = await prismaClient.beneficiaryDevice.create({
    data: {
      id: v4(),
      beneficiary: { connect: { id: beneficiaryId } },
      deviceName: { connect: { id: deviceNameId } }
    }
  })
  deviceId = device.id
})

afterEach(async () => {
  await prismaClient.beneficiary.deleteMany({ where: { id: beneficiaryId } })
  await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
  await prismaClient.beneficiaryDeviceName.deleteMany({
    where: { id: deviceNameId }
  })
})

describe('Comportement', () => {
  test('Retourne false si le dispositif nest lié à aucun suivi', async ({
    trpc
  }) => {
    const result =
      await trpc.structureManager.beneficiary.checkDeviceHasFollowup({
        deviceId
      })
    expect(result).toBe(false)
  })

  test('Retourne true si le dispositif est lié à un suivi', async ({
    trpc
  }) => {
    await prismaClient.socialSupport.create({
      data: {
        date: new Date(),
        structure: { connect: { id: structureId } },
        familyFile: { connect: { id: familyFileId } },
        beneficiary: { connect: { id: beneficiaryId } },
        createdBy: { connect: { id: referentId } },
        lastUpdatedBy: { connect: { id: referentId } },
        status: 'InProgress',
        socialSupportType: 'Followup',
        followup: {
          create: {
            medium: 'PlannedInPerson',
            beneficiaryDevice: { connect: { id: deviceId } }
          }
        }
      }
    })

    const result =
      await trpc.structureManager.beneficiary.checkDeviceHasFollowup({
        deviceId
      })
    expect(result).toBe(true)
  })
})
