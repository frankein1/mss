import { prepareHelpRequestStatFilters } from '../helpers'
import { FileInstructionRepo } from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'
import { STATS_NULL_KEY, STATS_NULL_LABEL } from '~/utils/constants/stats'

type FileInstructionsResponse = {
  id: string
  externalStructure: boolean
  instructorOrganization: InstructorOrganization
}[]

type InstructorOrganization = {
  name: string
  id: string
} | null

export async function getHelpRequestInstructionsStats(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const socialSupport = { where: prepareHelpRequestStatFilters(input) }

  const instructions: FileInstructionsResponse =
    await FileInstructionRepo.findMany(user, {
      where: {
        socialSupport: {
          ...socialSupport.where
        }
      },
      select: {
        id: true,
        externalStructure: true,
        instructorOrganization: {
          select: {
            name: true,
            id: true
          }
        }
      }
    })

  // Reduce
  // TODO: add link on "STATS_NULL_KEY"
  const instructorOrganizationStats = instructions
    .filter(instruction => instruction.externalStructure)
    .reduce(
      (
        instructorOrganizations: {
          [k: string]: {
            id: string
            name: string
            _count: number
          }
        },
        item
      ) => {
        const instructorOrganizationId =
          item.instructorOrganization?.id || STATS_NULL_KEY
        if (instructorOrganizations[instructorOrganizationId] !== undefined) {
          instructorOrganizations[instructorOrganizationId]._count++
        } else {
          instructorOrganizations[instructorOrganizationId] = {
            id: instructorOrganizationId,
            name: item.instructorOrganization?.name || STATS_NULL_LABEL,
            _count: 1
          }
        }
        return instructorOrganizations
      },
      {}
    )

  const instructionStats = {
    fileInstructions: {
      _count: instructions.length,
      externalStructure: {
        _count: 0
      },
      internalStructure: {
        _count: 0
      },
      instructorOrganization: Object.values(instructorOrganizationStats)
    }
  }

  instructions.forEach(instruction => {
    if (instruction.externalStructure) {
      instructionStats.fileInstructions.externalStructure._count++
    } else {
      instructionStats.fileInstructions.internalStructure._count++
    }
  })

  return instructionStats
}
