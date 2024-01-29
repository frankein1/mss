import { prepareHelpRequestStatFilters } from '../helpers'
import {
  SocialSupportConstraints,
  HousingHelpRequestRepo
} from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'

export async function getHelpRequestHousingStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const filters = { where: prepareHelpRequestStatFilters(input) }
  appendConstraints(user, filters, SocialSupportConstraints.get)

  const [
    housingHelpRequestCount,
    housingHelpRequestContextCount,
    housingHelpRequestReasonCount
  ] = await Promise.all([
    HousingHelpRequestRepo.count(user, {
      where: {
        socialSupport: filters.where
      }
    }),
    HousingHelpRequestRepo.prisma.groupBy({
      by: ['isFirst'],
      where: {
        socialSupport: filters.where
      },
      _count: true,
      orderBy: { _count: { isFirst: 'desc' } }
    }),
    HousingHelpRequestRepo.prisma.groupBy({
      by: ['reason'],
      where: {
        socialSupport: filters.where
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
