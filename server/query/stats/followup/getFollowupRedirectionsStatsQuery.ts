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
        partnerOrganizationId: true,
        socialSupport: { select: { beneficiaryId: true } }
      }
    }),
    PartnerOrganizationRepo.findMany(user, { select: { id: true, name: true } })
  ])

  const countByTypes = getCountByTypes(redirections)

  const countByPartners = getCountByPartners(redirections, orgs)

  return {
    followupsWithRedirections: {
      _count: new Set(redirections.map(r => r.socialSupportId)).size
    },
    beneficiariesWithRedirections: {
      _count: new Set(redirections.map(r => r.socialSupport.beneficiaryId)).size
    },
    withTypeIsPartners: {
      _count: countByTypes['PartnerOrganization'],
      partners: countByPartners
    },
    withTypeIsIntern: {
      _count: countByTypes['Intern']
    },
    withTypeIsOther: {
      _count: countByTypes['Other']
    }
  }
}
