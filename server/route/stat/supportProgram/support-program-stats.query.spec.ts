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
      supportProgramNameIds: [supportProgramNameId]
    })

    // First beneficiary has two support programs
    expect(stats).toEqual({ supportProgram: 4, beneficiary: 3 })
  })

  test('should count support programs of several support program names', async ({
    trpc
  }) => {
    const otherName = await prismaClient.supportProgramName.create({
      data: {
        name: `SPSTATS-other-${crypto.randomUUID()}`,
        structureId,
        createdById: socialWorkerId
      }
    })
    try {
      const [beneficiary, newBeneficiary] = await Promise.all([
        prismaClient.beneficiary.findFirstOrThrow({
          where: { supportPrograms: { some: { supportProgramNameId } } }
        }),
        createBeneficiary(`other-${crypto.randomUUID()}`)
      ])
      await prismaClient.supportProgram.createMany({
        data: [
          // Already counted with the first support program name
          { beneficiaryId: beneficiary.id, supportProgramNameId: otherName.id },
          {
            beneficiaryId: newBeneficiary.id,
            supportProgramNameId: otherName.id
          }
        ]
      })

      const stats =
        await trpc.structureManager.stat.getSupportProgramCountStats({
          supportProgramNameIds: [supportProgramNameId, otherName.id]
        })

      expect(stats).toEqual({ supportProgram: 6, beneficiary: 4 })
    } finally {
      await prismaClient.supportProgramName.delete({
        where: { id: otherName.id }
      })
    }
  })
})

describe('Statistics - Support programs - Mean duration', () => {
  test('should compute mean duration of ended support programs', async ({
    trpc
  }) => {
    const stats =
      await trpc.structureManager.stat.getSupportProgramMeanDurationStats({
        supportProgramNameIds: [supportProgramNameId]
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
        supportProgramNameIds: [supportProgramNameId]
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
        supportProgramNameIds: [supportProgramNameId]
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
        supportProgramNameIds: [supportProgramNameId]
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
        supportProgramNameIds: [supportProgramNameId]
      })

    // First beneficiary entered twice and is counted twice,
    // second beneficiary has no end date and is ongoing
    expect(stats).toEqual([
      {
        id: supportProgramNameId,
        name: expect.stringMatching(/^SPSTATS-/),
        entries: 4,
        exits: 3,
        ongoing: 1
      }
    ])
  })

  test('should count a support program with a future end date as ongoing', async ({
    trpc
  }) => {
    const beneficiary = await prismaClient.beneficiary.findFirstOrThrow({
      where: { supportPrograms: { some: { supportProgramNameId } } }
    })
    await prismaClient.supportProgram.create({
      data: {
        beneficiaryId: beneficiary.id,
        supportProgramNameId,
        startDate: dayjs().subtract(1, 'month').toDate(),
        endDate: dayjs().add(1, 'month').toDate()
      }
    })

    const stats =
      await trpc.structureManager.stat.getSupportProgramEntriesExitsStats({
        supportProgramNameIds: [supportProgramNameId]
      })

    expect(stats).toEqual([
      expect.objectContaining({ entries: 5, exits: 3, ongoing: 2 })
    ])
  })

  test('should count a support program ended after the period as ongoing', async ({
    trpc
  }) => {
    const lastYear = dayjs().subtract(1, 'year')
    // February program ended in the period, June program (June 1st to
    // June 21st) ends after it
    const stats =
      await trpc.structureManager.stat.getSupportProgramEntriesExitsStats({
        supportProgramNameIds: [supportProgramNameId],
        period: StatPeriodFilter.Custom,
        fromDate: lastYear.startOf('year').toDate(),
        toDate: lastYear.month(5).date(15).toDate()
      })

    expect(stats).toEqual([
      expect.objectContaining({ entries: 2, exits: 1, ongoing: 1 })
    ])
  })
})

