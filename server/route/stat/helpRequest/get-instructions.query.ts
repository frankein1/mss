import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
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
