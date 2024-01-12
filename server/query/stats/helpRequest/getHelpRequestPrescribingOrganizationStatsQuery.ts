import {
  preparePrescribingOrganizationStats,
  prepareSocialSupportStatFilters
} from '../helpers'
import { SocialSupportRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getHelpRequestPrescribingOrganizationStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const preparedFilters = prepareSocialSupportStatFilters(input)

  const socialSupports = await SocialSupportRepo.findMany(user, {
    where: {
      socialSupportType: 'HelpRequest',
      ...preparedFilters
    },
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
  })

  const helpRequests = socialSupports.reduce(
    (fu, { helpRequest }) => (helpRequest !== null ? [...fu, helpRequest] : fu),
    [] as Array<Exclude<(typeof socialSupports)[0]['helpRequest'], null>>
  )

  return preparePrescribingOrganizationStats(helpRequests)
}
