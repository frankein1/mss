import { describe, it, expect, afterEach } from 'vitest'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'
import { BeneficiaryRepo, FamilyFileRepo } from '~~/server/database'
import {
  fixtureStructures,
  fixturesUsers,
  FixtureUserRole
} from '~~/prisma/fixtures'
import { getInactiveBeneficiaries } from './helper'

const ago = (value: number, unit: dayjs.ManipulateType) =>
  dayjs().subtract(value, unit).toDate()

/** A bit more than the given delay, to stay clear of the exact boundary */
const justOver = (value: number, unit: dayjs.ManipulateType) =>
  dayjs().subtract(value, unit).subtract(1, 'day').toDate()

/** An archive due date is stored without time (`@db.Date`), so it is set at midnight
 * to keep the expected archive dates exact */
const dueIn = (value: number, unit: dayjs.ManipulateType) =>
  dayjs().add(value, unit).startOf('day').toDate()

const structureManagerId = fixturesUsers[FixtureUserRole.StructureManager].id
const referentId = fixturesUsers[FixtureUserRole.Referent].id
const instructorActiveId = fixturesUsers[FixtureUserRole.InstructorActive].id

/** Referents of every beneficiary below: only the structure manager is notified
 * until the beneficiary has been inactive for 2 years */
const REFERENTS = [
  FixtureUserRole.StructureManager,
  FixtureUserRole.Referent,
  FixtureUserRole.InstructorActive,
  // never notified, whatever the inactivity delay
  FixtureUserRole.ReceptionAgent,
  // disabled user, filtered out by the `select` helper
  FixtureUserRole.Instructor
]

const createdIds: string[] = []

const createBeneficiary = async ({
  lastActivity,
  created = ago(4, 'years'),
  archiveDueDate = null
}: {
  lastActivity: Date | null
  created?: Date
  archiveDueDate?: Date | null
}) => {
  const id = randomUUID()
  createdIds.push(id)

  await FamilyFileRepo.prisma.create({
    data: {
      id,
      structureId: fixtureStructures[0].id,
      referents: {
        connect: REFERENTS.map(role => ({ id: fixturesUsers[role].id }))
      }
    }
  })
  await BeneficiaryRepo.prisma.create({
    data: {
      id,
      familyFileId: id,
      fileNumber: id.slice(0, 10),
      structureId: fixtureStructures[0].id,
      status: 'Active',
      usualName: 'INACTIF',
      firstName: 'Test',
      created,
      updated: created,
      lastActivity,
      archiveDueDate
    }
  })

  return id
}

const findSelected = async (id: string) =>
  (await getInactiveBeneficiaries()).find(b => b.id === id)

const isSelected = async (id: string) => Boolean(await findSelected(id))

afterEach(async () => {
  await FamilyFileRepo.prisma.deleteMany({ where: { id: { in: createdIds } } })
  createdIds.length = 0
})

