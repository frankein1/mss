import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { StatFilterInput } from '~/server/schema'
import { statFilterSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { getHelpRequestInstructionsStats } from '~/server/query/stats/helpRequest/getHelpRequestInstructionsStats'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.stats

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getHelpRequestInstructionsStats(user, input)
}

export const getHelpRequestInstructionsStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
