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
const socialWorkerId = fixturesUsers[FixtureUserRole.SocialWorker].id

let deviceNameIds: string[] = []

beforeEach(async () => {
  const suffix = v4()
  const created = await prismaClient.beneficiaryDeviceName.createManyAndReturn({
    data: [
      {
        name: `GDNL-Portage de repas-${suffix}`,
        structureId,
        createdById: socialWorkerId
      },
      {
        name: `GDNL-Retour à lemploi-${suffix}`,
        structureId,
        createdById: socialWorkerId
      }
    ]
  })
  deviceNameIds = created.map(d => d.id)
})

afterEach(async () => {
  await prismaClient.beneficiaryDeviceName.deleteMany({
    where: { id: { in: deviceNameIds } }
  })
  deviceNameIds = []
})

describe('Comportement', () => {
  test('Retourne les noms de dispositifs de la structure', async ({ trpc }) => {
    const result = await trpc.structureManager.beneficiary.getDeviceNameList()

    const ids = result.map(d => d.id)
    expect(ids).toEqual(expect.arrayContaining(deviceNameIds))
  })

  test('Ne retourne pas les noms de dispositifs dune autre structure', async ({
    trpc
  }) => {
    const result =
      await trpc.structureManagerMinistere.beneficiary.getDeviceNameList()

    const ids = result.map(d => d.id)
    expect(ids).not.toEqual(expect.arrayContaining(deviceNameIds))
  })
})
