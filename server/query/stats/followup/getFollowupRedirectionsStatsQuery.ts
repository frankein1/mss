import type { SocialSupportRedirectionType } from '@prisma/client'
import { prepareFollowupStatFilters } from '../helpers'
import { PartnerOrganizationRepo, RedirectionRepo } from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'
import { STATS_NULL_LABEL } from '~/utils/constants/stats'

const getCountByPartners = (
  redirections: { partnerOrganizationId: string | null }[],
  orgs: { id: string; name: string }[]
) => {
  const organizationNames = orgs.reduce<Record<string, string>>(
    (acc, cur) => ({ ...acc, [cur.id]: cur.name }),
    {}
  )

  const groupbypartners = redirections.reduce(
    (acc, { partnerOrganizationId }) => {
      if (!partnerOrganizationId) {
        return acc
      }
      return {
        ...acc,
        [partnerOrganizationId]: {
          id: partnerOrganizationId,
          name: organizationNames[partnerOrganizationId] || STATS_NULL_LABEL,
          _count: (acc[partnerOrganizationId] || { _count: 0 })._count + 1
        }
      }
    },
    {} as Record<string, { id: string; name: string; _count: number }>
  )

  return Object.values(groupbypartners).toSorted((a, b) => b._count - a._count)
}

const getCountByTypes = (
  redirections: { type: SocialSupportRedirectionType }[]
) => {
  return redirections.reduce<Record<SocialSupportRedirectionType, number>>(
    (acc, { type }) => ({
      ...acc,
      [type]: (acc[type] || 0) + 1
    }),
    { PartnerOrganization: 0, Intern: 0, Other: 0 }
  )
}

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
