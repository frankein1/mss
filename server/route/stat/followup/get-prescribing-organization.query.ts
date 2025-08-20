import { createQuery } from '~/server/route'
import { getFollowupPrescribingOrganizationStatsQuery } from '~/server/query/stats'
import type { ProtectedAppContext } from '~/server/trpc'
import type { StatFilterInput } from '~/server/schema'
import { statFilterSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.stats

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getFollowupPrescribingOrganizationStatsQuery(user, input)
}

export const getFollowupPrescribingOrganizationStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
