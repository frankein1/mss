import { afterEach, beforeEach, describe, expect } from 'vitest'
import dayjs from 'dayjs'
import { SupportProgramOutcome } from '@prisma/client'
import { test } from '~~/test/server/test-utils'
import {
  fixtureStructures,
  FixtureStructure,
  fixturesUsers,
  FixtureUserRole
} from '~~/prisma/fixtures'
import { prismaClient } from '~~/server/prisma'
import { StatPeriodFilter } from '~~/types/stat'

const structureId = fixtureStructures[FixtureStructure.Test].id
const socialWorkerId = fixturesUsers[FixtureUserRole.SocialWorker].id

let familyFileId: string
let supportProgramNameId: string

const createBeneficiary = (suffix: string) =>
  prismaClient.beneficiary.create({
    data: {
      familyFile: { connect: { id: familyFileId } },
      structure: { connect: { id: structureId } },
      createdBy: { connect: { id: socialWorkerId } },
      fileNumber: `TEST-SPSTATS-${suffix}`,
      status: 'Active'
    }
  })

beforeEach(async () => {
  const suffix = crypto.randomUUID()

  const familyFile = await prismaClient.familyFile.create({
    data: { structure: { connect: { id: structureId } } }
  })
  familyFileId = familyFile.id

  const supportProgramName = await prismaClient.supportProgramName.create({
    data: {
      name: `SPSTATS-${suffix}`,
      hasLifecycle: true,
      structureId,
      createdById: socialWorkerId
    }
  })
  supportProgramNameId = supportProgramName.id

  const [first, second, third] = await Promise.all([
    createBeneficiary(`${suffix}-1`),
    createBeneficiary(`${suffix}-2`),
    createBeneficiary(`${suffix}-3`)
  ])

  const lastYear = dayjs().subtract(1, 'year')

  await prismaClient.supportProgram.createMany({
    data: [
      // Last year, 10 days
      {
        beneficiaryId: first.id,
        supportProgramNameId,
        startDate: lastYear.month(1).date(1).toDate(),
        endDate: lastYear.month(1).date(11).toDate(),
        outcome: SupportProgramOutcome.Achieved
      },
      // Same beneficiary, last year, 20 days
      {
        beneficiaryId: first.id,
        supportProgramNameId,
        startDate: lastYear.month(5).date(1).toDate(),
        endDate: lastYear.month(5).date(21).toDate(),
        outcome: SupportProgramOutcome.NotAchieved
      },
      // Started last year, still ongoing
      {
        beneficiaryId: second.id,
        supportProgramNameId,
        startDate: lastYear.month(10).date(1).toDate(),
        endDate: null
      },
      // Started and ended long before last year, 30 days
      {
        beneficiaryId: third.id,
        supportProgramNameId,
        startDate: dayjs().subtract(3, 'year').month(0).date(1).toDate(),
        endDate: dayjs().subtract(3, 'year').month(0).date(31).toDate(),
        outcome: SupportProgramOutcome.Achieved
      }
    ]
  })
})

afterEach(async () => {
  await prismaClient.familyFile.delete({ where: { id: familyFileId } })
  await prismaClient.supportProgramName.delete({
    where: { id: supportProgramNameId }
  })
})

describe('Statistics - Support programs - Count', () => {
  test('should count support programs and distinct beneficiaries', async ({
    trpc
  }) => {
    const stats = await trpc.structureManager.stat.getSupportProgramCountStats({
      supportProgramNameId
    })

    // First beneficiary has two support programs
    expect(stats).toEqual({ supportProgram: 4, beneficiary: 3 })
  })
})

describe('Statistics - Support programs - Mean duration', () => {
  test('should compute mean duration of ended support programs', async ({
    trpc
  }) => {
    const stats =
      await trpc.structureManager.stat.getSupportProgramMeanDurationStats({
        supportProgramNameId
      })

    expect(stats).toEqual({ meanDurationInDays: 20, supportProgramCount: 3 })
  })
})

describe('Statistics - Support programs - Outcome', () => {
  test('should count support programs by outcome, sorted by count with not filled last', async ({
    trpc
  }) => {
    const stats =
      await trpc.structureManager.stat.getSupportProgramOutcomeStats({
        supportProgramNameId
      })

    expect(stats).toEqual([
      { outcome: SupportProgramOutcome.Achieved, _count: 2 },
      { outcome: SupportProgramOutcome.NotAchieved, _count: 1 },
      { outcome: null, _count: 1 }
    ])
  })
})

