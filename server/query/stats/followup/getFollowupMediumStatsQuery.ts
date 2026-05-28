import { FollowupMedium } from '@prisma/client'
import { prepareSocialSupportStatFilters } from '../helpers'
import { FollowupRepo, FollowupConstraints } from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

export async function getFollowupMediumStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const socialSupportFilter = prepareSocialSupportStatFilters(input)

  const where = {
    where: { socialSupport: socialSupportFilter }
  }
  appendConstraints(user, where, FollowupConstraints.get)

  const [mediumStats, isThirdPartyInterviewCount] = await Promise.all([
    FollowupRepo.prisma.groupBy({
      by: ['medium'],
      where: {
        ...where.where,
        medium: { not: FollowupMedium.ThirdParty }
      },
      _count: true,
      orderBy: { _count: { medium: 'desc' } }
    }),
    FollowupRepo.count(user, {
      where: {
        socialSupport: socialSupportFilter,
        isThirdPartyInterview: true
      }
    })
  ])

  return { mediumStats, isThirdPartyInterviewCount }
}
