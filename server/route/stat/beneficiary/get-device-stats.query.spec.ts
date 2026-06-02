import { afterEach, beforeEach, describe, expect } from 'vitest'
import type { inferProcedureInput } from '@trpc/server'
import { test } from '~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~/prisma/fixtures'
import { prismaClient } from '~/server/prisma'
import { v4 } from 'uuid'
import { StatPeriodFilter } from '~/types/stat'
import type { AppRouter } from '~/server/trpc/routers'

type Input = inferProcedureInput<AppRouter['stat']['getBeneficiaryDeviceStats']>

const structureId = fixtureStructures[FixtureStructure.Test].id
const socialWorkerId = fixturesUsers[FixtureUserRole.SocialWorker].id
const referentId = fixturesUsers[FixtureUserRole.Referent].id

let familyFileId: string
let beneficiary1Id: string
let beneficiary2Id: string
let deviceNameAId: string
let deviceNameBId: string

const PERIOD_IN = new Date('2024-06-01')
const PERIOD_OUT = new Date('2023-01-15')

beforeEach(async () => {
  const suffix = v4()

  const familyFile = await prismaClient.familyFile.create({
    data: {
      structure: { connect: { id: structureId } },
      referents: { connect: [{ id: referentId }] }
    }
  })
  familyFileId = familyFile.id

  const [b1, b2] = await Promise.all([
    prismaClient.beneficiary.create({
      data: {
        familyFile: { connect: { id: familyFileId } },
        structure: { connect: { id: structureId } },
        createdBy: { connect: { id: socialWorkerId } },
        fileNumber: `DS-B1-${suffix}`,
        status: 'Active'
      }
    }),
    prismaClient.beneficiary.create({
      data: {
        familyFile: { connect: { id: familyFileId } },
        structure: { connect: { id: structureId } },
        createdBy: { connect: { id: socialWorkerId } },
        fileNumber: `DS-B2-${suffix}`,
        status: 'Active'
      }
    })
  ])
  beneficiary1Id = b1.id
  beneficiary2Id = b2.id

  const [dnA, dnB] = await Promise.all([
    prismaClient.beneficiaryDeviceName.create({
      data: {
        name: `DS-DeviceA-${suffix}`,
        structureId,
        createdById: socialWorkerId
      }
    }),
    prismaClient.beneficiaryDeviceName.create({
      data: {
        name: `DS-DeviceB-${suffix}`,
        structureId,
        createdById: socialWorkerId
      }
    })
  ])
  deviceNameAId = dnA.id
  deviceNameBId = dnB.id

  // beneficiary1 → deviceA with startDate in 2024, endDate in 2023
  // beneficiary2 → deviceA with no dates
  // beneficiary2 → deviceB with startDate in 2023
  await Promise.all([
    prismaClient.beneficiaryDevice.create({
      data: {
        beneficiary: { connect: { id: beneficiary1Id } },
        deviceName: { connect: { id: deviceNameAId } },
        startDate: new Date('2024-06-15'),
        endDate: new Date('2023-12-01')
      }
    }),
    prismaClient.beneficiaryDevice.create({
      data: {
        beneficiary: { connect: { id: beneficiary2Id } },
        deviceName: { connect: { id: deviceNameAId } }
      }
    }),
    prismaClient.beneficiaryDevice.create({
      data: {
        beneficiary: { connect: { id: beneficiary2Id } },
        deviceName: { connect: { id: deviceNameBId } },
        startDate: new Date('2023-03-10')
      }
    })
  ])
})

afterEach(async () => {
  await prismaClient.beneficiaryDevice.deleteMany({
    where: { beneficiaryId: { in: [beneficiary1Id, beneficiary2Id] } }
  })
  await prismaClient.beneficiary.deleteMany({
    where: { id: { in: [beneficiary1Id, beneficiary2Id] } }
  })
  await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
  await prismaClient.beneficiaryDeviceName.deleteMany({
    where: { id: { in: [deviceNameAId, deviceNameBId] } }
  })
})

describe('Statistics - Beneficiary - Device Stats', () => {
  describe('Authorizations', () => {
    test('should not allow stats computation as a reception agent', async ({
      trpc
    }) => {
      await expect(() =>
        trpc.receptionAgent.stat.getBeneficiaryDeviceStats({})
      ).rejects.toThrowError(/not allowed to access route/)
    })
  })

  describe('Comportement', () => {
    test('retourne le total sans filtre période', async ({ trpc }) => {
      const input: Input = {}
      const stats =
        await trpc.structureManager.stat.getBeneficiaryDeviceStats(input)

      const deviceA = stats.find(s => s.name.includes('DeviceA'))
      const deviceB = stats.find(s => s.name.includes('DeviceB'))

      expect(deviceA?.count).toBe(2)
      expect(deviceA?.entryCount).toBe(0)
      expect(deviceA?.exitCount).toBe(0)
      expect(deviceB?.count).toBe(1)
    })

    test('le total ignore le filtre période (compte tous les bénéficiaires avec ce dispositif)', async ({
      trpc
    }) => {
      const input: Input = {
        period: StatPeriodFilter.Custom,
        fromDate: new Date('2024-01-01'),
        toDate: new Date('2024-12-31')
      }
      const stats =
        await trpc.structureManager.stat.getBeneficiaryDeviceStats(input)

      const deviceA = stats.find(s => s.name.includes('DeviceA'))
      // total count ignores period — both beneficiaries are included
      expect(deviceA?.count).toBe(2)
    })

    test('entryCount filtre sur startDate dans la période', async ({
      trpc
    }) => {
      const input: Input = {
        period: StatPeriodFilter.Custom,
        fromDate: new Date('2024-01-01'),
        toDate: new Date('2024-12-31')
      }
      const stats =
        await trpc.structureManager.stat.getBeneficiaryDeviceStats(input)

      const deviceA = stats.find(s => s.name.includes('DeviceA'))
      const deviceB = stats.find(s => s.name.includes('DeviceB'))

      // Only beneficiary1's deviceA has startDate=2024-06-15 (in period)
      expect(deviceA?.entryCount).toBe(1)
      // beneficiary2's deviceB has startDate=2023-03-10 (not in period)
      expect(deviceB?.entryCount).toBe(0)
    })

    test('exitCount filtre sur endDate dans la période', async ({ trpc }) => {
      const input: Input = {
        period: StatPeriodFilter.Custom,
        fromDate: new Date('2023-01-01'),
        toDate: new Date('2023-12-31')
      }
      const stats =
        await trpc.structureManager.stat.getBeneficiaryDeviceStats(input)

      const deviceA = stats.find(s => s.name.includes('DeviceA'))
      // beneficiary1's deviceA has endDate=2023-12-01 (in period)
      expect(deviceA?.exitCount).toBe(1)
    })

    test('entryCount et exitCount sont 0 sans filtre période', async ({
      trpc
    }) => {
      const input: Input = {}
      const stats =
        await trpc.structureManager.stat.getBeneficiaryDeviceStats(input)

      for (const stat of stats) {
        expect(stat.entryCount).toBe(0)
        expect(stat.exitCount).toBe(0)
      }
    })
  })
})
