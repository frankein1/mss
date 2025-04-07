import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach
} from 'vitest'
import { test } from './__fixtures__'
import {
  getInactiveBeneficiaries,
  getInactiveBeneficiariesWithOneMonthNotification
} from './helper'
import { NotificationRepo } from '~/server/database'
import { fixturesUsers, FixtureUserRole } from '~/prisma/fixtures'
import { NotificationType } from '@prisma/client'

beforeAll(async () => await test.createBeneficiary())

afterAll(async () => await test.deleteBeneficiary())

describe('Notification - Beneficiary Archive - List inactive beneficiaries', () => {
  it('should return all beneficiaries without activity in profile or budget (social supports or documents are not included for query performance reasons)', async () => {
    const beneficiaries = await getInactiveBeneficiaries()

    const set = new Set(beneficiaries.map(b => b.id))
    expect(set.has(test.ID_JOHN_DOE)).toBe(true)
    expect(set.has(test.ID_ERIC_DUVERS)).toBe(true)
    expect(set.has(test.ID_INACTIVE)).toBe(true)
    expect(set.has(test.ID_TESSON)).toBe(true)

    // Active but on social supports or documents
    expect(set.has(test.UUID_JANE)).toBe(true)
    expect(set.has(test.UUID_GRECO)).toBe(true)
    expect(set.has(test.UUID_DOC)).toBe(true)

    expect(set.size).toBe(7)
  })
})

describe('Notification - Beneficiary Archive - List inactive beneficiaries that have received an archive due on one month notification already', () => {
  const ids = [
    'b7b7f676-2590-4198-9013-3d3318c4a5ed',
    'd5d025b8-80d2-40bf-9861-b24a11d75685'
  ]

  beforeEach(
    async () =>
      await NotificationRepo.prisma.createMany({
        data: [
          {
            id: ids[0],
            type: NotificationType.ArchiveDueOneMonth,
            beneficiaryId: test.ID_JOHN_DOE,
            recipientId: fixturesUsers[FixtureUserRole.StructureManager].id
          },
          {
            id: ids[1],
            type: NotificationType.ArchiveDueOneMonth,
            beneficiaryId: test.ID_INACTIVE,
            recipientId: fixturesUsers[FixtureUserRole.StructureManager].id
          }
        ]
      })
  )

  afterEach(
    async () =>
      await NotificationRepo.prisma.deleteMany({ where: { id: { in: ids } } })
  )

  it('should return only that have an ArchiveDueOneMonth notification associated', async () => {
    const beneficiaries =
      await getInactiveBeneficiariesWithOneMonthNotification()

    const set = new Set(beneficiaries.map(b => b.id))
    expect(set.has(test.ID_JOHN_DOE)).toBe(true)
    expect(set.has(test.ID_ERIC_DUVERS)).toBe(false)
    expect(set.has(test.ID_INACTIVE)).toBe(true)
    expect(set.has(test.ID_TESSON)).toBe(false)
    expect(set.size).toBe(2)
  })
})
