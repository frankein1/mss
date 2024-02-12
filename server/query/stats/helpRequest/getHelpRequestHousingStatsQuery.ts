import { SocialSupportType } from '@prisma/client'
import { prepareSocialSupportStatFilters } from '../helpers'
import {
  SocialSupportConstraints,
  HousingHelpRequestRepo,
  SocialSupportRepo
} from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

export async function getHelpRequestHousingStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const socialSupportFilters = {
    ...prepareSocialSupportStatFilters(input),
    socialSupportType: SocialSupportType.HelpRequestHousing
  }
  const socialSupportWhere = { where: socialSupportFilters }
  appendConstraints(user, socialSupportWhere, SocialSupportConstraints.get)

  const [
    housingHelpRequestCount,
    housingHelpRequestContextCount,
    housingHelpRequestReasonCount
  ] = await Promise.all([
    SocialSupportRepo.count(user, { where: socialSupportFilters }),
    HousingHelpRequestRepo.prisma.groupBy({
      by: ['isFirst'],
      where: {
        fileInstruction: { socialSupport: socialSupportWhere.where }
      },
      _count: true,
      orderBy: { _count: { isFirst: 'desc' } }
    }),
    HousingHelpRequestRepo.prisma.groupBy({
      by: ['reason'],
      where: {
        fileInstruction: { socialSupport: socialSupportWhere.where }
      },
      _count: true,
      orderBy: { _count: { reason: 'desc' } }
    })
  ])

  return {
    housingHelpRequestCount,
    housingHelpRequestContextCount,
    housingHelpRequestReasonCount
  }
}
