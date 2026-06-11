import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { StatFilterInput } from '~/server/schema'
import { statFilterSchema } from '~/server/schema'
import { getMinistereCategorieStatsQuery } from '~/server/query/stats'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).stats.view

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getMinistereCategorieStatsQuery(user, input)
}

export const getMinistereCategorieStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
