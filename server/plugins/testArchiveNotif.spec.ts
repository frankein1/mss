import { describe, vi, beforeEach, afterEach, it } from 'vitest'
import { prismaClient } from '~/server/prisma'
import { getInactiveBeneficiaries } from './archiveNotifications'
import {
  getArchiveDate,
  getBeneficiaryLastActivity
} from '../services/beneficiary/get-last-activity.service'
import dayjs from 'dayjs'

// Ce test à pour but d'évaluer le nombre de bénéficiaire à archiver par structure
// SVP ne pas inclure dans la CI
describe.skip('Nombre de bénéficiaires à archiver par structure', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers()
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  it('should return noting', async () => {
    // set hour within business hours
    const dateNow = new Date()
    const future = new Date('2029-01-01') // timeout au dessus de 100 secondes
    const inOneYear = new Date('2026-01-01') // timeout au dessus de 100 secondes
    const inApril = new Date('2025-04-04')
    vi.setSystemTime(dateNow)

    const inactiveBeneficiaries = await getInactiveBeneficiaries()

    const mustBeArchivedBeneficiaries = inactiveBeneficiaries
      .filter(beneficiary => {
        const lastActivity = getBeneficiaryLastActivity(beneficiary)
        const archiveDate = getArchiveDate(
          lastActivity,
          beneficiary.archiveDueDate
        )
        return dayjs(archiveDate).subtract(1, 'month').isBefore(dayjs())
      })
      .map(beneficiary => ({
        id: beneficiary.id,
        lastActivity: getBeneficiaryLastActivity(beneficiary),
        archiveDueDate: beneficiary.archiveDueDate,
        structure: beneficiary.structure
      }))

    const structure = mustBeArchivedBeneficiaries.map(
      beneficiary => beneficiary.structure.name
    )

    const occurences = countOccurrences(structure)
    console.log(occurences)

    const structureLastActivity = await prismaClient.structure.findMany({
      where: {
        name: {
          in: Object.keys(occurences)
        }
      },
      select: {
        lastAccess: true,
        name: true
      }
    })

    const tableau = structureLastActivity.map(structure => {
      return {
        name: structure.name,
        lastAccess: structure.lastAccess?.toISOString()
          ? structure.lastAccess.toISOString()
          : null,
        nombreBeneficiaire: occurences[structure.name]
      }
    })

    console.log(tableau)
  })
}, 100000)

function countOccurrences(arr: string[]) {
  return arr.reduce((acc: Record<string, number>, val) => {
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {})
}
