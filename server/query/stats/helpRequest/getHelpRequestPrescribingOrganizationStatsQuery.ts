import {
  preparePrescribingOrganizationStats,
  prepareHelpRequestStatFilters
} from '../helpers'
import { SocialSupportRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getHelpRequestPrescribingOrganizationStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const preparedFilters = prepareHelpRequestStatFilters(input)

  const socialSupports = await SocialSupportRepo.findMany(user, {
    where: preparedFilters,
    select: {
      fileInstruction: {
        select: {
          helpRequest: {
            select: {
              prescribingOrganization: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      }
    }
  })

  const fileInstructions = socialSupports.reduce(
    (fu, { fileInstruction }) =>
      fileInstruction !== null ? [...fu, fileInstruction] : fu,
    [] as Array<Exclude<(typeof socialSupports)[0]['fileInstruction'], null>>
  )

  const helpRequests = []
  for (const fi of fileInstructions) {
    if (fi.helpRequest) {
      helpRequests.push(fi.helpRequest)
    }
  }

  return preparePrescribingOrganizationStats(helpRequests)
}