describe('Statistics - Support programs - Period filter', () => {
  const lastYear = dayjs().subtract(1, 'year')

  test('should keep support programs active during the period', async ({
    trpc
  }) => {
    // First beneficiary: both programs started and ended last year
    // Second beneficiary: started last year, still ongoing
    // Third beneficiary: three years ago, excluded
    const input = {
      supportProgramNameIds: [supportProgramNameId],
      period: StatPeriodFilter.LastYear
    }

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

  test('should keep support programs started in the period and ended after it', async ({
    trpc
  }) => {
    // February program: started and ended in the period
    // June program: started in the period, ended after it
    // November program: started after the period, excluded
    const input = {
      supportProgramNameIds: [supportProgramNameId],
      period: StatPeriodFilter.Custom,
      fromDate: lastYear.startOf('year').toDate(),
      toDate: lastYear.month(5).date(15).toDate()
    }

    const [count, meanDuration] = await Promise.all([
      trpc.structureManager.stat.getSupportProgramCountStats(input),
      trpc.structureManager.stat.getSupportProgramMeanDurationStats(input)
    ])

    expect(count).toEqual({ supportProgram: 2, beneficiary: 1 })
    expect(meanDuration).toEqual({
      meanDurationInDays: 15,
      supportProgramCount: 2
    })
  })

  test('should keep support programs started before the period and ended in it', async ({
    trpc
  }) => {
    // Only the June program (June 1st to June 21st) ends in the period
    const input = {
      supportProgramNameIds: [supportProgramNameId],
      period: StatPeriodFilter.Custom,
      fromDate: lastYear.month(5).date(15).toDate(),
      toDate: lastYear.month(5).date(30).toDate()
    }

    const [count, meanDuration] = await Promise.all([
      trpc.structureManager.stat.getSupportProgramCountStats(input),
      trpc.structureManager.stat.getSupportProgramMeanDurationStats(input)
    ])

    expect(count).toEqual({ supportProgram: 1, beneficiary: 1 })
    expect(meanDuration).toEqual({
      meanDurationInDays: 20,
      supportProgramCount: 1
    })
  })

  test('should keep support programs started before the period and ended after it', async ({
    trpc
  }) => {
    const third = await prismaClient.beneficiary.findFirstOrThrow({
      where: {
        supportPrograms: {
          some: {
            supportProgramNameId,
            startDate: {
              lt: lastYear.subtract(1, 'year').endOf('year').toDate()
            }
          }
        }
      }
    })
    await prismaClient.supportProgram.createMany({
      data: [
        // Covers the whole period
        {
          beneficiaryId: third.id,
          supportProgramNameId,
          startDate: lastYear.subtract(1, 'year').month(5).date(1).toDate(),
          endDate: lastYear
            .add(1, 'year')
            .startOf('year')
            .add(1, 'day')
            .toDate()
        },
        // Started before the period, still ongoing
        {
          beneficiaryId: third.id,
          supportProgramNameId,
          startDate: lastYear.subtract(1, 'year').month(8).date(1).toDate()
        }
      ]
    })

    const count = await trpc.structureManager.stat.getSupportProgramCountStats({
      supportProgramNameIds: [supportProgramNameId],
      period: StatPeriodFilter.LastYear
    })

    // 3 support programs of the first and second beneficiaries, plus the 2 new ones
    expect(count).toEqual({ supportProgram: 5, beneficiary: 3 })
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
        supportProgramNameIds: [supportProgramNameId]
      }),
      trpc.structureManager.stat.getSupportProgramOutcomeStats({
        supportProgramNameIds: [supportProgramNameId],
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
      supportProgramNameIds: [supportProgramNameId]
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

describe('Statistics - Support programs - Exit reasons', () => {
  test('should count support programs with lifecycle by exit reason, sorted by count with not filled last', async ({
    trpc
  }) => {
    const suffix = crypto.randomUUID()
    const [moved, completed] = await Promise.all([
      prismaClient.supportProgramExitReason.create({
        data: {
          name: `Déménagement ${suffix}`,
          structureId,
          createdById: socialWorkerId
        }
      }),
      prismaClient.supportProgramExitReason.create({
        data: {
          name: `Fin de parcours ${suffix}`,
          structureId,
          createdById: socialWorkerId
        }
      })
    ])
    const withoutLifecycleName = await prismaClient.supportProgramName.create({
      data: {
        name: `SPSTATS-no-lifecycle-${suffix}`,
        hasLifecycle: false,
        structureId,
        createdById: socialWorkerId
      }
    })
    try {
      const supportPrograms = await prismaClient.supportProgram.findMany({
        where: { supportProgramNameId },
        orderBy: { startDate: 'asc' }
      })
      // Two programs ended with "Fin de parcours", one with "Déménagement", one not filled
      await Promise.all([
        prismaClient.supportProgram.update({
          where: { id: supportPrograms[0]!.id },
          data: { exitReasonId: completed.id }
        }),
        prismaClient.supportProgram.update({
          where: { id: supportPrograms[1]!.id },
          data: { exitReasonId: completed.id }
        }),
        prismaClient.supportProgram.update({
          where: { id: supportPrograms[2]!.id },
          data: { exitReasonId: moved.id }
        }),
        // Without lifecycle: never counted, even with an exit reason
        prismaClient.supportProgram.create({
          data: {
            beneficiaryId: supportPrograms[0]!.beneficiaryId,
            supportProgramNameId: withoutLifecycleName.id,
            exitReasonId: moved.id
          }
        })
      ])

      const stats =
        await trpc.structureManager.stat.getSupportProgramExitReasonStats({
          supportProgramNameIds: [supportProgramNameId, withoutLifecycleName.id]
        })

      expect(stats).toEqual([
        { id: completed.id, name: completed.name, _count: 2 },
        { id: moved.id, name: moved.name, _count: 1 },
        { id: null, name: null, _count: 1 }
      ])
    } finally {
      await prismaClient.supportProgramName.delete({
        where: { id: withoutLifecycleName.id }
      })
      await prismaClient.supportProgramExitReason.deleteMany({
        where: { id: { in: [moved.id, completed.id] } }
      })
    }
  })

  test('should apply the period filter', async ({ trpc }) => {
    const stats =
      await trpc.structureManager.stat.getSupportProgramExitReasonStats({
        supportProgramNameIds: [supportProgramNameId],
        period: StatPeriodFilter.LastYear
      })

    // The program ended three years ago is excluded
    expect(stats).toEqual([{ id: null, name: null, _count: 3 }])
  })
})
