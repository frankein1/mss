import { SocialSupportType } from '@prisma/client'
import { prepareSocialSupportStatFilters } from '../helpers'
import {
  BeneficiaryHistoryConstraints,
  BeneficiaryHistoryRepo
} from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

export async function getFollowupStatusStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = { where: prepareSocialSupportStatFilters(input) }
  appendConstraints(user, where, BeneficiaryHistoryConstraints.get)

  return await BeneficiaryHistoryRepo.prisma.groupBy({
    by: ['status'],
    where: { ...where, socialSupportType: SocialSupportType.Followup },
    _count: true,
    orderBy: { _count: { status: 'desc' } }
  })
}
