import { SocialSupportType } from '@prisma/client'
import { prepareSocialSupportStatFilters } from '../helpers'
import {
  BeneficiaryHistoryConstraints,
  BeneficiaryHistoryRepo
} from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

export async function getHelpRequestStatusStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = {
    where: {
      ...prepareSocialSupportStatFilters(input),
      socialSupportType: SocialSupportType.HelpRequestOther
    }
  }
  appendConstraints(user, where, BeneficiaryHistoryConstraints.get)

  return await BeneficiaryHistoryRepo.prisma.groupBy({
    by: ['status'],
    ...where,
    _count: true,
    orderBy: { _count: { status: 'desc' } }
  })
}
