import {
  HelpRequestRepo,
  appendConstraintOnHelpRequest
} from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

export async function getHelpRequestMinistreStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = prepareHelpRequestStatFilters(input)
  appendConstraintOnHelpRequest(user, where)

  return await HelpRequestRepo.groupBy({
    by: ['ministre'],
    where,
    _count: true,
    orderBy: { _count: { ministre: 'desc' } }
  })
}
