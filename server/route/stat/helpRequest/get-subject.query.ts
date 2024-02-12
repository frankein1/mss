import { createQuery } from '~/server/route'
import { getFileInstructionTypeStatsQuery } from '~/server/query/stats'
import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.stats

const handler = async ({
  input,
  ctx: { user }
}: {
  input: StatFilterInput
  ctx: ProtectedAppContext
}) => {
  return await getFileInstructionTypeStatsQuery(user, input)
}

export const getFileInstructionTypeStatsQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
