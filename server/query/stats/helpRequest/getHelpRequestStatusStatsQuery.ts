import { HelpRequestConstraints, HelpRequestRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareHelpRequestStatFilters } from '~/utils/filters'

export async function getHelpRequestStatusStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = prepareHelpRequestStatFilters(input)
  Object.assign(where, HelpRequestConstraints.get(user))

  return await HelpRequestRepo.prisma.groupBy({
    by: ['status'],
    where,
    _count: true,
    orderBy: { _count: { status: 'desc' } }
  })
}
