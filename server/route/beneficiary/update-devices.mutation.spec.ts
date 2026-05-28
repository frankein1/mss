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

const structureId = fixtureStructures[FixtureStructure.Test].id
const referentId = fixturesUsers[FixtureUserRole.Referent].id
const socialWorkerId = fixturesUsers[FixtureUserRole.SocialWorker].id

const DEVICE_NAMES_USED = [
  'UDT-Portage de repas',
  'UDT-Ancien dispositif',
  'UDT-Nouveau dispositif',
  'UDT-Nouveau nom',
  'UDT-Dispositif référent',
  'UDT-Dispositif complet'
]

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
      fileNumber: 'TEST-DEVICE-001',
      status: 'Active'
    }
  })
  beneficiaryId = beneficiary.id
})

afterEach(async () => {
  await prismaClient.beneficiaryDevice.deleteMany({ where: { beneficiaryId } })
  await prismaClient.beneficiaryDeviceName.deleteMany({
    where: { structureId, name: { in: DEVICE_NAMES_USED } }
  })
  await prismaClient.beneficiary.deleteMany({ where: { id: beneficiaryId } })
  await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
})

describe('Authorizations', () => {
  test('Un ReceptionAgent ne peut pas modifier les dispositifs', async ({
    trpc
  }) => {
    await expect(
      trpc.receptionAgent.beneficiary.updateDevices({
        id: beneficiaryId,
        devices: []
      })
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  test('Un utilisateur dune autre structure ne peut pas modifier les dispositifs', async ({
    trpc
  }) => {
    await expect(
      trpc.structureManagerMinistere.beneficiary.updateDevices({
        id: beneficiaryId,
        devices: []
      })
    ).rejects.toThrowError(/no record/i)
  })
})

describe('Comportement', () => {
  test('Un StructureManager peut ajouter des dispositifs', async ({ trpc }) => {
    const deviceId = v4()
    const result = await trpc.structureManager.beneficiary.updateDevices({
      id: beneficiaryId,
      devices: [{ id: deviceId, name: 'UDT-Portage de repas' }]
    })

    expect(result.id).toBe(beneficiaryId)

    const devices = await prismaClient.beneficiaryDevice.findMany({
      where: { beneficiaryId },
      include: { deviceName: true }
    })
    expect(devices).toHaveLength(1)
    expect(devices[0].deviceName.name).toBe('UDT-Portage de repas')
  })

  test('La mise à jour remplace tous les dispositifs existants', async ({
    trpc
  }) => {
    await trpc.structureManager.beneficiary.updateDevices({
      id: beneficiaryId,
      devices: [{ id: v4(), name: 'UDT-Ancien dispositif' }]
    })

    await trpc.structureManager.beneficiary.updateDevices({
      id: beneficiaryId,
      devices: [{ id: v4(), name: 'UDT-Nouveau dispositif' }]
    })

    const devices = await prismaClient.beneficiaryDevice.findMany({
      where: { beneficiaryId },
      include: { deviceName: true }
    })
    expect(devices).toHaveLength(1)
    expect(devices[0].deviceName.name).toBe('UDT-Nouveau dispositif')
  })

  test('Le nom de dispositif est créé sil nexiste pas encore', async ({
    trpc
  }) => {
    await trpc.structureManager.beneficiary.updateDevices({
      id: beneficiaryId,
      devices: [{ id: v4(), name: 'UDT-Nouveau nom' }]
    })

    const deviceName = await prismaClient.beneficiaryDeviceName.findUnique({
      where: {
        structureId_name: { structureId, name: 'UDT-Nouveau nom' }
      }
    })
    expect(deviceName).not.toBeNull()
  })

  test('Un Referent peut modifier les dispositifs dun bénéficiaire dont il est référent', async ({
    trpc
  }) => {
    const result = await trpc.referent.beneficiary.updateDevices({
      id: beneficiaryId,
      devices: [{ id: v4(), name: 'UDT-Dispositif référent' }]
    })
    expect(result.id).toBe(beneficiaryId)
  })

  test('Les champs optionnels sont correctement enregistrés', async ({
    trpc
  }) => {
    const deviceId = v4()
    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-06-30')

    await trpc.structureManager.beneficiary.updateDevices({
      id: beneficiaryId,
      devices: [
        {
          id: deviceId,
          name: 'UDT-Dispositif complet',
          startDate,
          endDate,
          exitReason: 'Fin de prise en charge',
          partnerOrganisationName: 'CCAS',
          precisions: 'Intervenant : M. Dupont'
        }
      ]
    })

    const device = await prismaClient.beneficiaryDevice.findUnique({
      where: { id: deviceId }
    })
    expect(device?.startDate).toEqual(startDate)
    expect(device?.endDate).toEqual(endDate)
    expect(device?.exitReason).toBe('Fin de prise en charge')
    expect(device?.partnerOrganisationName).toBe('CCAS')
    expect(device?.precisions).toBe('Intervenant : M. Dupont')
  })
})