describe('Statistics - Support programs - Partners', () => {
  let partnerA: { id: string; name: string }
  let partnerB: { id: string; name: string }
  // Ordered by start date: third, first (x2), second
  let firstA: { id: string }
  let firstB: { id: string }
  let second: { id: string }

  const connectPartners = (supportProgramId: string, partnerIds: string[]) =>
    prismaClient.supportProgram.update({
      where: { id: supportProgramId },
      data: {
        partnerOrganisations: { connect: partnerIds.map(id => ({ id })) }
      }
    })

  beforeEach(async () => {
    const createPartner = (name: string) =>
      prismaClient.partnerOrganization.create({
        data: { name: `SPSTATS-${name}`, structureId }
      })
    partnerA = await createPartner('Partner-A')
    partnerB = await createPartner('Partner-B')

    const [, a, b, c] = await prismaClient.supportProgram.findMany({
      where: { supportProgramNameId },
      orderBy: { startDate: 'asc' }
    })
    if (!a || !b || !c) {
      throw new Error('Missing support programs in test setup')
    }
    firstA = a
    firstB = b
    second = c
  })

  afterEach(async () => {
    await prismaClient.partnerOrganization.deleteMany({
      where: { id: { in: [partnerA.id, partnerB.id] } }
    })
  })

  test('should count distinct beneficiaries per partner', async ({ trpc }) => {
    await Promise.all([
      connectPartners(firstA.id, [partnerA.id, partnerB.id]),
      connectPartners(firstB.id, [partnerA.id]),
      connectPartners(second.id, [partnerA.id])
    ])

    const stats =
      await trpc.structureManager.stat.getSupportProgramPartnerStats({
        supportProgramNameId
      })

    expect(stats).toEqual({
      total: 3,
      partners: [
        { id: partnerA.id, name: partnerA.name, _count: 2 },
        { id: partnerB.id, name: partnerB.name, _count: 1 },
        { id: null, name: null, _count: 1 }
      ]
    })
  })

  test('should sort by count and name, with not filled last', async ({
    trpc
  }) => {
    // First beneficiary has a program without partner, as the third one
    await Promise.all([
      connectPartners(firstA.id, [partnerB.id]),
      connectPartners(second.id, [partnerA.id])
    ])

    const stats =
      await trpc.structureManager.stat.getSupportProgramPartnerStats({
        supportProgramNameId
      })

    expect(stats.partners).toEqual([
      { id: partnerA.id, name: partnerA.name, _count: 1 },
      { id: partnerB.id, name: partnerB.name, _count: 1 },
      { id: null, name: null, _count: 2 }
    ])
  })
})

describe('Statistics - Support programs - Entries and exits', () => {
  test('should count every enrollment per support program', async ({
    trpc
  }) => {
    const stats =
      await trpc.structureManager.stat.getSupportProgramEntriesExitsStats({
        supportProgramNameId
      })

    // First beneficiary entered twice and is counted twice,
    // second beneficiary has no end date
    expect(stats).toEqual([
      {
        id: supportProgramNameId,
        name: expect.stringMatching(/^SPSTATS-/),
        entries: 4,
        exits: 3
      }
    ])
  })
})

describe('Statistics - Support programs - Period filter', () => {
  const lastYear = dayjs().subtract(1, 'year')

  test('should keep support programs started in the period, ongoing or ended in the period', async ({
    trpc
  }) => {
    // First beneficiary: both programs started and ended last year
    // Second beneficiary: started last year, still ongoing
    // Third beneficiary: three years ago, excluded
    const input = { supportProgramNameId, period: StatPeriodFilter.LastYear }

    const [count, meanDuration] = await Promise.all([
      trpc.structureManager.stat.getSupportProgramCountStats(input),
      trpc.structureManager.stat.getSupportProgramMeanDurationStats(input)
    ])

    expect(count).toEqual({ supportProgram: 3, beneficiary: 2 })
    expect(meanDuration).toEqual({
      meanDurationInDays: 15,
      supportProgramCount: 2
    })
  })

  test('should exclude support programs ended after the period', async ({
    trpc
  }) => {
    // Only the first program of the first beneficiary (February) fits:
    // the June one ends after the period, the November one starts after it
    const input = {
      supportProgramNameId,
      period: StatPeriodFilter.Custom,
      fromDate: lastYear.startOf('year').toDate(),
      toDate: lastYear.month(5).date(15).toDate()
    }

    const [count, meanDuration] = await Promise.all([
      trpc.structureManager.stat.getSupportProgramCountStats(input),
      trpc.structureManager.stat.getSupportProgramMeanDurationStats(input)
    ])

    expect(count).toEqual({ supportProgram: 1, beneficiary: 1 })
    expect(meanDuration).toEqual({
      meanDurationInDays: 10,
      supportProgramCount: 1
    })
  })

  test('should exclude support programs without dates', async ({ trpc }) => {
    const beneficiary = await prismaClient.beneficiary.findFirstOrThrow({
      where: { supportPrograms: { some: { supportProgramNameId } } }
    })
    await prismaClient.supportProgram.create({
      data: { beneficiaryId: beneficiary.id, supportProgramNameId }
    })

    const [withoutPeriod, withPeriod] = await Promise.all([
      trpc.structureManager.stat.getSupportProgramOutcomeStats({
        supportProgramNameId
      }),
      trpc.structureManager.stat.getSupportProgramOutcomeStats({
        supportProgramNameId,
        period: StatPeriodFilter.LastYear
      })
    ])

    // Without period, the program without dates is counted as not filled
    expect(withoutPeriod).toContainEqual({ outcome: null, _count: 2 })
    // With period, only the ongoing program of the second beneficiary is not filled
    expect(withPeriod).toContainEqual({ outcome: null, _count: 1 })
  })
})

describe('Statistics - Support programs - Beneficiaries per support program', () => {
  test('should count distinct beneficiaries per support program', async ({
    trpc
  }) => {
    const stats = await trpc.structureManager.stat.getSupportProgramNameStats({
      supportProgramNameId
    })

    // First beneficiary has two support programs but is counted once
    expect(stats).toEqual({
      total: 3,
      supportProgramNames: [
        {
          id: supportProgramNameId,
          name: expect.stringMatching(/^SPSTATS-/),
          _count: 3
        }
      ]
    })
  })
})
