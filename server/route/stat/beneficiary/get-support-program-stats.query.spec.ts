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

type Input = inferProcedureInput<AppRouter['stat']['getSupportProgramStats']>

const structureId = fixtureStructures[FixtureStructure.Test].id
const socialWorkerId = fixturesUsers[FixtureUserRole.SocialWorker].id
const referentId = fixturesUsers[FixtureUserRole.Referent].id

let familyFileId: string
let beneficiary1Id: string
let beneficiary2Id: string
let supportProgramNameAId: string
let supportProgramNameBId: string

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

  const [spnA, spnB] = await Promise.all([
    prismaClient.supportProgramName.create({
      data: {
        name: `DS-SupportProgramA-${suffix}`,
        structureId,
        createdById: socialWorkerId
      }
    }),
    prismaClient.supportProgramName.create({
      data: {
        name: `DS-SupportProgramB-${suffix}`,
        structureId,
        createdById: socialWorkerId
      }
    })
  ])
  supportProgramNameAId = spnA.id
  supportProgramNameBId = spnB.id

  // beneficiary1 → supportProgramA with startDate in 2024, endDate in 2023
  // beneficiary2 → supportProgramA with no dates
  // beneficiary2 → supportProgramB with startDate in 2023
  await Promise.all([
    prismaClient.supportProgram.create({
      data: {
        beneficiary: { connect: { id: beneficiary1Id } },
        supportProgramName: { connect: { id: supportProgramNameAId } },
        startDate: new Date('2024-06-15'),
        endDate: new Date('2023-12-01')
      }
    }),
    prismaClient.supportProgram.create({
      data: {
        beneficiary: { connect: { id: beneficiary2Id } },
        supportProgramName: { connect: { id: supportProgramNameAId } }
      }
    }),
    prismaClient.supportProgram.create({
      data: {
        beneficiary: { connect: { id: beneficiary2Id } },
        supportProgramName: { connect: { id: supportProgramNameBId } },
        startDate: new Date('2023-03-10')
      }
    })
  ])
})

afterEach(async () => {
  await prismaClient.supportProgram.deleteMany({
    where: { beneficiaryId: { in: [beneficiary1Id, beneficiary2Id] } }
  })
  await prismaClient.beneficiary.deleteMany({
    where: { id: { in: [beneficiary1Id, beneficiary2Id] } }
  })
  await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
  await prismaClient.supportProgramName.deleteMany({
    where: { id: { in: [supportProgramNameAId, supportProgramNameBId] } }
  })
})

describe('Statistics - Beneficiary - Support Program Stats', () => {
  describe('Authorizations', () => {
    test('should not allow stats computation as a reception agent', async ({
      trpc
    }) => {
      await expect(() =>
        trpc.receptionAgent.stat.getSupportProgramStats({})
      ).rejects.toThrowError(/not allowed to access route/)
    })
  })

  describe('Comportement', () => {
    test('retourne le total sans filtre période', async ({ trpc }) => {
      const input: Input = {}
      const stats =
        await trpc.structureManager.stat.getSupportProgramStats(input)

      const supportProgramA = stats.find(s =>
        s.name.includes('SupportProgramA')
      )
      const supportProgramB = stats.find(s =>
        s.name.includes('SupportProgramB')
      )

      expect(supportProgramA?.count).toBe(2)
      expect(supportProgramA?.entryCount).toBe(0)
      expect(supportProgramA?.exitCount).toBe(0)
      expect(supportProgramB?.count).toBe(1)
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
        await trpc.structureManager.stat.getSupportProgramStats(input)

      const supportProgramA = stats.find(s =>
        s.name.includes('SupportProgramA')
      )
      // total count ignores period — both beneficiaries are included
      expect(supportProgramA?.count).toBe(2)
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
        await trpc.structureManager.stat.getSupportProgramStats(input)

      const supportProgramA = stats.find(s =>
        s.name.includes('SupportProgramA')
      )
      const supportProgramB = stats.find(s =>
        s.name.includes('SupportProgramB')
      )

      // Only beneficiary1's supportProgramA has startDate=2024-06-15 (in period)
      expect(supportProgramA?.entryCount).toBe(1)
      // beneficiary2's supportProgramB has startDate=2023-03-10 (not in period)
      expect(supportProgramB?.entryCount).toBe(0)
    })

    test('exitCount filtre sur endDate dans la période', async ({ trpc }) => {
      const input: Input = {
        period: StatPeriodFilter.Custom,
        fromDate: new Date('2023-01-01'),
        toDate: new Date('2023-12-31')
      }
      const stats =
        await trpc.structureManager.stat.getSupportProgramStats(input)

      const supportProgramA = stats.find(s =>
        s.name.includes('SupportProgramA')
      )
      // beneficiary1's supportProgramA has endDate=2023-12-01 (in period)
      expect(supportProgramA?.exitCount).toBe(1)
    })

    test('entryCount et exitCount sont 0 sans filtre période', async ({
      trpc
    }) => {
      const input: Input = {}
      const stats =
        await trpc.structureManager.stat.getSupportProgramStats(input)

      for (const stat of stats) {
        expect(stat.entryCount).toBe(0)
        expect(stat.exitCount).toBe(0)
      }
    })
  })
})
