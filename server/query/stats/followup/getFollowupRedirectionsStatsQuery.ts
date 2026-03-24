import {
  getCountByPartners,
  getCountByTypes,
  prepareFollowupStatFilters
} from '../helpers'
import { PartnerOrganizationRepo, RedirectionRepo } from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getFollowupRedirectionsStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const preparedFilters = prepareFollowupStatFilters(input)

  const [redirections, orgs] = await Promise.all([
    RedirectionRepo.findMany(user, {
      where: { socialSupport: preparedFilters },
      select: {
        socialSupportId: true,
        type: true,
        partnerOrganizationId: true
      }
    }),
    PartnerOrganizationRepo.findMany(user, { select: { id: true, name: true } })
  ])

  const countbytypes = getCountByTypes(redirections)

  const countbypartners = getCountByPartners(redirections, orgs)

  return {
    followupsWithRedirections: {
      _count: new Set(redirections.map(r => r.socialSupportId)).size
    },
    withTypeIsPartners: {
      _count: countbytypes['PartnerOrganization'],
      partners: countbypartners
    },
    withTypeIsIntern: {
      _count: countbytypes['Intern']
    },
    withTypeIsOther: {
      _count: countbytypes['Other']
    }
  }
}
