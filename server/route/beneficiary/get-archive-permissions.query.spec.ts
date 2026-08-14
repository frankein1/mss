import { describe, expect, afterAll, beforeAll } from 'vitest'
import {
  fixturesBeneficiaries,
  FixtureBeneficiary,
  fixtureStructures,
  fixturesUsers,
  FixtureUserRole
} from '~~/prisma/fixtures'
import { test } from '~~/test/server/test-utils'
import { prismaClient } from '~~/server/prisma'
import dayjs from 'dayjs'
import { BeneficiaryStatus } from '@prisma/client'
import { randomUUID } from 'node:crypto'

let familyFileId: string

const ID_COURSOR = fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id
const ID_PAUL = '9a0191a5-d893-4b4b-95e7-14f1f2b21c60'
const ID_LETO = '4b11b0bf-9bbd-447a-9b77-402e5e4922fc'
const ID_SIONA = '914635b2-44d0-4bfc-8bc8-67c0a44d7fa3'
const ID_VORIAN = 'fc3ce143-a7ab-48c5-b620-1d467df3b1bc'
const ID_JESSICA = 'f335a790-92e7-4385-bbcb-32141a9178fe'
const ID_ALIA = '85c134d0-6455-4ff8-b38e-472ddbfd141a'
const ID_GHANIMA = '93f456b7-b30d-4ee5-8d6d-6b5b9fe8e7de'

const now = dayjs(new Date())

const oneMonthBeforeNow = now.subtract(1, 'month').toDate()
const twoYearsBeforeNow = now.subtract(2, 'year').toDate()
const twoYearsMinusTwoMonthsBeforeNow = now
  .subtract(2, 'year')
  .add(2, 'month')
  .toDate()
const twoYearsMinusOneMonthsBeforeNow = now
  .subtract(2, 'year')
  .add(1, 'month')
  .toDate()
const threeYearsBeforeNow = now.subtract(3, 'year').toDate()

const inOneMonth = now.add(1, 'month').toDate()

beforeAll(async () => await createBeneficiaries())

afterAll(async () => await resetDatabaseAfterTest())

describe('Beneficiary - Archive - Permission to archive active beneficiary', async () => {
  test('structure manager should be able to archive recent beneficiary even if she is not referent of the file', async ({
    trpc
  }) => {
    const archivePermissionManager =
      await trpc.structureManager.beneficiary.getBeneficiaryArchivePermission({
        id: ID_COURSOR
      })
    expect(archivePermissionManager.archive).toBe(true)
  })

  test('reception agent should not be able to archive recent beneficiary', async ({
    trpc
  }) => {
    const archivePermissionReceptionAgent =
      await trpc.receptionAgent.beneficiary.getBeneficiaryArchivePermission({
        id: ID_COURSOR
      })
    expect(archivePermissionReceptionAgent.archive).toBe(false)
  })

  test('social worker should not be able to archive a recent beneficiary', async ({
    trpc
  }) => {
    const archivePermissionSocialWorker =
      await trpc.socialWorker.beneficiary.getBeneficiaryArchivePermission({
        id: ID_COURSOR
      })
    expect(archivePermissionSocialWorker.archive).toBe(false)
  })

  test('referent should not be able to archive a recent beneficiary', async ({
    trpc
  }) => {
    const archivePermissionReferent =
      await trpc.referent.beneficiary.getBeneficiaryArchivePermission({
        id: ID_COURSOR
      })
    expect(archivePermissionReferent.archive).toBe(false)
  })

  test('agent should not be able to archive a beneficiary with activity more recent than 1 year and 11 months', async ({
    trpc
  }) => {
    const archivePermissionReferent =
      await trpc.referent.beneficiary.getBeneficiaryArchivePermission({
        id: ID_PAUL
      })
    expect(archivePermissionReferent.archive).toBe(false)
  })
})

describe('Beneficiary - Archive - Permission to archive beneficiary inactive for more than 1 year 11 months', async () => {
  test('reception agent should not be able to archive an inactive beneficiary even if she is referent of the file', async ({
    trpc
  }) => {
    const archivePermissionReceptionAgent =
      await trpc.receptionAgent.beneficiary.getBeneficiaryArchivePermission({
        id: ID_LETO
      })
    expect(archivePermissionReceptionAgent.archive).toBe(false)
  })

  test('agent (except reception agent) should be able to archive an inactive beneficiary when she is referent of the file', async ({
    trpc
  }) => {
    const archivePermissionReferent =
      await trpc.referent.beneficiary.getBeneficiaryArchivePermission({
        id: ID_LETO
      })
    expect(archivePermissionReferent.archive).toBe(true)
  })

  test('agent should not be able to archive an inactive beneficiary when she is not referent of the file', async ({
    trpc
  }) => {
    const archivePermissionSocialWorker =
      await trpc.socialWorker.beneficiary.getBeneficiaryArchivePermission({
        id: ID_LETO
      })
    expect(archivePermissionSocialWorker.archive).toBe(false)
  })

  test('agent should be able to archive an beneficiary inactive for more than 1 year 11 months (date for the first notification)', async ({
    trpc
  }) => {
    const archivePermissionReferent =
      await trpc.referent.beneficiary.getBeneficiaryArchivePermission({
        id: ID_SIONA
      })
    expect(archivePermissionReferent.archive).toBe(true)
  })
})

