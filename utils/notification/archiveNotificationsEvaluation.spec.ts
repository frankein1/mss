import { describe, it } from 'vitest'
import { prismaClient } from '~/server/prisma'
import { getInactiveBeneficiaries } from './archiveNotifications'
import { BeneficiaryService } from '~/server/services'
import dayjs from 'dayjs'

// Ce test à pour but d'évaluer le nombre de bénéficiaire à archiver par structure
// SVP ne pas inclure dans la CI
describe.skip('Nombre de bénéficiaires à archiver par structure', () => {
  it('should return noting', async () => {
    const inactiveBeneficiaries = await getInactiveBeneficiaries()

    const mustBeArchivedBeneficiaries = inactiveBeneficiaries
      .filter(beneficiary => {
        const lastActivity =
          BeneficiaryService.getBeneficiaryLastActivity(beneficiary)
        const archiveDate = BeneficiaryService.getArchiveDate(
          lastActivity,
          beneficiary.archiveDueDate
        )
        return dayjs(archiveDate).subtract(1, 'month').isBefore(dayjs())
      })
      .map(beneficiary => ({
        id: beneficiary.id,
        lastActivity:
          BeneficiaryService.getBeneficiaryLastActivity(beneficiary),
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
