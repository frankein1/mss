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
let deviceNameWithBeneficiaryId: string
let deviceNameWithoutBeneficiaryId: string

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
      fileNumber: `TEST-GDNL-${suffix}`,
      status: 'Active'
    }
  })
  beneficiaryId = beneficiary.id

  const deviceNameWithBeneficiary =
    await prismaClient.beneficiaryDeviceName.create({
      data: {
        name: `GDNL-Avec-beneficiaire-${suffix}`,
        structureId,
        createdById: socialWorkerId
      }
    })
  deviceNameWithBeneficiaryId = deviceNameWithBeneficiary.id

  const deviceNameWithoutBeneficiary =
    await prismaClient.beneficiaryDeviceName.create({
      data: {
        name: `GDNL-Sans-beneficiaire-${suffix}`,
        structureId,
        createdById: socialWorkerId
      }
    })
  deviceNameWithoutBeneficiaryId = deviceNameWithoutBeneficiary.id

  await prismaClient.beneficiaryDevice.create({
    data: {
      id: v4(),
      beneficiary: { connect: { id: beneficiaryId } },
      deviceName: { connect: { id: deviceNameWithBeneficiaryId } }
    }
  })
})

afterEach(async () => {
  await prismaClient.beneficiaryDevice.deleteMany({ where: { beneficiaryId } })
  await prismaClient.beneficiary.deleteMany({ where: { id: beneficiaryId } })
  await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
  await prismaClient.beneficiaryDeviceName.deleteMany({
    where: {
      id: { in: [deviceNameWithBeneficiaryId, deviceNameWithoutBeneficiaryId] }
    }
  })
})

describe('Comportement', () => {
  test('Retourne uniquement les noms de dispositifs liés à au moins un bénéficiaire', async ({
    trpc
  }) => {
    const result = await trpc.structureManager.beneficiary.getDeviceNameList()

    const ids = result.map(d => d.id)
    expect(ids).toContain(deviceNameWithBeneficiaryId)
    expect(ids).not.toContain(deviceNameWithoutBeneficiaryId)
  })

  test('Ne retourne pas les noms de dispositifs dune autre structure', async ({
    trpc
  }) => {
    const result =
      await trpc.structureManagerMinistere.beneficiary.getDeviceNameList()

    const ids = result.map(d => d.id)
    expect(ids).not.toContain(deviceNameWithBeneficiaryId)
  })
})
