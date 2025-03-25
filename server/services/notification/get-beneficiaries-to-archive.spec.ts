import { describe, it } from 'vitest'
import { prismaClient } from '~/server/prisma'
import { getInactiveBeneficiaries } from './helper'
import dayjs from 'dayjs'

// Ce test à pour but d'évaluer le nombre de bénéficiaire à archiver par structure
// SVP ne pas inclure dans la CI
describe.skip('Nombre de bénéficiaires à archiver par structure', () => {
  it('should return noting', async () => {
    const mustBeArchivedBeneficiaries = (
      await getInactiveBeneficiaries(true)
    ).filter(b => dayjs(b.archiveDate).subtract(1, 'month').isBefore(dayjs()))

    const structures = mustBeArchivedBeneficiaries
      .map(beneficiary => beneficiary.structure?.name || '')
      .filter(s => Boolean(s))

    const occurences = countOccurrences(structures)
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
