import { afterEach, beforeEach, describe, expect } from 'vitest'
import dayjs from 'dayjs'
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

const createBeneficiary = (fileNumber: string) =>
  prismaClient.beneficiary.create({
    data: {
      familyFile: { connect: { id: familyFileId } },
      structure: { connect: { id: structureId } },
      createdBy: { connect: { id: socialWorkerId } },
      fileNumber,
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
      name: 'École ouverte',
      hasLifecycle: true,
      structureId,
      createdById: socialWorkerId
    }
  })
  supportProgramNameId = supportProgramName.id

  const [alice, bob] = await Promise.all([
    createBeneficiary(`TEST-SPENTRIES-ALICE-${suffix}`),
    createBeneficiary(`TEST-SPENTRIES-BOB-${suffix}`)
  ])

  // With today in 2026: two years ago is 2024 and last year is 2025
  const lastYear = dayjs().subtract(1, 'year').startOf('year')
  const twoYearsAgo = lastYear.subtract(1, 'year')

  await prismaClient.supportProgram.createMany({
    data: [
      // Alice: from 01/01/2024 to 01/06/2024
      {
        beneficiaryId: alice.id,
        supportProgramNameId,
        startDate: twoYearsAgo.toDate(),
        endDate: twoYearsAgo.month(5).toDate()
      },
      // Bob: from 01/01/2024 to 01/06/2025
      {
        beneficiaryId: bob.id,
        supportProgramNameId,
        startDate: twoYearsAgo.toDate(),
        endDate: lastYear.month(5).toDate()
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

describe('Statistics - Support programs - Entries and exits by period', () => {
  test('should not list a support program ended before this year', async ({
    trpc
  }) => {
    const stats =
      await trpc.structureManager.stat.getSupportProgramEntriesExitsStats({
        supportProgramNameIds: [supportProgramNameId],
        period: StatPeriodFilter.ThisYear
      })

    expect(stats).toEqual([])
  })

  test('should only count entries and exits that occurred last year', async ({
    trpc
  }) => {
    const stats =
      await trpc.structureManager.stat.getSupportProgramEntriesExitsStats({
        supportProgramNameIds: [supportProgramNameId],
        period: StatPeriodFilter.LastYear
      })

    // Alice is excluded, Bob entered two years ago and exited last year
    expect(stats).toEqual([
      {
        id: supportProgramNameId,
        name: 'École ouverte',
        entries: 0,
        exits: 1,
        ongoing: 0
      }
    ])
  })
})

describe('Statistics - Support programs - Entries and exits with ongoing support programs', () => {
  let e2cNameId: string

  beforeEach(async () => {
    const suffix = crypto.randomUUID()

    const e2cName = await prismaClient.supportProgramName.create({
      data: {
        name: 'École de la 2e chance (E2C)',
        hasLifecycle: true,
        structureId,
        createdById: socialWorkerId
      }
    })
    e2cNameId = e2cName.id

    const [alice, bob, charlie] = await Promise.all([
      createBeneficiary(`TEST-SPENTRIES-E2C-ALICE-${suffix}`),
      createBeneficiary(`TEST-SPENTRIES-E2C-BOB-${suffix}`),
      createBeneficiary(`TEST-SPENTRIES-E2C-CHARLIE-${suffix}`)
    ])

    // With today in 2026: last year is 2025 and next year is 2027
    const thisYear = dayjs().startOf('year')
    const lastYear = thisYear.subtract(1, 'year')
    const nextYear = thisYear.add(1, 'year')

    await prismaClient.supportProgram.createMany({
      data: [
        // Alice: from 01/01/2025 to 31/08/2027
        {
          beneficiaryId: alice.id,
          supportProgramNameId: e2cNameId,
          startDate: lastYear.toDate(),
          endDate: nextYear.month(7).date(31).toDate()
        },
        // Bob: from 01/01/2025 to 31/08/2025
        {
          beneficiaryId: bob.id,
          supportProgramNameId: e2cNameId,
          startDate: lastYear.toDate(),
          endDate: lastYear.month(7).date(31).toDate()
        },
        // Charlie: from 01/01/2026 to 31/12/2026
        {
          beneficiaryId: charlie.id,
          supportProgramNameId: e2cNameId,
          startDate: thisYear.toDate(),
          endDate: thisYear.endOf('year').startOf('day').toDate()
        }
      ]
    })
  })

  afterEach(async () => {
    await prismaClient.supportProgramName.delete({ where: { id: e2cNameId } })
  })

  test('should count entries, exits and ongoing support programs of last year', async ({
    trpc
  }) => {
    const stats =
      await trpc.structureManager.stat.getSupportProgramEntriesExitsStats({
        supportProgramNameIds: [e2cNameId],
        period: StatPeriodFilter.LastYear
      })

    // Alice and Bob entered, Bob exited, Alice is still ongoing at the end
    // of last year, Charlie had not started yet
    expect(stats).toEqual([
      {
        id: e2cNameId,
        name: 'École de la 2e chance (E2C)',
        entries: 2,
        exits: 1,
        ongoing: 1
      }
    ])
  })

  test('should count entries, exits and ongoing support programs of this year', async ({
    trpc
  }) => {
    const stats =
      await trpc.structureManager.stat.getSupportProgramEntriesExitsStats({
        supportProgramNameIds: [e2cNameId],
        period: StatPeriodFilter.ThisYear
      })

    // Charlie entered this year, Alice entered last year, Bob exited last
    // year: Alice and Charlie are both ongoing as their end dates are not
    // reached yet
    expect(stats).toEqual([
      {
        id: e2cNameId,
        name: 'École de la 2e chance (E2C)',
        entries: 1,
        exits: 0,
        ongoing: 2
      }
    ])
  })
})
