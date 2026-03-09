import { prepareHelpRequestStatFilters } from '../helpers'
import {
  MinisterRepo,
  SocialSupportConstraints,
  SocialSupportRepo
} from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'
import { formatMinisterName } from '~/utils/minister'

export async function getHelpRequestMinistreStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = { where: prepareHelpRequestStatFilters(input) }
  appendConstraints(user, where, SocialSupportConstraints.get)

  const res = await SocialSupportRepo.prisma.groupBy({
    by: ['ministerId'],
    ...where,
    _count: true,
    orderBy: { _count: { ministerId: 'desc' } }
  })

  const ministers = await MinisterRepo.findMany(user, {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      function: true,
      government: true,
      status: true
    }
  })

  return res.map(r => {
    const minister = ministers.find(m => m.id === r.ministerId)
    if (minister) {
      return {
        _count: r._count,
        minister: formatMinisterName(minister)
      }
    }
    return {}
  })
}
