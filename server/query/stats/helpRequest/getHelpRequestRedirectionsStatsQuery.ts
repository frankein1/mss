import {
  computeRedirectionsStats,
  prepareHelpRequestStatFilters
} from '../helpers'
import { SocialSupportRepo } from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getHelpRequestRedirectionsStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const preparedFilters = prepareHelpRequestStatFilters(input)

  const socialSupports = await SocialSupportRepo.findMany(user, {
    where: preparedFilters,
    select: {
      socialSupportRedirections: {
        select: {
          id: true,
          type: true,
          motif: true,
          partnerOrganizationId: true,
          partnerOrganization: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  })

  const allRedirections = socialSupports.flatMap(
    s => s.socialSupportRedirections
  )
  const socialSupportsWithRedirections = socialSupports.filter(
    s => s.socialSupportRedirections.length > 0
  )

  return {
    helpRequests: {
      _count: socialSupports.length
    },
    helpRequestsWithRedirections: {
      _count: socialSupportsWithRedirections.length
    },
    ...computeRedirectionsStats(allRedirections)
  }
}