describe('Notification - Beneficiary Archive - getInactiveBeneficiaries', () => {
  describe('beneficiaries due to be archived within a month', () => {
    it('should select a beneficiary inactive for more than 23 months', async () => {
      // No archive due date, so the archive date is lastActivity + 2 years,
      // which falls within the next month
      const id = await createBeneficiary({
        lastActivity: justOver(23, 'months')
      })

      expect(await isSelected(id)).toBe(true)
    })

    it('should not select a beneficiary inactive for less than 23 months', async () => {
      // The archive date is lastActivity + 2 years, so still a year away
      const id = await createBeneficiary({ lastActivity: ago(12, 'months') })

      expect(await isSelected(id)).toBe(false)
    })

    it('should not select an inactive beneficiary whose file is kept for 6 more months', async () => {
      // Keeping the file pushes the archive date back: nothing is due before then,
      // however old the last activity is
      const id = await createBeneficiary({
        lastActivity: ago(3, 'years'),
        archiveDueDate: dueIn(6, 'months')
      })

      expect(await isSelected(id)).toBe(false)
    })

    it('should select a beneficiary whose kept file reaches its due date', async () => {
      // Once the due date is within a month, the file is due to be archived again
      const id = await createBeneficiary({
        lastActivity: ago(3, 'years'),
        archiveDueDate: dueIn(3, 'days')
      })

      expect(await isSelected(id)).toBe(true)
    })

    it('should select a beneficiary whose due date is already past', async () => {
      // An overdue file must keep being reported
      const id = await createBeneficiary({
        lastActivity: ago(3, 'years'),
        archiveDueDate: dueIn(-2, 'months')
      })

      expect(await isSelected(id)).toBe(true)
    })

    it('should not select a beneficiary active since the file was kept', async () => {
      // The file was kept about a year ago and there has been activity since,
      // so the archive date is lastActivity + 2 years, not the due date
      const id = await createBeneficiary({
        lastActivity: ago(2, 'months'),
        archiveDueDate: dueIn(10, 'days')
      })

      expect(await isSelected(id)).toBe(false)
    })

    it('should select a beneficiary with no activity since the file was kept, even below 23 months of inactivity', async () => {
      // The last activity predates the moment the file was kept, so the due date
      // applies: it is reached within a month
      const id = await createBeneficiary({
        lastActivity: justOver(12, 'months'),
        archiveDueDate: dueIn(10, 'days')
      })

      expect(await isSelected(id)).toBe(true)
    })

    it('should select a beneficiary whose file was kept 3 years ago, with activity since', async () => {
      // The activity resets the delay: the archive date is lastActivity + 2 years,
      // reached within a month, and no longer the long past due date
      const id = await createBeneficiary({
        lastActivity: justOver(23, 'months'),
        archiveDueDate: dueIn(-2, 'years')
      })

      expect(await isSelected(id)).toBe(true)
    })

    it('should select a beneficiary with no activity at all, created more than 23 months ago', async () => {
      // Without any activity, the delay runs from the creation date
      const id = await createBeneficiary({
        lastActivity: null,
        created: ago(3, 'years')
      })

      expect(await isSelected(id)).toBe(true)
    })

    it('should not select a beneficiary with no activity at all, created less than 23 months ago', async () => {
      const id = await createBeneficiary({
        lastActivity: null,
        created: ago(12, 'months')
      })

      expect(await isSelected(id)).toBe(false)
    })
  })

  describe('archive date', () => {
    it('should be the due date when the file has not been touched since it was kept', async () => {
      const archiveDueDate = dueIn(-2, 'months')
      const id = await createBeneficiary({
        lastActivity: ago(3, 'years'),
        archiveDueDate
      })

      expect((await findSelected(id))?.archiveDate).toEqual(archiveDueDate)
    })

    it('should be the creation date plus 2 years when there is no activity', async () => {
      const created = ago(3, 'years')
      const id = await createBeneficiary({ lastActivity: null, created })

      expect((await findSelected(id))?.archiveDate).toEqual(
        dayjs(created).add(2, 'year').toDate()
      )
    })
  })

  describe('recipients', () => {
    it('should only notify the structure manager below 2 years of inactivity', async () => {
      // Social workers, referents and instructors are notified from 2 years only
      const id = await createBeneficiary({
        lastActivity: justOver(23, 'months')
      })

      expect(new Set((await findSelected(id))?.referentIds)).toEqual(
        new Set([structureManagerId])
      )
    })

    it('should notify active referents above 2 years of inactivity, except reception agents', async () => {
      // The family file also holds a reception agent and a disabled instructor,
      // neither of which is ever notified
      const id = await createBeneficiary({
        lastActivity: ago(3, 'years'),
        archiveDueDate: dueIn(3, 'days')
      })

      expect(new Set((await findSelected(id))?.referentIds)).toEqual(
        new Set([structureManagerId, referentId, instructorActiveId])
      )
    })
  })
})
