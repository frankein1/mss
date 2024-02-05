import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { StatFilterInput, statFilterSchema } from '~/server/schema'
import { getBeneficiaryCountQuery } from '~/server/query/stats'
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
  return await getBeneficiaryCountQuery(user, input)
}

export const getBeneficiaryCountQ = createQuery({
  inputValidation: statFilterSchema,
  securityCheck,
  handler
})
