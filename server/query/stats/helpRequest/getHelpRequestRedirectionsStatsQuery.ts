import {
  getCountByPartners,
  getCountByTypes,
  prepareHelpRequestStatFilters
} from '../helpers'
import { PartnerOrganizationRepo, RedirectionRepo } from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getHelpRequestRedirectionsStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const preparedFilters = prepareHelpRequestStatFilters(input)

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
    helpRequestsWithRedirections: {
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