describe('Beneficiary - Archive - Permission to archive beneficiary with manual archive date set', async () => {
  test('agent should not be able to archive an active beneficiary even if a manual archive date has been set soon', async ({
    trpc
  }) => {
    const archivePermissionReferent =
      await trpc.referent.beneficiary.getBeneficiaryArchivePermission({
        id: ID_VORIAN
      })
    expect(archivePermissionReferent.archive).toBe(false)
  })

  test('agent should be able to archive an inactive beneficiary even if a manual archive date has been set in the future', async ({
    trpc
  }) => {
    const archiveParmissionReferent =
      await trpc.referent.beneficiary.getBeneficiaryArchivePermission({
        id: ID_JESSICA
      })
    expect(archiveParmissionReferent.archive).toBe(true)
  })

  test('agent should not be able to archive an active beneficiary even if a manual archive date has been set and has passed', async ({
    trpc
  }) => {
    const archiveParmissionReferent =
      await trpc.referent.beneficiary.getBeneficiaryArchivePermission({
        id: ID_ALIA
      })
    expect(archiveParmissionReferent.archive).toBe(false)
  })

  test('agent should be able to archive an inactive beneficiary with a manual archive date passed', async ({
    trpc
  }) => {
    const archiveParmissionReferent =
      await trpc.referent.beneficiary.getBeneficiaryArchivePermission({
        id: ID_GHANIMA
      })
    expect(archiveParmissionReferent.archive).toBe(true)
  })
})

const beneficiaryBaseObject = {
  structureId: fixtureStructures[0].id,
  status: BeneficiaryStatus.Active,
  usualName: 'ATREIDES'
}

/** Family files and beneficiaries fixtures
 *
 * Referents:
 * - Structure Manager
 * - Referent
 * - Reception Agent
 *
 * Beneficiaries:
 * - Paul ATREIDES    :   ACTIVE
 * - Leto ATREIDES    : INACTIVE - Expected archive date: 1 YEAR AGO
 * - Siona ATREIDES   : INACTIVE - Expected archive date: IN ONE MONTH
 * - Vorian ATREIDES  :   ACTIVE - MANUAL ARCHIVE DATE - Expected archive date: IN ONE MONTH
 * - Jessica ATREIDES : INACTIVE - MANUAL ARCHIVE DATE - Expected archive date: IN ONE MONTH
 * - Alia ATREIDES    :   ACTIVE - MANUAL ARCHIVE DATE - Expected archive date: ONE MONTH AGO
 * - Ghanima ATREIDES : INACTIVE - MANUAL ARCHIVE DATE - Expected archive date: ONE MONTH AGO
 */
const createBeneficiaries = async () => {
  const familyfile = await prismaClient.familyFile.create({
    select: { id: true },
    data: {
      structureId: fixtureStructures[0].id,
      referents: {
        connect: [
          { id: fixturesUsers[FixtureUserRole.Referent].id },
          { id: fixturesUsers[FixtureUserRole.ReceptionAgent].id }
        ]
      },
      budget: undefined,
      beneficiaries: {
        create: [
          {
            ...beneficiaryBaseObject,
            id: ID_PAUL,
            fileNumber: randomUUID(),
            firstName: 'Paul',
            created: twoYearsMinusTwoMonthsBeforeNow,
            updated: twoYearsMinusTwoMonthsBeforeNow,
            lastActivity: twoYearsMinusTwoMonthsBeforeNow
          },
          {
            ...beneficiaryBaseObject,
            id: ID_LETO,
            fileNumber: randomUUID(),
            firstName: 'Leto',
            created: threeYearsBeforeNow,
            updated: threeYearsBeforeNow,
            lastActivity: threeYearsBeforeNow
          },
          {
            ...beneficiaryBaseObject,
            id: ID_SIONA,
            fileNumber: randomUUID(),
            firstName: 'Siona',
            created: twoYearsMinusOneMonthsBeforeNow,
            updated: twoYearsMinusOneMonthsBeforeNow,
            lastActivity: twoYearsMinusOneMonthsBeforeNow
          },
          {
            ...beneficiaryBaseObject,
            id: ID_VORIAN,
            fileNumber: randomUUID(),
            firstName: 'Vorian',
            archiveDueDate: inOneMonth,
            created: twoYearsMinusTwoMonthsBeforeNow,
            updated: twoYearsMinusTwoMonthsBeforeNow,
            lastActivity: twoYearsMinusTwoMonthsBeforeNow
          },
          {
            ...beneficiaryBaseObject,
            id: ID_JESSICA,
            fileNumber: randomUUID(),
            firstName: 'Jessica',
            archiveDueDate: inOneMonth,
            created: twoYearsBeforeNow,
            updated: twoYearsBeforeNow,
            lastActivity: twoYearsBeforeNow
          },
          {
            ...beneficiaryBaseObject,
            id: ID_ALIA,
            fileNumber: randomUUID(),
            firstName: 'Alia',
            archiveDueDate: oneMonthBeforeNow,
            created: twoYearsBeforeNow,
            updated: twoYearsMinusTwoMonthsBeforeNow,
            lastActivity: twoYearsMinusTwoMonthsBeforeNow
          },
          {
            ...beneficiaryBaseObject,
            id: ID_GHANIMA,
            fileNumber: randomUUID(),
            firstName: 'Ghanima',
            archiveDueDate: oneMonthBeforeNow,
            created: twoYearsBeforeNow,
            updated: twoYearsBeforeNow,
            lastActivity: twoYearsBeforeNow
          }
        ]
      }
    }
  })

  familyFileId = familyfile.id
}

async function resetDatabaseAfterTest() {
  await prismaClient.familyFile.deleteMany({ where: { id: familyFileId } })
}
