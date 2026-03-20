import {
  computeRedirectionsStats,
  prepareFollowupStatFilters
} from '../helpers'
import { SocialSupportRepo } from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getFollowupRedirectionsStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const preparedFilters = prepareFollowupStatFilters(input)

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
  const followupsWithRedirections = socialSupports.filter(
    s => s.socialSupportRedirections.length > 0
  )

  return {
    followups: {
      _count: socialSupports.length
    },
    followupsWithRedirections: {
      _count: followupsWithRedirections.length
    },
    ...computeRedirectionsStats(allRedirections)
  }
}
