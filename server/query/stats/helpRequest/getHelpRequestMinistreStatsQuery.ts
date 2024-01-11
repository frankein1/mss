import { prepareSocialSupportStatFilters } from '../helpers'
import { SocialSupportConstraints, SocialSupportRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

export async function getHelpRequestMinistreStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = { where: prepareSocialSupportStatFilters(input) }
  appendConstraints(user, where, SocialSupportConstraints.get)

  return await SocialSupportRepo.prisma.groupBy({
    by: ['ministre'],
    ...where,
    _count: true,
    orderBy: { _count: { ministre: 'desc' } }
  })
}
