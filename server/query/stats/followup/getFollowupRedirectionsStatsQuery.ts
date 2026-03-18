import { SocialSupportRedirectionType } from '@prisma/client'
import {
  preparePrescribingOrganizationStats,
  prepareSocialSupportStatFilters
} from '../helpers'
import { FollowupRepo } from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getFollowupRedirectionsStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const preparedSocialSupportFilters = prepareSocialSupportStatFilters(input)

  const followups = await FollowupRepo.findMany(user, {
    where: {
      socialSupport: preparedSocialSupportFilters
    },
    select: {
      socialSupport: {
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
      }
    }
  })

  const allRedirections = followups.flatMap(
    f => f.socialSupport.socialSupportRedirections
  )
  const followupsWithRedirections = followups.filter(
    f => f.socialSupport.socialSupportRedirections.length > 0
  )
  const partnerRedirections = allRedirections.filter(
    r => r.type === SocialSupportRedirectionType.PartnerOrganization
  )
  const internCount = allRedirections.filter(
    r => r.type === SocialSupportRedirectionType.Intern
  ).length
  const otherCount = allRedirections.filter(
    r => r.type === SocialSupportRedirectionType.Other
  ).length

  const partners = partnerRedirections
    .filter(
      p =>
        p.type === SocialSupportRedirectionType.PartnerOrganization &&
        p.partnerOrganization != null
    )
    .map(r => ({
      prescribingOrganization: {
        id: r.partnerOrganization?.id || '',
        name: r.partnerOrganization?.name || ''
      }
    }))

  return {
    followups: {
      _count: followups.length
    },
    followupsWithRedirections: {
      _count: followupsWithRedirections.length
    },
    withTypeIsPartners: {
      _count: partnerRedirections.length,
      partners: preparePrescribingOrganizationStats(partners)
    },
    withTypeIsIntern: {
      _count: internCount
    },
    withTypeIsOther: {
      _count: otherCount
    }
  }
}
